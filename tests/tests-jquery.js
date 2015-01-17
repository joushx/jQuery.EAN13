QUnit.test("no canvas element passed", function(assert) {
	$(document).EAN13("5449000096241", {
    	onError: function(){
        	assert.ok(true, "onError called");
        },
        onSuccess: function(){
        	assert.ok(false, "onSuccess called");
        }
    });
});

QUnit.test("check generated line data", function(assert) {

    var number = "5449000096241";
    var code = "010001100111010010111000110100011010100111111001011101001010000110110010111001100110";

	var object = $("#ean").EAN13(number,{
		prefix: false,
		debug: true,
		onSuccess: function(){
            var ctx = document.getElementById("ean").getContext("2d");
            assert.equal(readNumber(ctx), "101" + code.substring(0,42) + "01010" + code.substring(42) + "101", "Code is readable");
        },
        onError: function(){
        	assert.ok(false, "Something went wrong");
        }
	});
    
    if(object.data('plugin_EAN13').getCode() == code){
    	assert.ok(true, "Generated code correct");
    }
    else{
    	assert.ok(false, "Generated code incorrect");
    }
});

QUnit.test("check number is only printed if requested", function(assert) {

	var number = "5449000096241";

    $("#ean").EAN13(number, {
        number: false,
        onSuccess: function(){
           	var ctx = document.getElementById("ean").getContext("2d");

            if(numberPrinted(ctx)){
              ok(false,"Number printed also when off");
            }
            else{
              ok(true,"Number not printed");
            }
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