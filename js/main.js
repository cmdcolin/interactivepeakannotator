define([
    'dojo/_base/declare',
    'dojo/dom-construct',
    'dijit/form/Select',
    'JBrowse/Plugin',
],
function (
    declare,
    dom,
    Select,
    JBrowsePlugin,
) {
    return declare(JBrowsePlugin, {
        // eslint-disable-next-line no-unused-vars
        constructor: function (args) {
            var thisB = this;
            console.log('InteractivePeakAnnotator plugin starting');
            let browser = this.browser;
            let labelOptions = [{label: "peakStart", value: "peakStart", selected: true},
                                {label: "peakEnd", value: "peakEnd"},
                                {label: "noPeak", value: "noPeak"}]
            browser.afterMilestone('initView', function () {
                let navbox = dojo.byId('navbox');
                thisB.browser.labelDropdown = new Select({
                    name: "Select",
                    id: "current-label",
                    options: labelOptions
                }, dojo.create('div', {id: 'current-Label'}, navbox))
            });

        let newLabel = (data) => {
            if(data.length > 0) {
                let annotation = data[0];


                let addCallback = function (data) {
                    //console.log(data);
                }

                let indices = this.browser.view.trackIndices

                let keys = Object.keys(indices);

                let tracks = [];

                keys.forEach(key => {
                    if(this.browser.view.tracks[indices[key]].config['IPA'])
                    {
                        tracks.push(key)
                    }
                });

                if (tracks.length > 0)
                {
                    this.addFeatures(annotation, tracks, addCallback);
                }

                this.browser.clearHighlight();
                this.browser.view.behaviorManager.swapBehaviors('highlightingMouse', 'normalMouse');
            }
        }
        dojo.subscribe('/jbrowse/v1/n/globalHighlightChanged', newLabel)
        },
        addFeatures: function(annotation, tracks, addCallback)
        {
            let currentLabel = dijit.byId('current-label');

            let indices = this.browser.view.trackIndices;

            annotation['label'] = currentLabel.value;

            tracks.forEach(trackName => {
                let trackAnnotation = dojo.clone(annotation)

                delete trackAnnotation['tracks']

                let track = this.browser.view.tracks[indices[trackName]]

                track.highlightStore.addFeature(annotation, addCallback)
            });
        },
    });
});

