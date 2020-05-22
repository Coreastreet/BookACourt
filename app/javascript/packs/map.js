// map.js

document.addEventListener('DOMContentLoaded', function(){

  if (document.querySelector("#mapid") != null) {

      var GeoSearchControl = window.GeoSearch.GeoSearchControl;
      var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;

      var latitude;
      var longitude;
      var mymap;
      var marker;

      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider: provider,
      });


      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        alert("Geolocation is not supported by this browser.");
      }

      var titles = document.querySelectorAll(".card-columns .card-title");
      var addresses = document.querySelectorAll(".card-columns .card-address");
      var addressArray = [];
      var titleArray = [];
      for (var i = 0; i < addresses.length; i++) {
        addressArray.push(addresses[i].innerText);
        titleArray.push(titles[i].innerText);
      }
      // console.log(titleArray);
      var string;
        //console.log(addressArray[counter]);
      var getCoordinates = function (counter) {
        provider.search({ query: addressArray[counter] }).then(function(result) {
            //success of callback
            if (result.length != 0) {
              longitude = result[0]['x'];
              latitude = result[0]['y'];
              marker = L.marker([latitude, longitude]).addTo(mymap);
              string = `<b>${titles[counter].innerText}</b><br>${addressArray[counter]}`
              marker.bindPopup(string);
            } else {
              console.log("cannot bind pop-up");
            }
            //console.log(result[0]);
        }).catch(function (error) {
          // failed to get data
            console.log(error.message + "Error occurred");
        });
      };

      for (var i = 0; i < addresses.length; i++) {
          getCoordinates(i);
      }
          // do something with result;
    /*      if (result.length > 0) {
              //console.log(addressArray[2]);
              // console.log(result);


              console.log("Number is "+i);
              console.log(titleArray[i]);

          } else {
            console.log("Number is "+i); */
            //console.log(`Number ${counter} address not found`);

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
   }
});
