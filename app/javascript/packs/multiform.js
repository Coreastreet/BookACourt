$(document).ready( function () {

  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);

  var currentCard = 0;
  showCard(currentCard);
  $('.card').eq(0).find('button.previous').eq(0).css('display', 'none');
  $('.card').eq(-1).find('button.next').css('display', 'none');
  $('.card').eq(-1).find('button[type="submit"]').text('Submit');

  $('body').on('click', 'button.next', function() {
      nextPrev(1);
  });
  $('body').on('click', 'button.previous', function() {
      nextPrev(-1);
  });


  function showCard(n) {
    var cards = $('.card');
    cards.eq(n).show();
  }

  function nextPrev(n) {
    if (n == 1 && !is_valid()) {
      return false;
    }
    if (n == 1 && (currentCard == 1)) {
      saveOpeningHours();
    }
    var cards = $('.card');
    cards.eq(currentCard).css('display', 'none');
    currentCard += n;
    if (currentCard >= cards.length) {
      $('form#new_sports_centre').submit();
      return false;
    }
    showCard(currentCard);
  }

  // check all mandatory fields have been filled in
  function is_valid() {
    var valid = true;
    $('.card').eq(currentCard).find('input.mandatory').each( function() {
      if ($(this).val() == "") {
        $(this).addClass('is-invalid');
        valid = false;
      }
    });

    return valid;
  }

  function saveOpeningHours() {
    var finalJson = "";
    var jsonString = "";
    var counter = 0;
    var arr = [];
    $(".times").each( function(index) {
      if ($(this).text().trim().length > 0) {
          var splitArray = $(this).text().substring(5).split("-");
          var dayID = $(this).attr("id");
          var openingHour = splitArray[0];
          var closingHour = splitArray[1];
          jsonString  = `\"${dayID}\":{ \"openingHour\":\"${openingHour}\", \"closingHours\":\"${closingHour}\"}`;
          arr.push(jsonString);
          counter++;
      }
    });
    finalJson = `{${arr.join(", ")}}`;
    //var hours_json = JSON.parse(finalJson);
    //var string_hours_json = JSON.stringify(hours_json);
    $('#sports_centre_opening_hours').val(finalJson);
    console.log(finalJson);
  }

  $('.custom-file-input').on("change", function() {
    $(this.files).each( function() {
        console.log(this.name);
    });
  });
});
