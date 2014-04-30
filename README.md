[![Build Status](https://travis-ci.org/joushx/jQuery.EAN13.png?branch=master)](https://travis-ci.org/joushx/jQuery.EAN13) <a href="https://flattr.com/submit/auto?user_id=joushx&url=https%3A%2F%2Fgithub.com%2Fjoushx%2FEAN13.js" target="_blank"><img src="http://api.flattr.com/button/flattr-badge-large.png" alt="Flattr this" title="Flattr this" border="0"></a>

#jQuery.EAN13
jQuery.EAN13 is a lightweight (~3kb) jQuery plugin for in-place generation of EAN-13 barcodes.

<img src="https://raw.github.com/joushx/jQuery.EAN13/master/barcode.png"/>

Also check out the non-jQuery fork of this project: [EAN13.js](https://github.com/joushx/EAN13.js)

##Usage##

###Include Plugin###
Insert the following code into the `head` section of you page:

```html
<script type="text/javascript" src="jquery-ean13.min.js"></script>
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

###Print barcode###
For printing the code of the provided number with the number under it, just use the following code:

```javascript
$("#ean").EAN13("9002236311036");
```

##Options##

###Without number###
For only printing the barcode use the code below:

```javascript
$("#ean").EAN13("9002236311036", {
	number: false
});
```

###Prefix###
Set the `prefix` option to false to not print the country prefix:

```javascript
$("#ean").EAN13("9002236311036", {
	prefix: false
});
```

###Color###
Set the `color` option to a color to print the barcode with it.

####Hex-value####

```javascript
$("#ean").EAN13("9002236311036", {
	color: "#f00"
});
```

####RGB-value####

```javascript
$("#ean").EAN13("9002236311036", {
	color: "rgb(255,0,0)"
});
```

####RGBA-value####

```javascript
$("#ean").EAN13("9002236311036", {
	color: "rgb(255,0,0,0.2)"
});
```

##Callbacks##

###onValid###
When the code is valid, the `onValid` callback gets executed.

```javascript
$("#ean").EAN13("9002236311036", {
	onValid: function(){
		// do
	}
});
```

###onInvalid###
When the code is invalid, the `onInvalid` callback gets executed.

```javascript
$("#ean").EAN13("9002236311036", {
	onInvalid: function(){
		// do
	}
});
```

###onSuccess###
When the barcode generation and draw process has succeeded `onSuccess` gets called.

```javascript
$("#ean").EAN13("9002236311036", {
	onSuccess: function(){
		// do
	}
});
```

###onError###
When the plugin (canvas-element) is not supported by the browser `onError` gets called.

```javascript
$("#ean").EAN13("9002236311036", {
	onError: function(){
		// do
	}
});
```

##Author##
Johannes Mittendorfer (http://johannes-mittendorfer.com)
