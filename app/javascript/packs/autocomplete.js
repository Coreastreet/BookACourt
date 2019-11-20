$(document).on('turbolinks:load', function() {
  var input = document.getElementById('autocomplete')

  // Limit the results to just Cities in the US
  var options = {
    types: ['establishment'],
    componentRestrictions: {country: "au"}
   }

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    postal_code: 'short_name'
  };

  var autocomplete = new google.maps.places.Autocomplete(input, options)
  autocomplete.setFields(['address_components', 'adr_address', 'formatted_address', 'geometry', 'icon', 'name',
  'permanently_closed', 'photo', 'place_id', 'plus_code', 'type', 'url', 'utc_offset', 'vicinity']);

  google.maps.event.addListener(autocomplete, 'place_changed', function(){
     var place = autocomplete.getPlace()
     console.log(place.address_components)
     var title = place.name
     $('#title').val(title);
     document.getElementById('street_address').value = "";
     for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          if (addressType == "street_number" || addressType == "route") {
            console.log(i)
            var val = place.address_components[i][componentForm[addressType]] + " ";
            document.getElementById('street_address').value += val;
          } else {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
     }
  })
});
