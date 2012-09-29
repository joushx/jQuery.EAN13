/* 
* Copyright (c) 2012 Johannes Mittendorfer (http://jmittendorfer.hostingsociety.com)
* Licensed under the MIT License (LICENSE.txt).
*
* Version: 0.1
*/

(function($) {
	$.fn.EAN13 = function(number, print_number = true) {

		// EAN 13 code tables
		var x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
		var y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
		var z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];

		// countries table
		var countries = ["xxxxxx", "xxyxyy", "xxyyxy", "xxyyyx", "xyxxyy", "xyyxxy", "xyyyxx", "xyxyxy", "xyxyyx", "xyyxyx"];

		// canvas element reference
		var canvas = this[0];

		// get width of barcode element
		var width = canvas.width;

		// get width of barcode element
		if(print_number){
			var border_height = canvas.height-(0.1*canvas.height);
			var height = border_height-(0.1*border_height);
		}
		else{
			var border_height = canvas.height;
			var height = border_height-(0.1*border_height);
		}

		// calculate width of every element
		var item_width = width/95;

		// init code variable for saving of lines
		var code = "";

		// get country encoding
		var c_encoding = countries[parseInt(number.substr(0,1))].split("");

		// remove country-prefix
		number = number.substr(1);

		// get chars of input number
		var parts = number.split("");

		// loop through left groups
		for(var i = 0; i < 6; i++){
			if(c_encoding[i] == "x"){
				code += x[parts[i]];
			}
			else{
				code += y[parts[i]];
			}
		}

		// loop through right groups
		for(var i = 6; i < 12; i++){
			code += z[parts[i]];
		}

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

			// add left border
			context.fillRect(left, 0, item_width, border_height);
			left = left + item_width*2;
			context.fillRect(left, 0, item_width, border_height);
			left = left + item_width;

			// loop through left lines
			for(var i = 0; i < 42; i++){

				// in char in 1: draw a line
				if(lines[i] == "1"){
					// draw
					context.fillRect(left, 0, item_width, height);
				}

				// alter offset
				left = left + item_width;
			}

			// add center
			left = left + item_width;
			context.fillRect(left, 0, item_width, border_height);
			left = left + item_width*2;
			context.fillRect(left, 0, item_width, border_height);
			left = left + item_width*2;

			// loop through right lines
			for(var i = 42; i < 84; i++){

				// in char in 1: draw a line
				if(lines[i] == "1"){
					// draw
					context.fillRect(left, 0, item_width, height);
				}

				// alter offset
				left = left + item_width;
			}

			// add right border
			context.fillRect(left, 0, item_width, border_height);
			left = left + item_width*2;
			context.fillRect(left, 0, item_width, border_height);

			// add number representation if print_number == true
			if(print_number){

				// set font style
				context.font = '30px monospace';

				// init offset
				var offset = item_width*4;

				// loop though left chars
				$.each(number.substr(0,6).split(""), function(k,v){

					// print text
					context.fillText(v, offset, height+25);
					
					// alter offset
					offset += 31;
				});
				
				offset = 50*item_width;
				
				// loop though right chars
				$.each(number.substr(6).split(""), function(k,v){

					// print text
					context.fillText(v, offset, height+25);
					
					// alter offset
					offset += 31;
				});
			}
		}
		else{
			alert("jQuery.EAN13: error!");
		}
	};
})( jQuery );