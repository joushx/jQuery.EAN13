(function ($, _window: Window, _document: Document) {

    // set plugin name
    const pluginName = "EAN13";

    // create plugin object
    $.fn[pluginName] = function (number: string, options?: EAN13Options) {
        return this.each(function (this: HTMLElement) {
            $.data(this, "plugin_" + pluginName, new EAN13(this as HTMLCanvasElement, number, options));
        });
    };

})(jQuery, window, document);
