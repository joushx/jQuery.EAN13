# use ecma 5 strict mode
"use strict"

class EAN13

  settings: {}

  init: ->

    if(!@number)
      @settings.onError.call(this, "Number cannot be null")
      return

    if(!@isNumeric(@number))
      @settings.onError.call(this, "Number must be numeric")
      return

    # also disable prefix if no number should be drawn
    if(!@settings.number)
      @settings.prefix = false

    if @number.length == 12
      checkDigit = @generateCheckDigit(@number)
      @number+=checkDigit

    # check if length of code matches specification
    if @number.length == 13

      # check if code is valid
      if @validate()
        @settings.onValid.call()
      else
        @settings.onInvalid.call()

      # call getCode method
      code = @getCode()

      # call draw function
      @draw(code)

    else
      @settings.onError.call(this, "number length is not 12 or 13")

  isNumeric: (input) ->
    !isNaN(parseFloat(input)) and isFinite(input)

  getCode: ->

    # EAN 13 code tables
    tables = [
      [0xd, 0x19, 0x13, 0x3d, 0x23, 0x31, 0x2f, 0x3b, 0x37, 0xb]
      [0x27, 0x33, 0x1b, 0x21, 0x1d, 0x39, 0x5, 0x11, 0x9, 0x17]
      [0x72, 0x66, 0x6c, 0x42, 0x5c, 0x4e, 0x50, 0x44, 0x48, 0x74]
    ]

    # countries table (1 = even, 0 = odd)
    countries = [0x0, 0xb, 0xd, 0xe, 0x13, 0x19, 0x1c, 0x15, 0x16, 0x1a]

    # init code variable for saving of lines
    leftCode = 0
    rightCode = 0

    # get the prefix
    prefix = parseInt(@number.substr(0, 1), 10)

    # get country encoding
    encoding = countries[prefix]

    # remove country-prefix
    raw_number = @number.substr(1)

    # get chars of input number
    parts = raw_number.split("")

    # loop through left groups with country encoding
    i = 0
    while i <= 5
      table = (encoding >> (5-i)) & 0x1

      # shift left to make place for next ( << 7 )
      leftCode *= Math.pow(2,7)

      digit = parseInt(parts[i], 10)

      # add bits ( code |= ... )
      leftCode += tables[table][digit]

      i++

    # loop through right groups with third table
    i = 0
    while i <= 5

      # << 7
      rightCode *= Math.pow(2,7)

      digit = parseInt(parts[6+i], 10)

      rightCode += tables[2][digit]

      i++

    return [leftCode, rightCode]

  clear: (context) ->

    if(@settings.background == null)
      context.clearRect(0, 0, @element.width, @element.height)
    else
      context.fillStyle = @settings.background
      context.fillRect(0, 0, @element.width, @element.height)

  draw: (code) ->

    # layout vars
    layout =
      prefix_offset: 0.06
      font_stretch: 0.073

      # the ratio of border and middle line height to
      # height of the barcode when the number is printed
      border_line_height_number: 0.95

      # the ratio of order and middle line height to
      # height of the barcode without number
      border_line_height: 1

      # the ratio of normal lines to the border and
      # middle lines
      line_height: 0.9

      font_size: 0.15
      font_y: 1.03
      text_offset: 2

    # calculate width of barcode element
    if @settings.prefix
      width_no_padding = (@element.width - 2*@settings.padding)
      width = width_no_padding-(width_no_padding * layout.prefix_offset)
    else
      width = @element.width - 2*@settings.padding

    # calculate height of barcode
    if @settings.number
      height_no_padding = @element.height - 2*@settings.padding
      border_height = layout.border_line_height_number * height_no_padding
      height = layout.line_height * border_height
    else
      height_no_padding = (@element.height - 2*@settings.padding)
      border_height = layout.border_line_height * height_no_padding
      height = border_height

    # calculate width of every element
    item_width = width / 95

    # check if canvas-element is available
    if !@element.getContext
      #call error callback
      @settings.onError.call(this, "canvas context is null")
      return

    # get draw context
    context = @element.getContext("2d")

    # clear canvas from previous drawing
    @clear(context)

    # set fill color
    context.fillStyle = @settings.color

    # calculate starting offset for code in x-axis
    if @settings.number && @settings.prefix
      left = @element.width * layout.prefix_offset + @settings.padding
    else
      left = @settings.padding

    # add left border
    context.fillRect left, @settings.padding, item_width, border_height
    left = left + item_width * 2
    context.fillRect left, @settings.padding, item_width, border_height

    # move to begin of center lines
    left = left + item_width * 7 * 6

    # loop through left lines from back to prevent 32 bit rounding
    i = 0
    while i <= 42

      # if char is 1: draw a line
      if (code[0] % 2)
        context.fillRect left, @settings.padding, item_width, height

      # alter offset
      left = left - item_width

      # shift right
      code[0] = Math.floor(code[0] / 2)

      i++

    # move to center
    left = left + (item_width * (7 * 6)) + 3*item_width

    # add center
    context.fillRect left, @settings.padding, item_width, border_height
    left = left + item_width * 2
    context.fillRect left, @settings.padding, item_width, border_height

    left = left + item_width * 7 * 6 + item_width

    # loop through right lines
    mask = 0x20000000000  # 1000000

    while code[1] > 0

      # if char is 1: draw a line
      if (code[1] % 2)
        context.fillRect left, @settings.padding, item_width, height

      # alter offset
      left = left - item_width

      code[1] = Math.floor(code[1] / 2)

    # add right border
    left = left + item_width * 7 * 6 + item_width
    context.fillRect left, @settings.padding, item_width, border_height
    left = left + item_width * 2
    context.fillRect left, @settings.padding, item_width, border_height

    # add number representation if settings.number == true
    if @settings.number

      # set font style
      context.font = layout.font_size * height + "px monospace"

      # get prefix
      prefix = @number.substr(0, 1)

      # print prefix
      if @settings.prefix
        x = @settings.padding
        y = border_height * layout.font_y + @settings.padding
        context.fillText prefix, x, y

      # calculate x offset (where text starts)
      if @settings.prefix
        prefix_offset = layout.prefix_offset * @element.width
      else
        prefix_offset = 0

      border_offset = 6 * item_width # line,space,line,space at the beginning
      offset = @settings.padding + prefix_offset + border_offset

      # loop though left chars
      chars = @number.substr(1, 6).split("")
      for value, key in chars

        # print text
        x = offset
        y = border_height * layout.font_y + @settings.padding
        context.fillText value, x, y

        # alter offset
        offset += layout.font_stretch * width

      # calculate offset for right numbers
      item_offset = 4 * item_width
      offset = offset + item_offset

      # loop though right chars
      for value, key in (@number.substr(7).split(""))

        # print text
        x = offset
        y = border_height * layout.font_y + @settings.padding
        context.fillText value, x, y

        # alter offset
        offset += layout.font_stretch * width

    # check if debug pattern should be printed (use with prefix=false)
    if @settings.debug

      divider = [3, 3+1*7, 3+2*7, 3+3*7, 3+4*7, 3+5*7, 3+6*7] # in item widths

      for x in [0..width] by item_width
        context.beginPath()
        context.rect(x, 0, 1, border_height)
        context.fillStyle = 'red'
        context.fill()

      # divider (in item widths)
      lines = [
          3, 3+1*7, 3+2*7,
          3+3*7, 3+4*7, 3+5*7,
          3+6*7, 3+6*7+5, 3+6*7+5+1*7,
          3+6*7+5+2*7, 3+6*7+5+3*7, 3+6*7+5+4*7,
          3+6*7+5+5*7, 3+6*7+5+6*7
      ]

      for line in lines
        context.beginPath()
        context.rect(line * item_width, 0, 1, @element.height)
        context.fillStyle = 'red'
        context.fill()

    @settings.onSuccess.call(this, @number)

  generateCheckDigit:(number) ->

    counter = 0
    chars = number.split("")

    # loop through chars
    for value, key in chars

      # check if odd
      if key % 2 is 0

        # count up counter
        counter += parseInt(value, 10)

      else

        # count up counter
        counter += 3 * parseInt(value, 10)

    (10-(counter%10)) % 10

  validate: ->
    parseInt(@number.slice(-1),10) == @generateCheckDigit(@number.slice(0,-1))

  toBin:(number) ->
    str = number.toString(2)

    '000000000'.substr(str.length) + str

  constructor: (@element, @number, options) ->

    # set defaults
    @settings =

      # settings
      number: true
      prefix: true
      color: "#000"
      background: null
      padding: 0
      debug: false

      # callbacks
      onValid: ->
      onInvalid: ->
      onSuccess: ->
      onError: ->

    if options
      for option of options
        @settings[option] = options[option]

    # call draw function
    @init()
