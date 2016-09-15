class EAN13Barcode implements Barcode{
  validate(data: string){
    return this.generateCheckDigit(data.substring(0,-1)) == parseInt(data.substring(-1,1))
  }

  generateLineData(data: string){

  }

  generateCheckDigit(data: string){

    var sum = 0;

    // get digits
    var chars = data.split("");

    // multiply by 3 and 1
    chars.forEach((value, index) => {
      if(index % 2 == 0){
        sum += 1 * parseInt(value);
      }
      else{
        sum += 3 * parseInt(value);
      }
    });

    return (10-(sum%10)) % 10;
  }
}

var x = new EAN13Barcode();
alert(x.validate("!"));
