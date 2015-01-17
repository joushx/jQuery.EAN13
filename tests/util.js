
// reads the barcode lines
function readNumber(ctx){
	var lines = [];
	var y = 100;
	for(var x = 0; x < 380; x+=4){
		var data = ctx.getImageData(x+2, y, 1, 1).data;
		if(data[3] != 0){
			lines.push(1);
		}
		else{
			lines.push(0);
		}
	}
	return lines.join("");
}

// checks if a number is printed below the barcode
function numberPrinted(ctx){
    var y = 190;
    for(var x = 0; x < 200; x++){
        var data = ctx.getImageData(x, y, 1, 1).data;
        if(data[3] != 0){
        	return false;
        }
    }
    return true;
}