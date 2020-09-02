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
            localStorage.setItem('highlightFlag', 0);
            console.log('InteractivePeakAnnotator plugin starting');
            // set up listiner for the globalHighlightChanged event
            // data is either a list of highlights or an empty list
            dojo.subscribe('/jbrowse/v1/n/globalHighlightChanged', function (data) {
                if (data.length) {
                    // flag set to editing
                    localStorage.setItem('highlightFlag', 1);
                    // add new highlight to storage
                    const region = data[0];
                    sendPost('save', data[0]);
                } else {
                    // flag set to removing
                    localStorage.setItem('highlightFlag', 0);
                }
            });
        }
    });
});
