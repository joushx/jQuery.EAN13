(function( $ ) {
  $.fn.EAN13 = function(number) {
	
	var x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
	var y = new Array();
	var z = new Array();
	
	var width = this.width();
	var height = this.height();
	
	var item_width = width/95;
        
		console.log(this);
		
    jQuery.each(x, function(k,v){
		var result = "";
		var chars = v.split("");
		$.each(chars, function(k,v){
			if(v == "0"){
				result += "1";
			}
			else{
				result += "0";
			}
		});
		z.push(result);
		y.push(result.split("").reverse().join(""));
	});
	
	if(this[0].getContext){
        var context = this[0].getContext('2d');
        context.fillStyle = "rgb(0, 0, 0)";
		
		context.fillRect(0, 0, item_width, height);

		context.fillRect(3*item_width, 0, item_width, height);
		
		var left = 5*item_width;
		var switcher = "x";
		
		for(var i = 0; i < 6; i++){
			var code = null;
			if(switcher == "x"){
				code = x;
				switcher = "y";
			}
			else{
				code = y;
				switcher = "x";
			}
			
			
			
			for(var j = 0; j < 7; i++){
				if(items[j] == "1"){
					context.fillRect(left, 0, item_width, height-20);
				}
				left = left + item_width;
			}
		}
		
		context.fillRect(left, 0, item_width, height);
			left = left + 2*item_width;
			context.fillRect(left, 0, item_width, height);
			left = left + 2*item_width;
			
		for(var i = 0; i < 6; i++){
			var code = z;		
			var items = number.substr(i+7,1).split("");
			
			for(var j = 0; j < 7; i++){
				if(items[j] == "1"){
					context.fillRect(left, 0, item_width, height-20);
				}
				left = left + item_width;
			}
		}
		
		context.fillRect(left, 0, item_width, height);
			left = left + 2*item_width;
			context.fillRect(left, 0, item_width, height);
			left = left + 2*item_width;
    }
	else{
		alert("EAN13: error!");
	}
  };
})( jQuery );