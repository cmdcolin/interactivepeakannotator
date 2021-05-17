define([
    'dojo/_base/declare',
    'dojo/parser',
    'dojo/on',
    'dojo/mouse',
    'dojo/dom',
    'dojo/dom-construct',
    'dijit/Dialog',
    'dijit/form/Select',
    'JBrowse/Util',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/PopupMenuItem',
    'JBrowse/Store/SeqFeature/BigBed',
    'JBrowse/View/Track/_FeatureDetailMixin',
], function (declare, parser, on, mouse, dom, domConstruct, Dialog, Select, Util, Menu, MenuItem, PopupMenuItem, BigBed, FeatureDetailMixin) {
    return declare(FeatureDetailMixin, {
        _defaultConfig: function () {
            return Util.deepUpdate(dojo.clone(this.inherited(arguments)),
                {
                    showLabels: true,
                    dojoMenu: true,
                    IPA: true,
                    onHighlightClick: function (feature, track, event) {
                    },
                    highlightColor: function (feature, track) {
                        // determins the color of the see through part of the label
                        // to add new type of label add type to this list
                        const states = {
                            'noPeak': 'rgba(255,250,150,0.4)',
                            'peakStart': 'rgba(255,180,235,0.4)',
                            'peakEnd': 'rgba(244,185,185,0.4)'
                        };
                        return states[feature.get('label') || 'unknown'];
                    },

                    indicatorColor: function (feature, track) {
                        // determins the color of the bar at the bottom of the label
                        // to add new type of label add type to this list
                        const states = {
                            'noPeak': 'rgb(255,245,150)',
                            'peakStart': 'rgb(255,210,241)',
                            'peakEnd': 'rgb(244,204,204)'
                        };
                        return states[feature.get('label') || 'unknown'];
                    },

                    style:
                        {
                            label: function (feature, track) {
                                return feature.get('label');
                            }
                        },

                    addMenu: function(track, feature, highlight)
                    {
                        const states = ['peakStart', 'peakEnd', 'noPeak'];

                        let redrawAllCallback = () => {
                            track.browser.view.redrawTracks();
                        }

                        let redrawCallback = () => {
                            track.redraw()
                        }

                        let menu = new Menu({leftClickToOpen: true});

                        let updateSingleMenu = new Menu();
                        states.forEach(state => {
                            updateSingleMenu.addChild(new MenuItem({
                                label: state,
                                onClick: (e) => {
                                    let args = {
                                        'ref': feature.get('ref'),
                                        'start': feature.get('start'),
                                        'end': feature.get('end'),
                                        'label': e.target.innerText
                                    }
                                    track.highlightStore.updateFeature(args, redrawCallback);
                                }
                            }));
                        });

                        menu.addChild(new PopupMenuItem({
                            label: 'Change Label',
                            popup: updateSingleMenu
                        }))

                        let updateAlignedMenu = new Menu();
                        states.forEach(state => {
                            updateAlignedMenu.addChild(new MenuItem({
                                label: state,
                                onClick: (e) => {
                                    let args = {
                                        'ref': feature.get('ref'),
                                        'start': feature.get('start'),
                                        'end': feature.get('end'),
                                        'label': e.target.innerText
                                    }
                                    track.highlightStore.updateAlignedFeatures(args, redrawAllCallback);
                                }
                            }));
                        });

                        menu.addChild(new PopupMenuItem({
                            label: 'Change Visible Aligned Labels',
                            popup: updateAlignedMenu
                        }))

                        menu.addChild(new MenuItem({
                            label: "Delete Label",
                            iconClass: "dijitIconDelete",
                            onClick: (e) => {
                                let removeJSON = {
                                    'ref': feature.get('ref'),
                                    'start': feature.get('start'),
                                    'end': feature.get('end')
                                };
                                console.log(track)
                                track.highlightStore.removeFeature(removeJSON, redrawCallback);
                            }
                        }))

                        menu.addChild(new MenuItem({
                            label: "Delete Aligned Labels",
                            iconClass: "dijitIconDelete",
                            onClick: (e) => {
                                let removeJSON = {
                                    'ref': feature.get('ref'),
                                    'start': feature.get('start'),
                                    'end': feature.get('end')
                                };

                                track.highlightStore.removeAlignedFeatures(removeJSON, redrawAllCallback)
                            }
                        }))

                        menu.bindDomNode(highlight)
                        menu.startup();
                    }
                });
        },
    })
})
