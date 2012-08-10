(function( $ ) {
  $.fn.EAN13 = function(number) {
	
	// EAN 13 code tables
	var x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
	var y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
	var z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];

	// get width of barcode element
	var width = this.width();
	
	// get width of barcode element
	var height = this.height();
	
	// calculate width of every element
	var item_width = width/95;
	
	// init code var for save of lines
	var code = "";
	
	// add left border code
	code += "101";

	
	// get chars of input number
	var parts = number.split("");
	
	// init var for currently used table (switching between x and y)
	var table;
	
	// init var for name of currently used table
	var switcher = "x";
	
	// loop through chars of input
	for(var i = 1; i < 13; i++){
	
		// select x-table, switch to y for next
		if(switcher == "x"){
			table = x;
			switcher = "y";
		}
		else{
			table = y;
			switcher = "x";
		}
		
		// add char at i-position to code var
		code += table[parts[i]];
		
		// if i=6 add central code
		if(i = 6){
			code += "01010";
		}
	}
	
	// add right border code
	code += "101";
		
	// check if canvas-element is available
	if(this[0].getContext){
		
		// get draw context
        var context = this[0].getContext('2d');
		
		// set fill colot to black
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