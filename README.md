#jQuery.EAN13
... is a jQuery plugin for generating EAN-13 barcodes

<center><img src="http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EAN13.svg/250px-EAN13.svg.png"/></center>

##Usage##
In the place where you want to have the barcode insert an `canvas`-element:

	<canvas id="ean" width="200" height="100">
		Your browser does not support canvas-elements.
	</canvas>

Then let the plugin do the rest:

	$("#ean").EAN13("7267328656725");

##<img src="http://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Zeichen_101.svg/100px-Zeichen_101.svg.png"/>Warning!##
This plugin is currently in alpha-status. It **will** crash your browser. It is not working at the moment!