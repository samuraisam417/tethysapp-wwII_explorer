var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'sat'})
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 4
    })
});

var kmlLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: '/static/wwii_explorer/data/Germany.kml',
          format: new ol.format.KML()
        })
      });
map.addLayer(kmlLayer);