// reads the lines and extracts the number
function read(canvas){
  // get pixels
  var ctx = canvas.getContext("2d");
  var img = ctx.getImageData(0, 0, canvas.width, 1);
  var pix = img.data;

  var bits = "";

  // read lines out of pixel array
  for (var i = 5*4; i < pix.length; i += 4 * 10) {

    if(pix[i] == 0){ // black
      bits += "1";
    }
    else{            // white
      bits += "0";
    }
  }

  // extract digits
  var dict = [
    ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"], // L
    ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"], // G
    ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"] // R
  ]

  var table_usage = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

  var extracted_number = "";
  var used_tables = "";

  // first group
  for(var i = 0; i < 6*7; i+=7){
    var digit = bits.substr(i+3, 7);

    for(var j = 0; j < 10; j++){
      if(dict[0][j] == digit){
        extracted_number += j;
        used_tables += "L";
        break;
      }

      if(dict[1][j] == digit){
        extracted_number += j;
        used_tables += "G";
        break;
      }
    }
  }

  // second group
  for(var i = 0; i < 6*7; i+=7){
    var digit = bits.substr(i+3+6*7+5, 7);

    for(var j = 0; j < 10; j++){
      if(dict[2][j] == digit){
        extracted_number += j;
        break;
      }
    }
  }

  // extract prefix
  var prefix = 0;
  for(var i = 0; i < 10; i++){
    if(table_usage[i] == used_tables){
      prefix = i;
      break;
    }
  }

  return prefix.toString(10) + extracted_number;
}
