QUnit.module("callbacks");

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

QUnit.module("options");

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

QUnit.module("encoding");

QUnit.asyncTest("5901234123457", function(assert) {

  var number = "5901234123457";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("9310779300005", function(assert) {

  var number = "9310779300005";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("5060204120848", function(assert) {

  var number = "5060204120848";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("3800065711135", function(assert) {

  var number = "3800065711135";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("9421023610112", function(assert) {

  var number = "9421023610112";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("1234567890128", function(assert) {

  var number = "1234567890128";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("3401312345624", function(assert) {

  var number = "3401312345624";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("5060204123733", function(assert) {

  var number = "5060204123733";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

QUnit.asyncTest("0012345123450", function(assert) {

  var number = "0012345123450";
  var canvas = document.getElementById("ean");

  read(canvas, number, assert);
});

function read(canvas, number, assert){
  var ean = new EAN13(canvas, number, {
    background: "#fff",
    //debug: true,
    prefix: false,
    padding: 20,
		onSuccess: function(){

      var dataURL = canvas.toDataURL("image/jpeg");

      Quagga.decodeSingle({
        decoder: {
          readers: ["ean_reader"]
        },
        locate: true,
        src: dataURL,
        locator: {
          patchSize: "x-large"
        }
      },
      function(result){
        var code;
        if(result.codeResult){
          code = result.codeResult.code;
        }
        assert.equal(number, code, "Code reads back");
        QUnit.start();
      });
    },
    onError: function(){
    	assert.ok(false, "Something went wrong");
      QUnit.start();
    }
	});
}
