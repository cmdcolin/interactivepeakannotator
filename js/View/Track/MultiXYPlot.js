define([
    'dojo/_base/declare',
    'JBrowse/Util',
    'WiggleHighlighter/View/Track/MultiXYPlot'
],
function (
    declare,
    Util,
    XYPlot
) {
    return declare([ XYPlot],
        {
            constructor: function(args)
            {
                let newLabel = (data) => {
                    if (data.length) {
                        // add new highlight to storage
                        var dataVal = data[0];
                        dataVal['name'] = this.name;
                        this.highlightStore.addFeature(dataVal);
                        this.browser.clearHighlight();
                        this.browser.view.behaviorManager.swapBehaviors('highlightingMouse', 'normalMouse');
                    }
                };

                dojo.subscribe('/jbrowse/v1/n/globalHighlightChanged', newLabel)
            },
            _defaultConfig: function () {
                return Util.deepUpdate(dojo.clone(this.inherited(arguments)),
                    {
                        onHighlightClick: function (feature, track) {
                            // this is wear we define the types of labels, to create a new kind of
                            const states = ['unknown', 'peak', 'noPeak', 'peakStart', 'peakEnd'];
                            // label add to this list and the two down below for determining the color
                            // loops through known labels for the label clicked
                            for(let i = 0; i < states.length; i++)
                            {
                                if( feature.get('label') === states[i] )
                                {
                                    let args = {
                                        'ref': feature.get('ref'),
                                        'start': feature.get('start'),
                                        'end': feature.get('end'),
                                        'label': states[(i+1)%states.length]
                                    }
                                    let redrawCallback = () => {
                                        track.redraw()
                                    }
                                    this.highlightStore.updateFeature(args, redrawCallback);
                                    break;
                                }
                            }
                        },
                        onHighlightRightClick: function( feature, track ) {
                            // json of information of removed label
                            let removeJSON = {
                                'ref': feature.get('ref'),
                                'start': feature.get('start'),
                                'end': feature.get('end')
                            };

                            let redrawCallback = () => {
                                        track.redraw()
                                    }

                            this.highlightStore.removeFeature(removeJSON, redrawCallback());
                        },
                        highlightColor: function (feature, track) {
                            // determins the color of the see through part of the label
                            // to add new type of label add type to this list
                            const states = {
                                'unknown': 'rgba(100,100,100,.4)',
                                'peak': 'rgba(180,167,214,0.4)',
                                'noPeak': 'rgba(255,251,204,0.4)',
                                'peakStart': 'rgba(255,210,241,0.4)',
                                'peakEnd': 'rgba(244,204,204,0.4)'

                        };
                            return states[feature.get('label') || 'unknown'];
                        },

                        indicatorColor: function (feature, track ) {
                            // determins the color of the bar at the bottom of the label
                            // to add new type of label add type to this list
                            const states = {
                                'unknown': 'rgb(100,100,100)',
                                'peak': 'rgb(180,167,214)',
                                'noPeak': 'rgb(255,251,204)',
                                'peakStart': 'rgb(255,210,241)',
                                'peakEnd': 'rgb(244,204,204)'};
                            return states[feature.get('label') || 'unknown'];
                        },

                        style:
                        {
                            label: function( feature, track )
                            {
                                return feature.get('label');
                            }
                        },


                    });
            },
    });
});
