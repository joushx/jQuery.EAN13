#jQuery.EAN13
jQuery is a jQuery plugin for in-place generation of EAN-13 barcodes

<img src="https://raw.github.com/joushx/jQuery.EAN13/master/barcode.png"/>

##Usage##
###Insert Canvas###
In the area where you want to insert the barcode insert this code:

```
<canvas id="ean" width="200" height="100">
	Your browser does not support canvas-elements.
</canvas>
```

You may change th domensions of the element. The barcode will autmatically resized.

###Generate Barcode###
Let the plugin do the rest:

```
$("#ean").EAN13("7267328656725");
```