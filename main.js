var osmMap = L.tileLayer.provider('OpenStreetMap.Mapnik',{
    attribution: 'OpenStreetMap'
});
var topoMap = L.tileLayer.provider('OpenTopoMap');
var esriMap = L.tileLayer.provider('Esri.WorldImagery');

var baseMaps = {
    "Open Street Map": osmMap,
    'Topology Map': topoMap,
    'World Satellite Imagery': esriMap
}

// var wardnames =  'Postgres:bbmp_wards';

// var BBMP_Wards = L.Geoserver.wms (
//     "http://localhost:8080/geoserver/Postgres/wms",
//     {
//         layers: wardnames,
//         format: "image/png",
//         transparent: true,
//         version: "1.1.0",
//         tiled: true,
//     }
//  )


var wardnames1 =  'Postgres:vulnerable_flood_location';

var BBMP_Wards1 = L.Geoserver.wms (
    "http://localhost:8080/geoserver/Postgres/wms",
    {
        layers: wardnames1,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        tiled: true,
    }
)

var wasteColCent = 'Postgres:Bangalore_Waste_Collection_Centers';

var wasteColCent_layerConfig = L.Geoserver.wms (
    "http://localhost:8080/geoserver/Postgres/wms",
    {
        layers: wasteColCent,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        tiled: true,  
    }
)

var wasteProccUnit = 'Postgres:bangalore_wast_processing_unit';

var wasteProccUnit_layerConfig = L.Geoserver.wms (
    "http://localhost:8080/geoserver/Postgres/wms",
    {
        layers: wasteProccUnit,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        tiled: true,  
    }
)

var landfills = 'Postgres:Bangalore_landfills';

var landfills_layerConfig = L.Geoserver.wms (
    "http://localhost:8080/geoserver/Postgres/wms",
    {
        layers: landfills,
        format: "image/png",
        transparent: true,
        version: "1.1.0",
        tiled: true,  
    }
)

function onEachFeature(feature, layer){
    layer.on('click', function(e){
        var ourPopup = 'Ward No.: ' + e.target.feature.properties.kgiswardno + '<br>' + 'Name: ' + e.target.feature.properties.kgiswardna;
        layer.bindPopup(ourPopup, {className: 'Layer-Name-Popup'}).openPopup(e.latlng)
    })
}

var geojsonLayer = L.geoJSON(null, {
    onEachFeature: onEachFeature,
    style: function (feature){
            return {
                    color: 'black',
                  };
    }
})

// Request the GeoJSON representation of your WMS layer from GeoServer
fetch('http://localhost:8080/geoserver/Postgres/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Postgres%3Abbmp_wards&maxFeatures=300&outputFormat=application%2Fjson')
    .then(function (response) {
        return response.json();
    })
    .then(function (json) {
        geojsonLayer.addData(json);
    });


var overlaymaps = {
    "BBMP Wards": geojsonLayer,
    "Flood Locations": BBMP_Wards1,
    "Waste Collection Centers": wasteColCent_layerConfig,
    "Waste Processing Unit": wasteProccUnit_layerConfig,
    "Land Fills": landfills_layerConfig
};

var map = L.map('map',{
    center:[12.9716, 77.5946],
    zoom: 11,
    layers:[esriMap, geojsonLayer]
})

var mapLayers = L.control.layers(baseMaps, overlaymaps).addTo(map);

L.control.geocoder().addTo(map);