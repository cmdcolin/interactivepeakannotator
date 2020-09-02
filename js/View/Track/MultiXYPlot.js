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
            _defaultConfig: function () {
                return Util.deepUpdate(dojo.clone(this.inherited(arguments)),
                    {
                        showLabels: true,
                        onHighlightClick: function (feature, track) {
                            // TODO: Fix all this
                            console.log('Feature');
                            console.log(feature);
                            // grab known labels and
                            let features = JSON.parse(localStorage.getItem('ipaFeatures'));
                            // eslint-disable-next-line radix
                            const highlightFlag = parseInt(localStorage.getItem('highlightFlag'));
                            // uses highlightFlag to determine if editing or removing
                            if (highlightFlag === 1) {
                                // this is wear we define the types of labels, to create a new kind of
                                const states = ['unknown', 'peak', 'noPeak', 'peakStart', 'peakEnd'];
                                // label add to this list and the two down below for determining the color
                                // loops through known labels for the label clicked
                                features.forEach(f => {
                                    if (f.ref === feature.get('ref') &&
                               f.start === feature.get('start') &&
                               f.end === feature.get('end')) {
                                        if (f[track.name]) {
                                            // increments the track type
                                            f[track.name] = (f[track.name] + 1) % states.length;
                                        } else {
                                            // if the track has no type set to "Peak"
                                            f[track.name] = 1;
                                        }
                                    }
                                });
                            } else {
                                // loop through labels removing clicked one
                                // eslint-disable-next-line consistent-return
                                features = features.filter(function (f) {
                                    if (f.start !== feature.get('start')) {
                                        return f;
                                    }
                                });
                                // json of information of removed label
                                var removeJSON = {
                                    'name': track.name,
                                    'ref': feature.get('ref'),
                                    'start': feature.get('start'),
                                    'end': feature.get('end')
                                };
                                // eslint-disable-next-line no-undef
                                sendPost('remove', removeJSON);
                            }
                            // redraw to update model
                            track.browser.view.redrawTracks()
                            localStorage.setItem('ipaFeatures', JSON.stringify(features));
                        },

                        highlightColor: function (feature, track) {
                            // determins the color of the see through part of the label
                            // to add new type of label add type to this list
                            const states = {
                                0: 'rgba(100,100,100,.4)',
                                1: 'rgba(180,167,214,0.4)',
                                2: 'rgba(255,251,204,0.4)',
                                3: 'rgba(255,210,241,0.4)',
                                4: 'rgba(244,204,204,0.4)'

                        };
                            return states[feature.data[track.name] || 0];
                        },

                        indicatorColor: function (feature, track) {
                            // determins the color of the bar at the bottom of the label
                            // to add new type of label add type to this list
                            const states = {
                                0: 'rgb(100,100,100)',
                                1: 'rgb(180,167,214)',
                                2: 'rgb(255,251,204)',
                                3: 'rgb(255,210,241)',
                                4: 'rgb(244,204,204)'};
                            return states[feature.data[track.name] || 0];
                        },

                        style:
                        {
                            label: function( feature, track )
                            {
                                const states = ['unknown', 'peak', 'noPeak', 'peakStart', 'peakEnd'];
                                return states[feature.data[track.name] || 0];
                            }
                        }
                    });
            }
        });
});
