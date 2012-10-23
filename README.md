#jQuery.EAN13
jQuery.EAN13 is a jQuery plugin for in-place generation of EAN-13 barcodes.

<img src="https://raw.github.com/joushx/jQuery.EAN13/master/barcode.png"/>

##Usage##

###Include Plugin###
Insert the following code into the `head`-section of you page:

```html
<script type="text/javascript" src="jQuery.EAN13.min.js"></script>
```

Make sure to include this AFTER the jQuery-library.

###Insert Canvas###
At the place where you want to insert the barcode insert this code:

```html
<canvas id="ean" width="200" height="100">
	Your browser does not support canvas-elements.
</canvas>
```

You may change the dimensions of the element. The barcode will automatically be resized.

###Generate Barcode###
Barcodes can printed with or without the number unter the code:

####With number####
For printing the code of the provided number with the number under it, just use the following code:

```javascript
$("#ean").EAN13("9002236311036");
```

####Without number####
For only printing the barcode use the code below:

```javascript
$("#ean").EAN13("9002236311036", {"print_number":false});
```

##Author##
Johannes Mittendorfer (http://jmittendorfer.hostingsociety.com)