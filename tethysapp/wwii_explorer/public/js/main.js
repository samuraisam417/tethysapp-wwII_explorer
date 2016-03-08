/*global
 ol
 */

var WWII_EXPLORER = (function () {
    'use strict';

    var map;
    var currentLayers = {};
    var layerIndex = 1;
    var iconFeature;
    var mapOverlay;
    var $navItems;
    var $btnExplore;
    var $btnHome;
    var $btnNext;
    var $btnPrev;
    var $popup;
    var $popupContent;
    var $popupCloser;

    var getPageData = function () {
        //This indicates that the page data number has been changed in the url
        console.log("getPageData called");
        var pageIndex = Number(window.location.hash.substring(1));
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
                //When the page data is recognized then the current page is updateed,
                //   instead of loading another HTML file
                var event = data.event;
                var numEvents;
                var i;
                var pageSelector;

                //Update navigation bar buttons and appearance
                console.log("Updating Navigation Bar");
                numEvents = ($navItems.length - 1);
                if (pageIndex === 0) {          //When home
                    $navItems.addClass("hidden");    //hide
                    $btnExplore.removeClass("hidden");    //show
                    $btnHome.addClass("hidden");    //hide
                    $btnNext.addClass("hidden");    //hide
                    $btnPrev.addClass("hidden");       //hide
                } else if (pageIndex === 1) {       //When on first event
                    $navItems.removeClass("hidden");   //show
                    $btnExplore.addClass("hidden");    //hide
                    $btnHome.removeClass("hidden");    //show
                    $btnNext.removeClass("hidden");    //show
                    $btnPrev.addClass("hidden");       //hide
                } else if (pageIndex === numEvents) {       //When on last event
                    $navItems.removeClass("hidden");    //show
                    $btnExplore.addClass("hidden");    //hide
                    $btnHome.removeClass("hidden");    //show
                    $btnNext.addClass("hidden");       //hide
                    $btnPrev.removeClass("hidden");    //show
                } else {        //When on any other event
                    $navItems.removeClass("hidden");    //show
                    $btnExplore.addClass("hidden");    //hide
                    $btnHome.removeClass("hidden");    //show
                    $btnNext.removeClass("hidden");    //show
                    $btnPrev.removeClass("hidden");    //show
                }

                //Highlight event button in nagivation
                console.log("Highlight event buttons");
                $navItems.removeClass("current-event");
                pageSelector = '[data-page=' + pageIndex + ']';
                $(pageSelector).addClass("current-event");

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
                    console.log("Adding: "+kmlFilename);
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

                $popup.popover('destroy');

                //Add point to map, for pop-up
                console.log("Add point to map");
                iconFeature.setGeometry(new ol.geom.Point(ol.proj.fromLonLat([event.longitude, event.latitude])));
                iconFeature.setProperties({
                    "pageIndex": pageIndex,
                    "date": event.date,
                    "title": event.title,
                    "description": event.description,
                    "more_info": event.more_info,
                    "photo_url": event.photo_url
                });

                // Set popup content and position, then show popup
                // Content is set is HTML format
                var geometry = iconFeature.getGeometry();
                var coord = geometry.getCoordinates();
                var content;
                if (pageIndex === 0) {
                    content = '<h3 id="title">Welcome</h3>' +
                        '<p id="description">' + event.description + '</p>' +
                        '<img id="photo_url" src="' + event.photo_url + '">';
                } else {
                    content = '<h3 id="title">' + event.title + '</h3>' +
                        '<p id="date"><b>' + event.date + '</b></p>' +
                        '<p id="description">' + event.description + '</p>' +
                        '<a id="learn-more" target="_blank" href="' + event.more_info + '">Click here to learn more</a><br>' +
                        '<img id="photo_url" src="' + event.photo_url + '">';
                }
                $popupContent.html(content);
                mapOverlay.setPosition(coord);

                //Change map center and zoom
                console.log("Setting zoom and center of map");
                map.getView().setZoom(event.zoom_level);
                map.getView().setCenter(ol.proj.fromLonLat([event.longitude, event.latitude]));
            }
        });

    };

    $(function () {
        $navItems = $(".nav-item");
        $btnExplore = $(".btn-explore");
        $btnHome = $("#btn-home");
        $btnNext = $("#btn-next");
        $btnPrev = $("#btn-prev");
        $popup = $("#popup");
        $popupContent = $('#popup-content');
        $popupCloser = $('#popup-closer');

        $btnNext.on("click", function () {
            var pageIndex = Number(window.location.hash.substring(1));
            pageIndex = pageIndex + 1;
            window.location.hash = pageIndex;
            console.log("Next Clicked");
        });

        $btnPrev.on("click", function () {
            var pageIndex = Number(window.location.hash.substring(1));
            pageIndex = pageIndex - 1;
            window.location.hash = pageIndex;
            console.log("Previous Clicked");
        });

        /**
         * Create an overlay to anchor the popup to the map.
         */
        mapOverlay = new ol.Overlay({
            element: $popup[0],
            autoPan: false
        });

        iconFeature = new ol.Feature({
            geometry: new ol.geom.Point([0, 0]),
            date: 'Data',
            title: 'Title',
            description: 'Description',
            more_info: 'More Info',
            photo_url: 'www.google.com'
        });

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 46],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                src: '/static/wwii_explorer/images/ww2icon.jpg'
            })
        });

        iconFeature.setStyle(iconStyle);

        var baseLayer = new ol.layer.Tile({
            source: new ol.source.MapQuest({layer: 'sat'})
        });

        var vectorSource = new ol.source.Vector({
            features: [iconFeature]
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            zIndex: 1000
        });

        map = new ol.Map({
            target: $('#map')[0],
            layers: [baseLayer, vectorLayer],
            overlays: [mapOverlay],
            view: new ol.View({
                center: ol.proj.fromLonLat([11.040, 48.339]),
                zoom: 3
            })
        });

        map.getLayers().on('add', function () {
            layerIndex++;
        });

        //mapOverlay = new ol.Overlay({
        //    element: $popup[0],
        //    positioning: 'bottom-center',
        //    stopEvent: false
        //});
        //map.addOverlay(mapOverlay);

        // display popup on click
        map.on('click', function (evt) {
            console.log("Clicked on map");
            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function (feature) {
                    if (feature.getProperties().hasOwnProperty('pageIndex')) {
                        return feature;
                    }
                });
            if (feature) {
                var geometry = iconFeature.getGeometry();
                var coord = geometry.getCoordinates();
                mapOverlay.setPosition(coord);
            }
        });


        /**
         * Add a click handler to the map to render the popup.
         */
            // change mouse cursor when over marker
        map.on('pointermove', function (e) {
            var pixel = map.getEventPixel(e.originalEvent);

            var feature = map.forEachFeatureAtPixel(pixel,
                function (feature) {
                    if (feature.getProperties().hasOwnProperty('pageIndex')) {
                        return feature;
                    }
                });
            map.getTarget().style.cursor = feature ? 'pointer' : '';
        });

        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        $popupCloser.on('click', function () {
            mapOverlay.setPosition(undefined);
            $popupCloser[0].blur();
            return false;
        });

        window.onhashchange = getPageData;
        window.location.hash = '0';
    });
}());