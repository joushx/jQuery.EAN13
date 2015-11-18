QUnit.module("callbacks");

QUnit.test("no canvas element passed", function(assert) {
	$(document).EAN13("5449000096241", {
    	onError: function(desc){
        	assert.ok(true, "onError called");
					assert.equal(desc, "canvas context is null");
        },
        onSuccess: function(){
        	assert.ok(false, "onSuccess called");
        }
    });
});


QUnit.test("checksum", function(assert) {

    $("#ean").EAN13("4012345123456", {
        onValid: function(){
            assert.ok(true, "Valid barcode fires onValid");
        },
        onInvalid: function(){
            assert.ok(false, "Valid barcode fires onInvalid");
        }
    });

    $("#ean").EAN13("5901234123450", {
        onValid: function(){
           ok(false, "Invalid barcode fires onValid");
        },
        onInvalid: function(){
           ok(true, "Invalid barcode fires onInvalid");
        }
    });
});

QUnit.test("check if success callback is fired", function(assert) {

	var number = "5449000096241";

    $("#ean").EAN13("5449000096241", {
      	onSuccess: function(){
	    	assert.ok(true, "onSuccess called");
      	},
      	onError: function(){
      		assert.ok(false, "onError called");
      	}
    });
});

QUnit.module("encoding");

QUnit.test("read back numbers", function(assert) {
  var canvas = document.getElementById("ean");

  for(var i = 0; i < numbers.length; i++){
    create_and_compare(canvas, numbers[i], assert);
  }
});

function create_and_compare(canvas, number, assert){
  $("#ean").EAN13(number, {
    background: "#fff",
    prefix: false,
    debug: true,
		onSuccess: function(){
      var result = read(canvas);
      assert.equal(result, number, number + " reads back");
    },
    onError: function(){
    	assert.ok(false, "Something went wrong");
    }
	});
}
