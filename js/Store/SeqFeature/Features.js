define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/io-query',
    'dojo/request',
    'dojo/Deferred',
    'JBrowse/Util',
    'JBrowse/Model/SimpleFeature',
    'JBrowse/Store/SeqFeature'
],
function (
    declare,
    lang,
    array,
    ioquery,
    dojoRequest,
    Deferred,
    Util,
    SimpleFeature,
    SeqFeatureStore,
) {
    return declare([ SeqFeatureStore ], {
        getFeatures(query, featureCallback, finishedCallback, errorCallback) {

            var features = localStorage.getItem(this.config.label);
            if(features)
            {
                features = JSON.parse(features);
                features.forEach(data => {
                   featureCallback(new SimpleFeature({data}))
                });
            }
        },
        addFeature: function(query){
            var features = JSON.parse(localStorage.getItem(this.config.label) || '[]');

            var toAdd = query;
            // Default value
            toAdd['label'] = 'unknown';

            features.push(toAdd);

            localStorage.setItem(this.config.label, JSON.stringify(features))

            console.log(features);
        },
        updateFeature(query)
        {
            var features = JSON.parse(localStorage.getItem(this.config.label));

            features = features.filter(function(f)
            {
                //If it isn't the value we are looking for
                if(f.start === query['start'] || f.ref === query['ref'] || f.end === query['end'])
                {
                    f.label = query['label'];

                    return f;
                }
                return f;
            });

            localStorage.setItem(this.config.label, JSON.stringify(features))
        },
        removeFeature(query)
        {
            var features = JSON.parse(localStorage.getItem(this.config.label));

            features = features.filter(function(f)
            {
                //If it isn't the value we are looking for
               if(f.start !== query['start'] || f.ref !== query['ref'] || f.end !== query['end'])
               {
                   return f;
               }
            });

            localStorage.setItem(this.config.label, JSON.stringify(features))
        },
        _makeFeatures: function( featureCallback, endCallback, errorCallback, featureData ) {
            let features
            if( featureData && ( features = featureData.features ) ) {
                features.forEach(data => {
                    featureCallback(new SimpleFeature({ data }))
                })
            }
            endCallback();
        },
        // Aquired from jbrowse/Store/SeqFeature/REST.js
        _errorHandler: function( handler ) {
            handler = handler || function(e) {
                console.error( e, e.stack );
                throw e;
            };
            return dojo.hitch( this, function( error ) {
                var httpStatus = ((error||{}).response||{}).status;
                if( httpStatus >= 400 ) {
                    handler( "HTTP " + httpStatus + " fetching "+error.response.url+" : "+error.response.text );
                }
                else {
                    handler( error );
                }
            });
        },

        saveStore() {
            return {
                urlTemplate: this.config.blob.url
            };
        }

    });
});
