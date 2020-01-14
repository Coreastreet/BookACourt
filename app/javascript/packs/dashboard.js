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
               date: newDate,
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
                 alert('new date chosen');
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
      var mainCard = $("#clockHolder");
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
      hiddenCard.height(mainCardHeight);
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

      $("body").on("click", ".datepicker-holder-row div.edit-profile", function() {
        table = $("table.courts-table")
        table.hide();
        table.next().hide();
        table.next().next().removeClass("d-none");
      });

      // Add the following code if you want the name of the file appear on select
      $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        var reader = new FileReader();
        // get loaded data and render thumbnail.
        reader.onload = function (e) {
          document.getElementById("image").src = e.target.result;
        };
        reader.readAsDataURL(this.files[0]);
      });

      $("body").on("click", "#repeat-card .endDate button.rounded-circle", function() {
        var startDateRegular = $("#clockHolder input.dateHolder").val();
        var formattedDate = new Date(startDateRegular);
        var stringFormattedDate = formattedDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
        replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2'); // get the current booking date

        var interval_number_of_days = $("#repeat-card .frequency-in-days").text();
        var dayOrWeek = $("#repeat-card .frequency input").attr("data-frequency-type");
        interval_number_of_days = (dayOrWeek == "Weeks") ? (interval_number_of_days * 7) : (interval_number_of_days); // get number of days in interval

        var startDateChanged = ((localStorage.getItem("startDate") == null) || (localStorage.getItem("startDate") != stringFormattedDate));
        var frequencyDaysChanged = ((localStorage.getItem("day_frequency") == null) || (localStorage.getItem("day_frequency") != interval_number_of_days));

        //console.log(startDateChanged, frequencyDaysChanged);
        // only send a http get request if the user has selected a different date or different frequency-interval
        // and then clicked on the number of bookings button.
        if (startDateChanged || frequencyDaysChanged) {

            localStorage.setItem("startDate", stringFormattedDate);
            localStorage.setItem("day_frequency", interval_number_of_days);

            var sports_centre_id_again = document.querySelector(".slideHolder").dataset.centre;
            // get the startTime and endTime
            var startTime = $("#clockHolder input.startTime").val();
            var endTime = $("#clockHolder input.endTime").val();
            var courtType = "half_court"; // assumed for now

            $.ajax({
                type: "GET",
                url: `/sports_centres/${sports_centre_id_again}/check_availability`,
                data: {
                  dayInterval: interval_number_of_days,
                  date: stringFormattedDate,
                  startTime: startTime,
                  endTime: endTime,
                  courtType: courtType
                },
                success: function(result) {
                  alert("Yes");
                },
                error: function(result) {
                  alert("error");
                }
            });
        }
        //if ($(this).parent().find(".number-of-bookings").text() > 0) {

        //}
      });

});
/*

*/
