/*global
 ol
 */

var WWII_EXPLORER = (function () {
    'use strict';

    var map;
    var currentLayers = {};
    var layerIndex = 0;
    //var popup;

    var getPageData = function () {
        console.log("getPageData called");
        var pageIndex = window.location.hash.substring(1);
        $.ajax({
            type: 'GET',
            url: 'get-page-data',
            data: {
                'pageIndex': pageIndex
            },
            error: function () {
                console.log("An Error Occurred");
            },
            success: function (data) {
                var event = data.event;
                var i;

                //Hide each of the events from the previous display from the map
                console.log("Hiding existing layers");
                for (i = 1; i <= layerIndex; i++) {
                    map.getLayers().item(i).setVisible(false);
                }

                //Add new KML files to the map, relevant to the given event
                console.log("Adding new KML files to map, relevant to the given event");
                var kmlfilelist = event.kml_files.split(", ");
                //currentLayers = kmlfilelist
                kmlfilelist.forEach(function (kmlFilename) {
                    //Check if layer already exists. If Layer exists, set visitbility to true. If Layer doesn't exist, then add to map.
                    if (currentLayers.hasOwnProperty(kmlFilename)) {
                        map.getLayers().item(currentLayers[kmlFilename]).setVisible(true);
                    } else {
                        var kmlLayer = new ol.layer.Vector({
                            source: new ol.source.Vector({
                                url: '/static/wwii_explorer/data/kml/' + kmlFilename,
                                format: new ol.format.KML()
                            })
                        });
                        map.addLayer(kmlLayer);
                        currentLayers[kmlFilename] = layerIndex;
                    }
                });

                //Change map center and zoom
                console.log("Setting zoom and center of map");
                map.getView().setZoom(event.zoom_level);
                map.getView().setCenter(ol.proj.fromLonLat([event.longitude, event.latitude]));


                //Add data to map
                //Change title
                //Show/hide buttons
                //apply pop-up text
                //refresh map


//      add the code to run the code, load the map data.
//      check event index (if at 0, go to 1)
//          if forward, do this; if back, do this
//      look at event database
//           If Lat/Lon, then create point (point)
//          If no Lat/Lon, use KML file (line, polygon)
//      create point for event
//      create info bubble for event
//      refresh map, send back to user

            }
        });

    };

    $(function () {

        map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'sat'})
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([11.040, 48.339]),
                zoom: 3
            })
        });

        map.getLayers().on('add', function () {
            layerIndex++;
        });

        window.onhashchange = getPageData;
        window.location.hash = '0';
    });


//$.
//Clear map
//Read database
//Create function that will load the map with the desired KML files

//kmlLayer = new ol.layer.Vector({
//        source: new ol.source.Vector({
//          url: '/static/wwii_explorer/data/home_data/Italy.kml',
//          format: new ol.format.KML()
//        })
//      });
//map.addLayer(kmlLayer);


}());