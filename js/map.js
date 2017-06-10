var mymap = L.map('mapid').setView([53.56253, 9.9598], 17);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var mapUpdateTimeOut;
var markerList = [];
var markerLayer;

var cameraIcon = L.icon({
    iconUrl: 'icons/kamera_icon.png',

    iconSize:     [50,48], // size of the icon
    iconAnchor:   [25,25], // point of the icon which will correspond to marker's location
    popupAnchor:  [15,15] // point from which the popup should open relative to the iconAnchor
});


function processJSON(data){

  var e;
  markerList = [];
  for(var i = 0; i<data.elements.length;i++) {
    e = data.elements[i];
    markerList.push(L.marker([e.lat,e.lon],{icon: cameraIcon}));
  }
  // prevent adding markers multiple times
  if (markerLayer != undefined){
    markerLayer.clearLayers();
  }
  markerLayer = L.layerGroup(markerList);
  markerLayer.addTo(mymap);
}
function markCameraPosition(){
  if(mymap.getZoom()<14){
    return false;
  }
  var bounds = mymap.getBounds()
  $.get("https://overpass-api.de/api/interpreter?data=[out:json];node[man_made=surveillance]("+ bounds.getSouthWest().lat + ","
                                                                                              + bounds.getSouthWest().lng + ","
                                                                                              + bounds.getNorthEast().lat + ","
                                                                                              + bounds.getNorthEast().lng +");out;",processJSON);
}
function onMoveEnd() {
  clearTimeout(mapUpdateTimeOut);
  mapUpdateTimeOut = setTimeout(markCameraPosition, 2000);
}
markCameraPosition();
mymap.on("moveend",onMoveEnd);
