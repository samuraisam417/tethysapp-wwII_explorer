var map = new ol.Map({
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



//$.
//Clear map
//Read database
//Create function that will load the map with the desired KML files

var kmlLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: '/static/wwii_explorer/data/kml/Germany.kml',
          format: new ol.format.KML()
        })
      });
map.addLayer(kmlLayer);

//kmlLayer = new ol.layer.Vector({
//        source: new ol.source.Vector({
//          url: '/static/wwii_explorer/data/home_data/Italy.kml',
//          format: new ol.format.KML()
//        })
//      });
//map.addLayer(kmlLayer);
//
//kmlLayer = new ol.layer.Vector({
//        source: new ol.source.Vector({
//          url: '/static/wwii_explorer/data/home_data/China.kml',
//          format: new ol.format.KML()
//        })
//      });
//map.addLayer(kmlLayer);
//
//kmlLayer = new ol.layer.Vector({
//        source: new ol.source.Vector({
//          url: '/static/wwii_explorer/data/home_data/United_States.kml',
//          format: new ol.format.KML()
//        })
//      });
//map.addLayer(kmlLayer);
//
//kmlLayer = new ol.layer.Vector({
//        source: new ol.source.Vector({
//          url: '/static/wwii_explorer/data/home_data/Japan.kml',
//          format: new ol.format.KML()
//        })
//      });
//map.addLayer(kmlLayer);