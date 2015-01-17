QUnit.test("no canvas element passed", function(assert) {
    new EAN13(document, "5449000096241", {
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

	var ean = new EAN13(document.getElementById("ean"), number,{
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
    
    assert.equal(code, ean.getCode(), "Generated code is ok");
});

QUnit.test("check number is only printed if requested", function(assert) {

	var number = "5449000096241";

    new EAN13(document.getElementById("ean"), number, {
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

    new EAN13(document.getElementById("ean"), "5449000096241", {
      	onSuccess: function(){
	    	assert.ok(true, "onSuccess called");
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