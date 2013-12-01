(function() {
  (function($) {
    "use strict";
    return $.fn.EAN13 = function(number, options) {
      var canvas, layout, settings;
      layout = {
        prefix_offset: 0.07,
        font_stretch: 0.078,
        border_line_height_number: 0.9,
        border_line_height: 1,
        line_height: 0.9,
        font_size: 0.2,
        font_y: 1.03
      };
      settings = $.extend({
        number: true,
        prefix: true,
        onValid: function() {},
        onInvalid: function() {},
        onError: function() {},
        color: "#000"
      }, options);
      canvas = this[0];
      return this.each(function() {
        var border_height, c_encoding, chars, code, context, countries, height, i, item_width, left, lines, offset, parts, prefix, validate, width, x, y, z;
        validate = function(number) {
          var chars, counter, result;
          result = null;
          chars = number.split("");
          counter = 0;
          $.each(chars, function(key, value) {
            if (key % 2 === 0) {
              return counter += parseInt(value, 10);
            } else {
              return counter += 3 * parseInt(value, 10);
            }
          });
          if ((counter % 10) === 0) {
            result = true;
          } else {
            result = false;
          }
          return result;
        };
        if (validate(number)) {
          settings.onValid.call(this);
        } else {
          settings.onInvalid.call(this);
        }
        x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
        y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
        z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
        countries = ["xxxxxx", "xxyxyy", "xxyyxy", "xxyyyx", "xyxxyy", "xyyxxy", "xyyyxx", "xyxyxy", "xyxyyx", "xyyxyx"];
        width = (settings.prefix ? canvas.width * 0.8 : canvas.width);
        if (settings.number) {
          border_height = layout.border_line_height_number * canvas.height;
          height = layout.line_height * border_height;
        } else {
          border_height = layout.border_line_height * canvas.height;
          height = layout.line_height * border_height;
        }
        item_width = width / 95;
        code = "";
        c_encoding = countries[parseInt(number.substr(0, 1), 10)].split("");
        prefix = number.substr(0, 1);
        number = number.substr(1);
        parts = number.split("");
        i = 0;
        while (i < 6) {
          if (c_encoding[i] === "x") {
            code += x[parts[i]];
          } else {
            code += y[parts[i]];
          }
          i++;
        }
        i = 6;
        while (i < 12) {
          code += z[parts[i]];
          i++;
        }
        if (canvas.getContext) {
          context = canvas.getContext("2d");
          context.fillStyle = settings.color;
          left = (settings.prefix ? canvas.width * layout.prefix_offset : 0);
          lines = code.split("");
          context.fillRect(left, 0, item_width, border_height);
          left = left + item_width * 2;
          context.fillRect(left, 0, item_width, border_height);
          left = left + item_width;
          i = 0;
          while (i < 42) {
            if (lines[i] === "1") {
              context.fillRect(left, 0, item_width, height);
            }
            left = left + item_width;
            i++;
          }
          left = left + item_width;
          context.fillRect(left, 0, item_width, border_height);
          left = left + item_width * 2;
          context.fillRect(left, 0, item_width, border_height);
          left = left + item_width * 2;
          i = 42;
          while (i < 84) {
            if (lines[i] === "1") {
              context.fillRect(left, 0, item_width, height);
            }
            left = left + item_width;
            i++;
          }
          context.fillRect(left, 0, item_width, border_height);
          left = left + item_width * 2;
          context.fillRect(left, 0, item_width, border_height);
          if (settings.number) {
            context.font = layout.font_size * height + "px monospace";
            if (settings.prefix) {
              context.fillText(prefix, 0, border_height * layout.font_y);
            }
            offset = item_width * 3 + (settings.prefix ? layout.prefix_offset * canvas.width : 0);
            chars = number.substr(1, 6).split("");
            $.each(chars, function(key, value) {
              context.fillText(value, offset, border_height * layout.font_y);
              return offset += layout.font_stretch * width;
            });
            offset = 49 * item_width + (settings.prefix ? layout.prefix_offset * canvas.width : 0);
            return $.each(number.substr(6).split(""), function(key, value) {
              context.fillText(value, offset, border_height * layout.font_y);
              return offset += layout.font_stretch * width;
            });
          }
        } else {
          return settings.onError.call(this);
        }
      });
    };
  })(jQuery);

}).call(this);
