// let pluginName = null;

declare const module: any;

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
    module.exports = EAN13;
}
