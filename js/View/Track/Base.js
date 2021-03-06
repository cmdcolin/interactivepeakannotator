define([
  'dojo/_base/declare',
  'dojo/on',
  'dojo/mouse',
  'dojo/dom-construct',
  'dijit/Dialog',
  'JBrowse/Util',
  'dijit/Menu',
  'dijit/MenuItem',
  'JBrowse/Store/SeqFeature/BigBed',
  'JBrowse/View/Track/_FeatureDetailMixin',
], function (declare, on, mouse, domConstruct, Dialog, Util, Menu, MenuItem, BigBed, FeatureDetailMixin) {
  return declare(FeatureDetailMixin, {
      constructor: function(args)
      {
        let newLabel = (data) => {
            console.log('new label start')
            console.log(this)
            console.log(data)
            console.log('new label end')
            if (data.length) {
                // add new highlight to storage
                var dataVal = data[0];
                dataVal['name'] = this.name;
                let addCallback = function(data){
                    console.log(data);
                }
                this.highlightStore.addFeature(dataVal, addCallback);
                this.browser.clearHighlight();
                this.browser.view.behaviorManager.swapBehaviors('highlightingMouse', 'normalMouse');
            }
        };

        dojo.subscribe('/jbrowse/v1/n/globalHighlightChanged', newLabel)
    },
    _defaultConfig: function () {
        return Util.deepUpdate(dojo.clone(this.inherited(arguments)),
            {
                onHighlightClick: function (feature, track, event) {
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
                onHighlightRightClick: function( feature, track, event ) {
                    // json of information of removed label
                    console.log(event)
                    var menu = new Menu()
                    menu.addChild(new MenuItem({
                        label: "Delete Label",
                        iconClass: "dijitIconDelete",
                        onClick: (e) =>
                        {
                         let removeJSON = {
                             'ref': feature.get('ref'),
                             'start': feature.get('start'),
                             'end': feature.get('end')};
                         let redrawCallback = () => {
                             track.redraw()
                         }

                         this.highlightStore.removeFeature(removeJSON, redrawCallback);
                        }}))
                    menu.startup();
                    menu.bindDomNode(event.target)
                },
                highlightColor: function (feature, track) {
                    // determins the color of the see through part of the label
                    // to add new type of label add type to this list
                    const states = {
                                'unknown': 'rgba(100,100,100,.4)',
                                'peak': 'rgba(180,167,214,0.4)',
                                'noPeak': 'rgba(255,250,150,0.4)',
                                'peakStart': 'rgba(255,180,235,0.4)',
                                'peakEnd': 'rgba(244,185,185,0.4)'};
                    return states[feature.get('label') || 'unknown'];
                },

                indicatorColor: function (feature, track ) {
                    // determins the color of the bar at the bottom of the label
                    // to add new type of label add type to this list
                    const states = {
                                'unknown': 'rgb(100,100,100)',
                                'peak': 'rgb(180,167,214)',
                                'noPeak': 'rgb(255,245,150)',
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
  })
})
