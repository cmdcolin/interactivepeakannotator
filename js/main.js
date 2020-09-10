define([
    'dojo/_base/declare',
    'JBrowse/Plugin'
],
function (
    declare,
    JBrowsePlugin
) {
    return declare(JBrowsePlugin, {
        // eslint-disable-next-line no-unused-vars
        constructor: function (args) {
            console.log('InteractivePeakAnnotator plugin starting');
        }
    });
});
