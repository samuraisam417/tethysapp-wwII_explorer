/*global
 ol
 */

var WWII_EXPLORER = (function () {
    'use strict';

    var map;
    var currentLayers = {};
    var layerIndex = 0;
    var iconFeature;
    var popup;
    //var popup;

    $("#btn-next").on("click", function () {
       var pageIndex = Number(window.location.hash.substring(1));
       pageIndex = pageIndex + 1
       window.location.hash = pageIndex
       console.log("Next Clicked")
    })

    $("#btn-prev").on("click", function () {
        var pageIndex = Number(window.location.hash.substring(1));
       pageIndex = pageIndex - 1
       window.location.hash = pageIndex
       console.log("Previous Clicked")
    })

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
                var numEvents;
                var i;
                var pageSelector;

                //Update navigation bar
                console.log("Updating Navigation Bar");
                numEvents = ($(".nav-item").length - 1)
                if (pageIndex == 0) {
                    $(".nav-item").addClass("hidden");    //hide
                    $(".btn-explore").removeClass("hidden");    //show
                    $("#btn-home").addClass("hidden");    //hide
                    $("#btn-next").addClass("hidden");    //hide
                    $("#btn-prev").addClass("hidden");       //hide
                } else if (pageIndex == 1) {
                    $(".nav-item").removeClass("hidden");   //show
                    $(".btn-explore").addClass("hidden");    //hide
                    $("#btn-home").removeClass("hidden");    //show
                    $("#btn-next").removeClass("hidden");    //show
                    $("#btn-prev").addClass("hidden");       //hide
                } else if (pageIndex == numEvents) {
                    $(".nav-item").removeClass("hidden");    //show
                    $(".btn-explore").addClass("hidden");    //hide
                    $("#btn-home").removeClass("hidden");    //show
                    $("#btn-next").addClass("hidden");       //hide
                    $("#btn-prev").removeClass("hidden");    //show
                } else {
                    $(".nav-item").removeClass("hidden");    //show
                    $(".btn-explore").addClass("hidden");    //hide
                    $("#btn-home").removeClass("hidden");    //show
                    $("#btn-next").removeClass("hidden");    //show
                    $("#btn-prev").removeClass("hidden");    //show
                }

                //Highlight event button in nagivation
                console.log("Highlight event buttons");
                $(".nav-item").removeClass("current-event")
                pageSelector = '[data-page=' + pageIndex + ']'
                $(pageSelector).addClass("current-event")

                //Hide each of the events from the previous display from the map
                console.log("Hiding existing layers");
                for (i = 2; i <= layerIndex; i++) {
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

                $("#popup").popover('destroy')

                //Add point to map, for pop-up
                console.log("Add point to map");
                iconFeature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([event.longitude,event.latitude])));
                iconFeature.setProperties({
                    "pageIndex": pageIndex,
                    "date": event.date,
                    "title": event.title,
                    "description": event.description,
                    "more_info": event.more_info,
                    "photo_url": event.photo_url
                });

                //Change map center and zoom
                console.log("Setting zoom and center of map");
                map.getView().setZoom(event.zoom_level);
                map.getView().setCenter(ol.proj.fromLonLat([event.longitude, event.latitude]));
                var geometry = iconFeature.getGeometry();
                var coord = geometry.getCoordinates();
                popup.setPosition(coord);
                var content;
                if (pageIndex == "0") {
                    content = '<h3>Welcome</h3>' +
                    '<p>'+event.description+'</p>';
                } else {
                    content = '<h3 id="title">'+event.title+'</h3>' +
                    '<br><p id="date"><b>'+event.date+'</b></p>' +
                    '<p id="description">'+event.description+'</p>' +
                    '<a href="'+event.more_info+'">Click here to learn more</a><br>' +
                    '<img id="photo_url" src="'+event.photo_url+'">';
                }
                $("#popup").popover({
                  'placement': 'top',
                  'html': true,
                  'content': content
                });
                $("#popup").popover('show')
            }
        });

    };

    $(function () {

           iconFeature = new ol.Feature({
              geometry: new ol.geom.Point([0,0]),
              date: 'Data',
              title: 'Title',
              description: 'Description',
              more_info: 'More Info',
              photo_url: 'www.google.com'
            });

            var iconStyle = new ol.style.Style({
              image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                src: '/static/wwii_explorer/images/ww2icon.jpg'
              })),
              zIndex: '1000'
            });

            iconFeature.setStyle(iconStyle);

            var vectorSource = new ol.source.Vector({
              features: [iconFeature],
            });

            var vectorLayer = new ol.layer.Vector({
              source: vectorSource
            });


        map = new ol.Map({
            target: document.getElementById('map'),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'sat'})
                }),
                vectorLayer
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([11.040, 48.339]),
                zoom: 3
            })
        });

        console.log("Set Z Index");
        vectorLayer.setZIndex(10000);

        map.getLayers().on('add', function () {
            layerIndex++;
        });

        var element = document.getElementById('popup');

        popup = new ol.Overlay({
          element: element,
          positioning: 'bottom-center',
          stopEvent: false
        });
        map.addOverlay(popup);

        // display popup on click
        map.on('click', function(evt) {
          console.log("Clicked on map");
          var feature = map.forEachFeatureAtPixel(evt.pixel,
              function(feature, layer) {
                return feature;
              });
        if (feature && feature.getProperties().pageIndex) {
            var geometry = iconFeature.getGeometry();
            var coord = geometry.getCoordinates();
            popup.setPosition(coord);
            var content;
            if (feature.get('pageIndex') == "0") {
                content = '<h3>Welcome</h3>' +
                '<p>'+feature.get('description')+'</p>';
            } else {
                content = '<h3 id="title">'+feature.get('title')+'</h3>' +
                '<br><p id="date"><b>'+feature.get('date')+'</b></p>' +
                '<p id="description">'+feature.get('description')+'</p>' +
                '<a href="'+feature.get('more_info')+'">Click here to learn more</a><br>' +
                '<img id="photo_url" src="'+feature.get('photo_url')+'">';
            }

            $("#popup").popover({
              'placement': 'top',
              'html': true,
              'content': content
            });
            $(element).popover('show');
        } else {
            $(element).popover('destroy');
        }
        });



        /**
        * Add a click handler to the map to render the popup.
        */
        // change mouse cursor when over marker
        map.on('pointermove', function(e) {
        if (e.dragging) {
        $(element).popover('destroy');
        return;
        }
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTarget().style.cursor = hit ? 'pointer' : '';
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