/*
* Copyright (c) 2015 Johannes Mittendorfer (http://johannes-mittendorfer.com)
* Licensed under the MIT License (LICENSE.txt).
*
* Version 2.2.2
* Build 2015-11-22
*/

(function($, window, document) {
  var EAN13, pluginName;
  pluginName = "EAN13";
  "use strict";
  EAN13 = (function() {
    EAN13.prototype.settings = {};

    EAN13.prototype.init = function() {
      var checkDigit, code;
      if (!this.settings.number) {
        this.settings.prefix = false;
      }
      if (this.number.length === 12) {
        checkDigit = this.generateCheckDigit(this.number);
        console.log(checkDigit);
        this.number += checkDigit;
      }
      if (this.number.length === 13) {
        if (this.validate()) {
          this.settings.onValid.call();
        } else {
          this.settings.onInvalid.call();
        }
        code = this.getCode();
        return this.draw(code);
      } else {
        return this.settings.onError.call(this, "number length is not 12 or 13");
      }
    };

    EAN13.prototype.getCode = function() {
      var countries, digit, encoding, i, leftCode, parts, prefix, raw_number, rightCode, table, tables;
      tables = [[0xd, 0x19, 0x13, 0x3d, 0x23, 0x31, 0x2f, 0x3b, 0x37, 0xb], [0x27, 0x33, 0x1b, 0x21, 0x1d, 0x39, 0x5, 0x11, 0x9, 0x17], [0x72, 0x66, 0x6c, 0x42, 0x5c, 0x4e, 0x50, 0x44, 0x48, 0x74]];
      countries = [0x0, 0xb, 0xd, 0xe, 0x13, 0x19, 0x1c, 0x15, 0x16, 0x1a];
      leftCode = 0;
      rightCode = 0;
      prefix = parseInt(this.number.substr(0, 1), 10);
      encoding = countries[prefix];
      raw_number = this.number.substr(1);
      parts = raw_number.split("");
      i = 0;
      while (i <= 5) {
        table = (encoding >> (5 - i)) & 0x1;
        leftCode *= Math.pow(2, 7);
        digit = parseInt(parts[i], 10);
        leftCode += tables[table][digit];
        i++;
      }
      i = 0;
      while (i <= 5) {
        rightCode *= Math.pow(2, 7);
        digit = parseInt(parts[6 + i], 10);
        rightCode += tables[2][digit];
        i++;
      }
      return [leftCode, rightCode];
    };

    EAN13.prototype.clear = function(context) {
      if (this.settings.background === null) {
        return context.clearRect(0, 0, this.element.width, this.element.height);
      } else {
        context.fillStyle = this.settings.background;
        return context.fillRect(0, 0, this.element.width, this.element.height);
      }
    };

    EAN13.prototype.draw = function(code) {
      var border_height, chars, context, divider, height, i, item_width, key, layout, left, line, lines, mask, offset, prefix, value, width, x, _i, _j, _k, _l, _len, _len1, _len2, _ref;
      layout = {
        prefix_offset: 0.06,
        font_stretch: 0.073,
        border_line_height_number: 0.9,
        border_line_height: 1,
        line_height: 0.9,
        font_size: 0.15,
        font_y: 1.03,
        text_offset: 2
      };
      width = (this.settings.prefix ? (this.element.width - 2 * this.settings.padding) - ((this.element.width - 2 * this.settings.padding) * layout.prefix_offset) : this.element.width - 2 * this.settings.padding);
      if (this.settings.number) {
        border_height = layout.border_line_height_number * (this.element.height - 2 * this.settings.padding);
        height = layout.line_height * border_height;
      } else {
        border_height = layout.border_line_height * (this.element.height - 2 * this.settings.padding);
        height = border_height;
      }
      item_width = width / 95;
      if (this.element.getContext) {
        context = this.element.getContext("2d");
        this.clear(context);
        context.fillStyle = this.settings.color;
        left = this.settings.number && this.settings.prefix ? this.element.width * layout.prefix_offset + this.settings.padding : this.settings.padding;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        left = left + item_width * 7 * 6;
        i = 0;
        while (i <= 42) {
          if (code[0] % 2) {
            context.fillRect(left, this.settings.padding, item_width, height);
          }
          left = left - item_width;
          code[0] = Math.floor(code[0] / 2);
          i++;
        }
        left = left + (item_width * (7 * 6)) + 3 * item_width;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        left = left + item_width * 7 * 6 + item_width;
        mask = 0x20000000000;
        while (code[1] > 0) {
          if (code[1] % 2) {
            context.fillRect(left, this.settings.padding, item_width, height);
          }
          left = left - item_width;
          code[1] = Math.floor(code[1] / 2);
        }
        left = left + item_width * 7 * 6 + item_width;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        left = left + item_width * 2;
        context.fillRect(left, this.settings.padding, item_width, border_height);
        if (this.settings.number) {
          context.font = layout.font_size * height + "px monospace";
          prefix = this.number.substr(0, 1);
          if (this.settings.prefix) {
            context.fillText(prefix, this.settings.padding, border_height * layout.font_y + this.settings.padding);
          }
          offset = 3 * item_width + item_width * layout.text_offset + (this.settings.prefix ? layout.prefix_offset * this.element.width : 0) + this.settings.padding;
          chars = this.number.substr(1, 6).split("");
          for (key = _i = 0, _len = chars.length; _i < _len; key = ++_i) {
            value = chars[key];
            context.fillText(value, offset, border_height * layout.font_y + this.settings.padding);
            offset += layout.font_stretch * width;
          }
          offset = this.settings.padding + 50 * item_width + item_width * layout.text_offset + (this.settings.prefix ? layout.prefix_offset * this.element.width : 0);
          _ref = this.number.substr(7).split("");
          for (key = _j = 0, _len1 = _ref.length; _j < _len1; key = ++_j) {
            value = _ref[key];
            context.fillText(value, offset, border_height * layout.font_y + this.settings.padding);
            offset += layout.font_stretch * width;
          }
        }
        if (this.settings.debug) {
          divider = [3, 3 + 1 * 7, 3 + 2 * 7, 3 + 3 * 7, 3 + 4 * 7, 3 + 5 * 7, 3 + 6 * 7];
          for (x = _k = 0; item_width > 0 ? _k <= width : _k >= width; x = _k += item_width) {
            context.beginPath();
            context.rect(x, 0, 1, border_height);
            context.fillStyle = 'red';
            context.fill();
          }
          lines = [3, 3 + 1 * 7, 3 + 2 * 7, 3 + 3 * 7, 3 + 4 * 7, 3 + 5 * 7, 3 + 6 * 7, 3 + 6 * 7 + 5, 3 + 6 * 7 + 5 + 1 * 7, 3 + 6 * 7 + 5 + 2 * 7, 3 + 6 * 7 + 5 + 3 * 7, 3 + 6 * 7 + 5 + 4 * 7, 3 + 6 * 7 + 5 + 5 * 7, 3 + 6 * 7 + 5 + 6 * 7];
          for (_l = 0, _len2 = lines.length; _l < _len2; _l++) {
            line = lines[_l];
            context.beginPath();
            context.rect(line * item_width, 0, 1, this.element.height);
            context.fillStyle = 'red';
            context.fill();
          }
        }
        return this.settings.onSuccess.call();
      } else {
        return this.settings.onError.call(this, "canvas context is null");
      }
    };

    EAN13.prototype.generateCheckDigit = function(number) {
      var chars, counter, key, value, _i, _len;
      counter = 0;
      chars = number.split("");
      for (key = _i = 0, _len = chars.length; _i < _len; key = ++_i) {
        value = chars[key];
        if (key % 2 === 0) {
          counter += parseInt(value, 10);
        } else {
          counter += 3 * parseInt(value, 10);
        }
      }
      return (10 - (counter % 10)) % 10;
    };

    EAN13.prototype.validate = function() {
      return parseInt(this.number.slice(-1), 10) === this.generateCheckDigit(this.number.slice(0, -1));
    };

    EAN13.prototype.toBin = function(number) {
      var str;
      str = number.toString(2);
      return '000000000'.substr(str.length) + str;
    };

    function EAN13(element, number, options) {
      var option;
      this.element = element;
      this.number = number;
      this.settings = {
        number: true,
        prefix: true,
        color: "#000",
        background: null,
        padding: 0,
        debug: false,
        onValid: function() {},
        onInvalid: function() {},
        onSuccess: function() {},
        onError: function() {}
      };
      if (options) {
        for (option in options) {
          this.settings[option] = options[option];
        }
      }
      this._name = pluginName;
      this.init();
    }

    return EAN13;

  })();
  return $.fn[pluginName] = function(number, options) {
    return this.each(function() {
      return $.data(this, "plugin_" + pluginName, new EAN13(this, number, options));
    });
  };
})(jQuery, window, document);
