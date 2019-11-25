document.addEventListener('DOMContentLoaded', function(){

  var GeoSearchControl = window.GeoSearch.GeoSearchControl;
  var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
  
  const provider = new OpenStreetMapProvider();
  const searchControl = new GeoSearchControl({
    provider: provider,
  });

  provider.search({ query: "Morris Iemma Sports Centre" }).then(function(result) {
    // do something with result;
    console.log(result);
  });


  var latitude;
  var longitude;
  var mymap;
  var marker;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }

  function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    mymap = L.map('mapid').setView([latitude, longitude], 13);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY29yZWFzdHJlZXQiLCJhIjoiY2szZTA5N3RkMWY2NTNkbzFibWVyMTBqZiJ9.Cu4QOakswmv-NyeoW-twrQ', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiY29yZWFzdHJlZXQiLCJhIjoiY2szZTA5N3RkMWY2NTNkbzFibWVyMTBqZiJ9.Cu4QOakswmv-NyeoW-twrQ'
    }).addTo(mymap);
    marker = L.marker([latitude, longitude]).addTo(mymap);
  }

});
