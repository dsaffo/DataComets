const Map = (function (dispatch, data, dimensions) {

  var elem = document.querySelector('.sidenav');
  var instance = new M.Sidenav(elem);
  
  dispatch.on('openBranch.map', function () {
    console.log('hi map')

  });

  var map = L.map("map-canvas", {
    center: [32.3874292, -117.0763872],
    zoom: 20,
    maxZoom: 25,
    minZoom: 1,
    zoomControl: true
  });

  map.zoomControl.setPosition('bottomleft');

  var Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    maxNativeZoom: 18
  });

  Esri_WorldTopoMap.addTo(map);

  //L.svg().addTo(map);

});
