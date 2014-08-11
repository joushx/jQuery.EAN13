include "common.coffee"

parseOptions: (_options) ->
  `
  this.options=_options;
  for(var option in this.defaults)
   this.options[option] = _options[option] || this.defaults[option];
  `
  null

if (typeof(module)!='undefined' && typeof(module.exports)!='undefined')
  module.exports=EAN13
