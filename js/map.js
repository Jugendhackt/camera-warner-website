var mymap = L.map('mapid').setView([53.56253, 9.9598], 17);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

var mapUpdateTimeOut;

function processJSON(data){
  var e;
  for(var i = 0; i<data.elements.length;i++) {
    e = data.elements[i];
    L.marker([e.lat,e.lon]).addTo(mymap);
    console.log(e);
  }
}
function markCameraPosition(){
  var bounds = mymap.getBounds()
  $.get("https://overpass-api.de/api/interpreter?data=[out:json];node[man_made=surveillance]("+ bounds.getSouthWest().lat + ","
                                                                                              + bounds.getSouthWest().lng + ","
                                                                                              + bounds.getNorthEast().lat + ","
                                                                                              + bounds.getNorthEast().lng +");out;",processJSON);
}
function onMoveEnd() {
  clearTimeout(mapUpdateTimeOut);
  mapUpdateTimeOut = setTimeout(markCameraPosition, 1500);
}
markCameraPosition();
mymap.on("moveend",onMoveEnd);
