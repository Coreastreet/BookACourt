$.noConflict();
$(document).ready( function () {
      $('#datepicker').datepicker();
      var today = new Date();
      var newDate;
      $('#datepicker').datepicker("setDate", today);
      $('#datepicker').on('changeDate', function(e) {
          //$('#my_hidden_input').val(
          //alert($('#datepicker').datepicker('getFormattedDate'));
          newDate = $('#datepicker').datepicker('getFormattedDate');
          $('#my_hidden_input').val(
              $('#datepicker').datepicker('getFormattedDate')
          );
          // $('#datepicker').datepicker("setDate", info);
          $.ajax({
             type: "GET",
             url: "19/date/13",
             data: {
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
                 //alert('ok, what the hell');
             },
             error: function(result) {
                 alert('error');
             }
           });
      });
      $( "td.active.day"  ).trigger( "click" );
      // alert("Hey!");
      $('body').on('click', '[data-toggle="dropdown"]', function() {
        $('.dropdown-toggle').dropdown()
      });
      //alert("cardBodies");
      // adjust level of div to right side of main card body
      var mainCard = $(".card.main");
      var mainCardHeight = mainCard.outerHeight();
      var cardTitleHeight = mainCard.find(".card-title").height();
      var cardBodyHeight = mainCard.find(".card-body").height();
      var cardTimeHeight = mainCard.find(".input-group").outerHeight();
      //var cardCanvasHeight = mainCard.find("#canvas").outerHeight();

      var hiddenCard = mainCard.next();
      //var hiddenCardHeight = hiddenCard.height();
      //console.log(cardTitleHeight, hiddenCard);
      var negMarginTop = -1 * (mainCardHeight);
      //console.log(negMarginTop)
      hiddenCard.css("margin-top", negMarginTop);
      hiddenCard.height(cardTitleHeight + cardBodyHeight - cardTimeHeight);
      //console.log(hiddenCard);

      $('body').on("click", ".repeat", function() {
        hiddenCard.css("margin-left", 0);
      });

      $('body').on("click", ".back-arrow-booking", function() {
        $(this).closest(".card").css("margin-left", "100%");
      });

      $('body').on("click", ".back-arrow-booking", function() {
        $(this).closest(".card").css("margin-left", "100%");
      });
      // enable the buttons in hidden card to add and minus values.
      var number;
      var input;
      var inputArray;
      var inputString;
      $('body').on("click", ".add-and-minus .minus-button", function() {
        number = parseInt($(this).next().text());
        if (number > 0) {
          number -= 1;
          $(this).next().text(number);
          input = $(this).closest(".form-row").find("input");
          //console.log(input);
          inputArray = input.attr("placeholder").split(" ");
          //console.log(inputArray);
          if (number == 1) {
            if ($(this).closest(".form-row").hasClass("frequency")) {
                inputString = `${inputArray[0]} ${inputArray[inputArray.length - 1]}`;
            } else {
              inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}`;
            }
          } else {
            inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}s`;
          }

          input.val(inputString);
        }
        //console.log(number);

      });

      $('body').on("click", ".add-and-minus .plus-button", function() {
        number = parseInt($(this).prev().text());
        if (number < 52) {
          number += 1;
          $(this).prev().text(number);
          input = $(this).closest(".form-row").find("input");

          inputArray = input.attr("placeholder").split(" ");
          console.log(inputArray);
          if (number == 1) {
            if ($(this).closest(".form-row").hasClass("frequency")) {
                inputString = `${inputArray[0]} ${inputArray[inputArray.length - 1]}`;
            } else {
              inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}`;
            }
          } else {
            inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}s`;
          }
          input.val(inputString);
        }
        //console.log(number);
      });

      //
      $('body').on("click", ".days-and-weeks button", function() {
        //var frequency_options = $(this).find("button");
        var input = $(this).closest(".form-row").find("input");
        var inputString = input.val();
        $(this).addClass("btn-selected");
        $(this).siblings().not($(this)).removeClass("btn-selected");
        if ($(this).attr("data-frequency-type") == "Days") {
          input.attr("placeholder", "Every Day");
          input.attr("data-frequency-type", "Days");
          if (inputString.length > 0) {
            input.val(inputString.replace("Week", "Day"));
          }
        } else { // if this hasClass "weeks"
          input.attr("placeholder", "Every Week");
          input.attr("data-frequency-type", "Weeks");
          if (inputString.length > 0) {
            input.val(inputString.replace("Day", "Week"));
          }
        }
      });

});
/*

*/
