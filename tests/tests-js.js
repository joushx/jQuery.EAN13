QUnit.module("callbacks");

QUnit.test("no canvas element passed", function(assert) {
    new EAN13(document, "5449000096241", {
        onError: function(desc){
            assert.ok(true, "onError called");
            assert.equal(desc, "canvas context is null");
        },
        onSuccess: function(){
            assert.ok(false, "onSuccess called");
        }
    });
});


QUnit.test("check if success callback is fired", function(assert) {

	var number = "5449000096241";

    new EAN13(document.getElementById("ean"), "5449000096241", {
      	onSuccess: function(){
	    	assert.ok(true, "onSuccess called");
      	},
      	onError: function(){
      		assert.ok(false, "onError called");
      	}
    });
});

QUnit.test("number is null", function(assert) {

    new EAN13(document.getElementById("ean"), null, {
      	onSuccess: function(){
	    	assert.ok(false, "onSuccess called");
      	},
      	onError: function(){
      		assert.ok(true, "onError called");
      	}
    });
});

QUnit.test("number is not numeric", function(assert) {

    new EAN13(document.getElementById("ean"), "foo", {
      	onSuccess: function(){
	    	assert.ok(false, "onSuccess called");
      	},
      	onError: function(){
      		assert.ok(true, "onError called");
      	}
    });
});

QUnit.test("check if success callback is fired without checksum", function(assert) {

    new EAN13(document.getElementById("ean"), "544900009624", {
      	onSuccess: function(number){
	    	assert.ok(true, "onSuccess called");
		assert.equal(number, "5449000096241", "Number is as expected");
      	},
      	onError: function(){
      		assert.ok(false, "onError called");
      	}
    });
});

QUnit.test("checksum", function(assert) {

    new EAN13(document.getElementById("ean"), "4012345123456", {
        onValid: function(){
            assert.ok(true, "Valid barcode fires onValid");
        },
        onInvalid: function(){
            assert.ok(false, "Valid barcode fires onInvalid");
        }
    });

    new EAN13(document.getElementById("ean"), "5901234123450", {
        onValid: function(){
           ok(false, "Invalid barcode fires onValid");
        },
        onInvalid: function(){
           ok(true, "Invalid barcode fires onInvalid");
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
  var ean = new EAN13(canvas, number, {
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
