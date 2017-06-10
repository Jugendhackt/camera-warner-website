var mymap = L.map('mapid').setView([53.56253, 9.9598], 17);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var mapUpdateTimeOut;
var markerList = [];
var markerLayer;

function processJSON(data){

  var e;
  markerList = [];
  for(var i = 0; i<data.elements.length;i++) {
    e = data.elements[i];
    markerList.push(L.marker([e.lat,e.lon]));
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
