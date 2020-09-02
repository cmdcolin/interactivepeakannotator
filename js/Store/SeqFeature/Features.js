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
        constructor: function( args )
        {
            // make sure the baseUrl has a trailing slash
            this.baseUrl = args.baseUrl || this.config.baseUrl;
            if( this.baseUrl.charAt( this.baseUrl.length-1 ) != '/' )
                this.baseUrl = this.baseUrl + '/';

            this.name = args.name;
        },
        getFeatures(query, featureCallback, finishedCallback, errorCallback) {
            let url = this.baseUrl + 'labels/' + query.ref;
            let queryVals = '?start='+query.start+'&end='+query.end+'&name='+this.name;

            let callback = dojo.hitch(this, '_makeFeatures', featureCallback, finishedCallback, errorCallback)

            url +=queryVals;

            dojoRequest( url, {
                method: 'GET',
                handleAs: 'json'
            }).then(callback, this._errorHandler(errorCallback));
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
