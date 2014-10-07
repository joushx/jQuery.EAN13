# use ecma 5 strict mode
"use strict"

class EAN13

  settings: {}

  init: ->

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
      @settings.onError.call()

  getCode: ->

    # EAN 13 code tables
    x = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"]
    y = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"]
    z = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"]

    # countries table
    countries = ["xxxxxx", "xxyxyy", "xxyyxy", "xxyyyx", "xyxxyy", "xyyxxy", "xyyyxx", "xyxyxy", "xyxyyx", "xyyxyx"]

    # init code variable for saving of lines
    code = ""

    # get country encoding
    c_encoding = countries[parseInt(@number.substr(0, 1), 10)].split("")

    # remove country-prefix
    raw_number = @number.substr(1)

    # get chars of input number
    parts = raw_number.split("")

    # loop through left groups
    i = 0
    while i < 6
      if c_encoding[i] is "x"
        code += x[parts[i]]
      else
        code += y[parts[i]]
      i++

    # loop through right groups
    i = 6
    while i < 12
      code += z[parts[i]]
      i++

    #return result
    return code

  clear: (context) ->
    # clear canvas
    context.clearRect(0, 0, @element.width, @element.height)

  draw: (code) ->
    # layout vars
    layout =
      prefix_offset: 0.06
      font_stretch: 0.073
      border_line_height_number: 0.9
      border_line_height: 1
      line_height: 0.9
      font_size: 0.15
      font_y: 1.03
      text_offset: 4.5

    # get width of barcode element
    width = (if @settings.prefix then @element.width-(@element.width * layout.prefix_offset) else @element.width)

    # check if number should be printed
    if @settings.number
      border_height = layout.border_line_height_number * @element.height
      height = layout.line_height * border_height
    else
      border_height = layout.border_line_height * @element.height
      height = border_height

    # calculate width of every element
    item_width = width / 95

    # check if canvas-element is available
    if @element.getContext

      # get draw context
      context = @element.getContext("2d")

      #clear canvas from previous draw
      @clear(context)

      # set fill color
      context.fillStyle = @settings.color

      # init var for offset in x-axis
      left = if (@settings.number && @settings.prefix) then @element.width * layout.prefix_offset else 0

      # get chars of code for drawing every line
      lines = code.split("")

      # add left border
      context.fillRect left, 0, item_width, border_height
      left = left + item_width * 2
      context.fillRect left, 0, item_width, border_height
      left = left + item_width

      # loop through left lines
      i = 0
      while i < 42

        # if char is 1: draw a line
        context.fillRect left, 0, Math.floor(item_width)+1, height  if lines[i] is "1"

        # alter offset
        left = left + item_width
        i++

      # add center
      left = left + item_width
      context.fillRect left, 0, item_width, border_height
      left = left + item_width * 2
      context.fillRect left, 0, item_width, border_height
      left = left + item_width * 2

      # loop through right lines
      i = 42
      while i < 84

        # if char is 1: draw a line
        context.fillRect left, 0, Math.floor(item_width)+1, height  if lines[i] is "1"

        # alter offset
        left = left + item_width
        i++

      # add right border
      context.fillRect left, 0, item_width, border_height
      left = left + item_width * 2
      context.fillRect left, 0, item_width, border_height

      # add number representation if settings.number == true
      if @settings.number

        # set font style
        context.font = layout.font_size * height + "px monospace"

        # get prefix
        prefix = @number.substr(0, 1)

        # print prefix
        context.fillText prefix, 0, border_height * layout.font_y  if @settings.prefix

        # init offset
        offset = item_width * layout.text_offset + ((if @settings.prefix then layout.prefix_offset * @element.width else 0))

        # split number
        chars = @number.substr(1, 6).split("")

        # loop though left chars
        $.each chars, (key, value) ->

          # print text
          context.fillText value, offset, border_height * layout.font_y

          # alter offset
          offset += layout.font_stretch * width

        # offset for right numbers
        offset = 49 * item_width + ((if @settings.prefix then layout.prefix_offset * @element.width else 0)) + layout.text_offset

        # loop though right chars
        $.each @number.substr(7).split(""), (key, value) ->

          # print text
          context.fillText value, offset, border_height * layout.font_y

          # alter offset
          offset += layout.font_stretch * width

      # check if debug pattern should be printed (use with prefix=false)
      if @settings.debug
        for x in [0..width] by item_width*2
          context.beginPath()
          context.rect(x, height*0.4, item_width, height*0.1)
          context.fillStyle = 'red'
          context.fill()

      @settings.onSuccess.call()
    else
      #call error callback
      @settings.onError.call()

  generateCheckDigit:(number) ->

    counter = 0
    chars = number.split("")

    # loop through chars
    $.each chars, (key, value) ->

      # check if odd
      if key % 2 is 0

        # count up counter
        counter += parseInt(value, 10)

      else

        # count up counter
        counter += 3 * parseInt(value, 10)

    10-(counter%10) % 10

  validate: ->
    parseInt(@number.slice(-1),10) == @generateCheckDigit(@number.slice(0,-1))

  constructor: (@element, @number, options) ->

    # set defaults
    @settings =

      # settings
      number: true
      prefix: true
      color: "#000"
      debug: false

      # callbacks
      onValid: ->
      onInvalid: ->
      onSuccess: ->
      onError: ->

    if options
      for option of options
        @settings[option] = options[option]

    # set name
    @_name = pluginName

    # call draw function
    @init()
