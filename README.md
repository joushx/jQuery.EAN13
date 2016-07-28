[![Build Status](https://travis-ci.org/joushx/jQuery.EAN13.png?branch=master)](https://travis-ci.org/joushx/jQuery.EAN13) <a href="https://flattr.com/thing/2941746/joushxjQuery-EAN13-on-GitHub" target="_blank"><img src="http://api.flattr.com/button/flattr-badge-large.png" alt="Flattr this" title="Flattr this" border="0"></a>

#jQuery.EAN13.js
jQuery.EAN13.js is a lightweight library available as plain JavaScript and as jQuery plugin for the generation of EAN-13 barcodes.

<img src="https://raw.github.com/joushx/jQuery.EAN13/master/barcode.png"/>

##Usage##

###Include Plugin###
Insert the following code into the `head` section of you page:

####JavaScript####

```html
<script type="text/javascript" src="jquery-ean13.min.js"></script>
```


####jQuery####

```html
<script type="text/javascript" src="ean13.min.js"></script>
```

Make sure to include this **after** the jQuery-library.

###Insert Canvas###
At the place where you want to insert the barcode insert this code:

```html
<canvas id="ean" width="200" height="100">
	Your browser does not support canvas-elements.
</canvas>
```

You may change the dimensions of the element. The barcode will automatically be resized.

###Simple barcode###
For printing the barcode without any further options use the following code.
If you don't provide a check digit (just a 12 digit code) it will be generated for you on the fly.

####JavaScript####

```javascript
var element = document.getElementById("ean");
new EAN13(element, "9002236311036");
```

####jQuery####
```javascript
$("#ean").EAN13("9002236311036");
```

##Options##

The library provides some options and callback functions. To use them simply provide a option object as the second argument.

###Example###

####JavaScript####

```javascript
var options = {
	number: false,
	prefix: false,
	onSuccess: function(){
	  alert("Heeeey!");
	}
}

new EAN13(document.getElementById("ean"), "9002236311036", options);
```

####jQuery####

```javascript
$("#ean").EAN13("9002236311036", {
	number: false,
	prefix: false
});
```

###List of options###

identifier | type    | default value | description
-----------|---------|---------------|-------------
number		 | boolean | true          | If `true` the number is printed underneath the barcode to be readable for humans.
prefix		 | boolean | true          | If `true` the country prefix (to be precise the first digit of it) is printed at the left of the barcode.
color			 | string  | #000          | The color of the barcode. Accepts any CSS colors e.g. `#ff0000`, `green`, `rgb(0,0,0)` or `rgb(0,0,0,0.5)`.
background | string  | null          | The background color of the barcode. Accepts any CSS colors e.g. `#ff0000`, `green`, `rgb(0,0,0)` or `rgb(0,0,0,0.5)`. Default is null = transparent
debug			 | boolean | false				 | If `true` a pattern is drawn on the barcode to help identify the lines.
padding    | int     | 0             | Adds a padding arround the code (in pixel)

###List of callbacks###

identifier         | description
-------------------|---------
onValid()		       | Fired if the checksum of the provided code is correct. Not used if a 12 digit code is provided.
onInvalid()        | Fired is the checksum is not correct. Not used if a 12 digit code is provided.
onSuccess(number)  | Fired at the end of the painting process and if no errors occurred. Gives the number (including generated or provided checksum) as parameter.
onError()          | Fired if the were any errors while painting. (For instance the canvas element is not present)
