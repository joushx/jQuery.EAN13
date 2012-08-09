#jQuery.EAN13
... is a jQuery plugin for generating EAN-13 barcodes

<center><img src="http://upload.wikimedia.org/wikipedia/commons/thumb/8/84/EAN13.svg/800px-EAN13.svg.png" style="width: 250px;" /></center>

##Usage##
In the place where you want to have the barcode insert an `canvas`-element:

	<canvas id="ean" width="200" height="100">
		Your browser does not support canvas-elements.
	</canvas>

Then let the plugin do the rest:

	$("#ean").EAN13("7267328656725");

##Warning!##
This plugin is currently in alpha-status. It **will** crash your browser. It is not working at the moment!

