# wrapping function
do ($ = jQuery, window, document) ->

  # set plugin name
  pluginName = "EAN13"

  include "common.coffee"

  # create plugin object
  $.fn[pluginName] = (number, options) ->
    @each ->
      $.data(@, "plugin_#{pluginName}", new EAN13(@, number, options))
