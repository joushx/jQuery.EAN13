(function( $ ) {
	$.fn.EAN13 = function(number) {

		// EAN 13 code tables
		var x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
		var y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
		var z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];

		// canvas element reference
		var canvas = this[0];

		// get width of barcode element
		var width = canvas.width;

		// get width of barcode element
		var height = canvas.height;

		// calculate width of every element
		var item_width = width/95;

		delete(width);

		// init code var for save of lines
		var code = "";

		// add left border code
		code += "101";

		// get chars of input number
		var parts = number.split("");

		// loop through chars of input
		for(var i = 1; i < 13; i++){
			if((i%2) == 1){
				code += x[parts[i]];
			}
			else{
				code += y[parts[i]];
			}

			// if i=6 add central code
			if(i = 6){
				code += "01010";
			}
		}

		delete(parts);

		// add right border code
		code += "101";

		// check if canvas-element is available
		if(canvas.getContext){

			// get draw context
			var context = canvas.getContext('2d');

			// set fill color to black
			context.fillStyle = "rgb(0, 0, 0)";

			// init var for offset in x-axis
			var left = 0;

			// get chars of code for drawing every line
			var lines = code.split("");

			// loop through lines
			for(var i = 0; i < code.lenght; i++){

				// in char in 1: draw a line
				if(lines[i] == "1"){

					// draw
					context.fillRect(left, 0, item_width, height);
				}

				// alter offset
				left = left + item_width;	
			}
		}
		else{
			alert("EAN13: error!");
		}
	};
})( jQuery );