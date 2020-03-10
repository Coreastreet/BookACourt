$.noConflict();
$(document).on('turbolinks:load', function () {
      //$("#NotificationModal").slideUp("fast", "swing");
      localStorage.setItem("preBookingsMade", 0);
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
             url: "91/date/13",
             data: {
               date: newDate,
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
             },
             error: function(result) {
                 alert('error');
             }
           });
      });
      $('#buttonHolder').on('click', "#addRemoveBookings", function(e) {
          newDate = $('#datepicker').datepicker('getFormattedDate');
          $.ajax({
             type: "GET",
             url: "91/date/13",
             data: {
               date: newDate,
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
             },
             error: function(result) {
                 alert('error');
             }
           });
           var firstId = document.querySelector("#dashBoardTable td");
           firstId.classList.add("border-darkBlue");
           Mousetrap.bind('ctrl+up', function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             var tbody = $("#dashBoardTable tbody");
             //if (currentTD != $("#dashBoardTable td:last-child")) {
             currentTD.removeClass("border-darkBlue");
             tbody.scrollTop(0);
             var index = currentTD.index();
             $("#dashBoardTable tbody tr:first-child").children().eq(index).addClass("border-darkBlue");
           });
           Mousetrap.bind('ctrl+down', function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             var tbody = $("#dashBoardTable tbody");
             //if (currentTD != $("#dashBoardTable td:last-child")) {
             currentTD.removeClass("border-darkBlue");
             tbody.scrollTop(1000);
             var index = currentTD.index();
             $("#dashBoardTable tbody tr:last-child").children().eq(index).addClass("border-darkBlue");
           });
           Mousetrap.bind('space', function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             currentTD.trigger("click");
           });
           Mousetrap.bind('ctrl+q', function() {
               var cancelButton = $("#dashBoardTable div.clone button.cancelNewBooking");
               cancelButton.trigger("click");
           });
           Mousetrap.bind('right', function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             //if (currentTD != $("#dashBoardTable td:last-child")) {
             if ((currentTD).is(":last-child")) {
                if (currentTD.parent().is(":last-child")) {
                  // do nothing
                } else {
                  currentTD.parent().next().children().eq(1).addClass("border-darkBlue");
                  currentTD.removeClass("border-darkBlue");
                }
             } else {
                currentTD.next().addClass("border-darkBlue");
                currentTD.removeClass("border-darkBlue");
             }
           });
           Mousetrap.bind('left', function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             if ((currentTD).index() == 1) {
               if (currentTD.parent().is(":first-child")) {
                 // do nothing
               } else {
                 currentTD.removeClass("border-darkBlue");
                 currentTD.parent().prev().children().eq(-1).addClass("border-darkBlue");
                 currentTD.removeClass("border-darkBlue");
               }
             } else {
                currentTD.removeClass("border-darkBlue");
                currentTD.prev().addClass("border-darkBlue");
             }
           });
           Mousetrap.bind("up", function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             var parentRow = currentTD.parent();
             var index;
             if (currentTD.parent().index() != 0) { // not first
                currentTD.removeClass("border-darkBlue");
                index = currentTD.index();
                parentRow.prev().children().eq(index).addClass("border-darkBlue");
             }
             var tbody = $("#dashBoardTable tbody");
             var currentScroll = tbody.scrollTop();
             if (parentRow.position().top <= 60) {
                tbody.scrollTop(currentScroll - 31);
             }
           });
           Mousetrap.bind("down", function() {
             var currentTD = $("#dashBoardTable td.border-darkBlue");
             var parentRow = currentTD.parent();
             var index;
             if (!parentRow.is(":last-child")) { // not first
                currentTD.removeClass("border-darkBlue");
                index = currentTD.index();
                parentRow.next().children().eq(index).addClass("border-darkBlue");
             }
             var tbody = $("#dashBoardTable tbody");
             var currentScroll = tbody.scrollTop();
             if ((parentRow.position().top + 40) >= tbody.height()) {
                tbody.scrollTop(currentScroll + 31.5);
             }
           });
      });
      $( "td.active.day"  ).trigger( "click" );
      // alert("Hey!");
      /* $('body').on('click', '[data-toggle="dropdown"]', function() {
        $('.dropdown-toggle').dropdown()
      }); */
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

      table = $("#dashBoardTable");
      editProfile = $("#editProfileBody");
      hoursRow = $("#opening_hours_row");
      courtTimes = $("#courtTimes");
      editForm = $("#editLogoForm");
      pricesForm = $("#pricesForm");
      var connectedRowId;
      var thisConnectedRowId;
      $("body").on("click", "#buttonHolder .row", function() {
        //alert("hey");
            $(this).siblings().each(function() {
              connectedRowId = $(this).attr("data-connectedRow");
              //console.log(connectedRowId);
              $(this).removeClass("bg-black");
              $(`${connectedRowId}`).addClass("d-none");
            });
            // highlight in black
            $(this).addClass("bg-black");
            // alter size of table in top two buttons
            /* if ($(this).attr("id") == "addRemoveBookings") {
              $("#dashBoardTable").find("tbody").removeClass("h-70vh");
              $("#dashBoardTable").find("tbody").addClass("h-50vh");
            } */
            /* if ($(this).attr("id") == "manage-bookings") {
              $("#dashBoardTable").find("tbody").removeClass("h-50vh");
              $("#dashBoardTable").find("tbody").addClass("h-70vh");
            } */
              thisConnectedRowId = $(this).attr("data-connectedRow");
              $(`${thisConnectedRowId}`).removeClass("d-none");
      });
      // add darkness to selected button for day of opening hours
      $("#weekdaysButtonRow").on("click", "button", function() {
        //var data;
          if ($(this).hasClass("selected-button") == false) {
            //data = $(this).attr("data-numberOfCourts")
            $(this).siblings().each( function() {
                $(this).removeClass("selected-button");
                //$(`#hiddenCourtsNo input[type='radio'][value='${data}']`).prop("checked", false);
            });
            $(this).addClass("selected-button");
            var openingTime = $(this).attr("data-openingHour");
            var closingTime = $(this).attr("data-closingHour");
            var timeHolders = $("#editProfileBody span.timeHolder");
            timeHolders[0].innerText = openingTime;
            timeHolders[1].innerText = closingTime;

            var openingTimeInput = parseFloat(convertAMPMToString(openingTime).replace(":30", ".5"));
            var closingTimeInput = parseFloat(convertAMPMToString(closingTime).replace(":30", ".5"));

            timeHolders.eq(0).parent().next().val(openingTimeInput);
            timeHolders.eq(1).parent().next().val(closingTimeInput);
            //data = $(this).attr("data-numberOfCourts");
            //$(`#hiddenCourtsNo input[type='radio'][value='${data}']`).prop("checked", true);
          }
      });

      function convertAMPMToString(ampmTime) {
         var newTime;
         var shortened = ampmTime.substring(0,(ampmTime.length - 2));
         var splitArray;
         var ampm = ampmTime.substr(-2);
         if (ampm == "PM") {
            splitArray = shortened.split(":");
            if (parseInt(splitArray[0]) < 12) {
              newTime = `${parseInt(splitArray[0]) + 12}:${splitArray[1]}`;
            } else {
              newTime = `${parseInt(splitArray[0])}:${splitArray[1]}`;
            }
            //newTime = newTime.replace(".", ":").toFixed(2);
         } else {  // ampm == "AM"
            //newTime = ampmTime.substring(0,(ampmTime.length - 2));
            newTime = (parseInt(shortened.substr(0,2)) < 10) ? `0${shortened}` : shortened;
         }
         return newTime;
      }

      // add darkness to selected button for day of peak hours
      $("#weekdaysButtonRow2").on("click", "button", function() {
        //var data;
          if ($(this).hasClass("selected-button") == false) {
            //data = $(this).attr("data-numberOfCourts")
            $(this).siblings().each( function() {
                $(this).removeClass("selected-button");
                //$(`#hiddenCourtsNo input[type='radio'][value='${data}']`).prop("checked", false);
            });
            $(this).addClass("selected-button");
            var peakHourStart = $(this).attr("data-peakHourStart");
            var peakHourEnd = $(this).attr("data-peakHourEnd");
            var timeHolders = $("#editProfileBody span.peakTimeHolder");
            timeHolders[0].innerText = peakHourStart;
            timeHolders[1].innerText = peakHourEnd;

            var peakHourStartInput = parseFloat(convertAMPMToString(peakHourStart).replace(":30", ".5"));
            var peakHourEndInput = parseFloat(convertAMPMToString(peakHourEnd).replace(":30", ".5"));

            timeHolders.eq(0).parent().next().val(peakHourStartInput);
            timeHolders.eq(1).parent().next().val(peakHourEndInput);
            //data = $(this).attr("data-numberOfCourts");
            //$(`#hiddenCourtsNo input[type='radio'][value='${data}']`).prop("checked", true);
          }
      });

      // addActivity button add a listen to display another box above.
      $("#editPricesForm").on("click", "#addActivity", function() {
          var newActivity = $("#newActivityInput").val();
          var activityRow = $("#activityCardHolder");
          var optionMatched = false;
          var optionSrc;
          var clone;
          if (newActivity.length > 0) {
            $("#activities option").each( function() {
                if ($(this).val() == newActivity) {
                  optionMatched = true;
                  optionSrc = $(this).attr("data-assetPath");
                }
            });
            clone = activityRow.children().first().clone();
            clone.find(".activityName").text(newActivity);
            // clear data attributes
            clone.attr("data-hc-op", "");
            clone.attr("data-hc-p", "");
            clone.attr("data-hc-we", "");
            clone.attr("data-fc-op", "");
            clone.attr("data-fc-p", "");
            clone.attr("data-fc-we", "");

            clone.attr("data-activity", newActivity);
            clone.removeClass("selectedCard");
            if (optionMatched) {
                clone.find("img").attr("src", optionSrc);
            } else {
                clone.find("img").attr("src", "#");
            }
            clone.insertBefore($("#addActivityCard"));
          }
      });

      $("#editPricesForm").on("click", "#addActivityCard", function() {
            $('#activityModal').css("display", "block");
      });

      $("#editPricesForm").on("click", "#closeActivityModal", function() {
            $('#activityModal').css("display", "none");
      });

      $("#editPricesForm").on("change", ".bookingRate", function() {
            var activityCardSelected = $("#activityCardHolder .selectedCard");
            var dataType = $(this).attr("data-type");
            activityCardSelected.attr(dataType, $(this).val());
      });



      $("#activityCardHolder").on("click", ".activityCard", function() {
          $(this).siblings().each( function() {
              $(this).removeClass("selectedCard");
          });
          $(this).addClass("selectedCard");
          var selected = $(this);
          // fill the inputs with the values stored in the data-* of activity card selected.
          $("#editPricesForm input.bookingRate").each( function() {
              var dataType = $(this).attr("data-type");
              $(this).val(selected.attr(dataType));
          });
      });

      // enable deletion of activity on click in the top right corner.
      $("#activityCardHolder").on("click", ".deleteActivity", function() {
          $(this).closest(".activityCard").remove();
      });

      function convertTimeIntoString(number) {
        var stringTime = number.toString();
        //var minutes = stringTime.substr(1);
        if (Number.isInteger(number)) {
          stringTime = stringTime + ":00";
        } else {
          stringTime = stringTime.replace(".5", ":30");
        }
        if (number < 10) {
          stringTime = "0" + stringTime;
        }
        return stringTime;
      }

      function convertToAMPM(timeString) {
        var hours_and_minutes = timeString.split(":");
        var parsed_int = parseInt(hours_and_minutes[0]);
        var int = (parsed_int % 12 == 0) ? 12 : parsed_int % 12;
        var am_or_pm = (hours_and_minutes[0] >= 12) ? "PM" : "AM";
        return `${int}:${hours_and_minutes[1]}${am_or_pm}`
      }

      // enable storing of the opening and closing hours of the weekdays new version
      $("#editProfileBody").on("input", ".custom-range", function() {
          var timeString = convertTimeIntoString(parseFloat($(this).val()));
          $(this).prev().find("span").text(convertToAMPM(timeString));
      });

      $("#editProfileBody").on("change", ".custom-range", function() {
          var timeString = convertTimeIntoString(parseFloat($(this).val()));
          var rangeType = $(this).attr("data-type");
          var prevSelectedButton = $(this).closest(".rangeHolder").find("button.selected-button");
          console.log(prevSelectedButton);
          prevSelectedButton.attr(rangeType, convertToAMPM(timeString));
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

      $("#editBusinessHoursForm").bind('ajax:complete', function() {
          $(this).find("#hours-success").removeClass("d-none");
      });

       $("#editBusinessHoursForm").bind('ajax:error', function() {
           $(this).find("#hours-failure").removeClass("d-none");
      });

      $("#editBusinessHoursForm").submit(function() {
          $(this).find("#hours-success").addClass("d-none");
          $(this).find("#hours-failure").addClass("d-none");
          var openingTimesObject = {};
          var timeObject = {};
          $("#weekdaysButtonRow button").each( function() {
              timeObject = {};
              timeObject["openingHour"] = $(this).attr("data-openingHour");
              timeObject["closingHour"] = $(this).attr("data-closingHour");
              openingTimesObject[$(this).attr("data-day").substr(0,3)] = timeObject;
          });
          var stringOpeningTimes = JSON.stringify(openingTimesObject);
          $("#sports_centre_opening_hours").val(stringOpeningTimes);

          // collect the hours for the peak hours
          var peakTimesObject = {};
          $("#weekdaysButtonRow2 button").each( function() {
              timeObject = {};
              timeObject["startingPeakHour"] = $(this).attr("data-peakHourStart");
              timeObject["closingPeakHour"] = $(this).attr("data-peakHourEnd");
              peakTimesObject[$(this).attr("data-day").substr(0,3)] = timeObject;
          });
          var stringPeakTimes = JSON.stringify(peakTimesObject);
          $("#sports_centre_peak_hours").val(stringPeakTimes);
          return true;
      });

      $("#editPricesForm").submit(function() {
          var pricesHash = {};
          var activity;
          //var halfCourtPrices;
          //var fullCOurtPrices;
          var hc_op;
          var hc_p;
          var hc_we;
          var fc_op;
          var fc_p;
          var fc_we;

          // add regular booking later on.
          $("#editPricesForm .activityCard").each(function(){
              //pricesHash = {};
              activity = $(this).attr("data-activity");

              hc_op = $(this).attr("data-hc-op");
              hc_p = $(this).attr("data-hc-p");
              hc_we = $(this).attr("data-hc-we");

              fc_op = $(this).attr("data-fc-op");
              fc_p = $(this).attr("data-fc-p");
              fc_we = $(this).attr("data-fc-we");
              pricesHash[activity] = {"casual" : {"half_court":{"off_peak": `${hc_op}`, "peak_hour": `${hc_p}`, "Weekend": `${hc_we}`},
              "full_court": {"off_peak": `${fc_op}`, "peak_hour": `${fc_p}`, "Weekend": `${fc_we}`}}};
              //console.log($(this));
              //console.log(pricesHash);
          });
          //console.log(JSON.stringify(pricesHash));
          $("#sports_centre_prices").val(JSON.stringify(pricesHash));
          return true;
      });
});
/*
      $("#regularBookingBody").on("click","#halfRegBookingsSave, #fullRegBookingsSave", function(){
          var filledIn = true;
          var form = $(`${$(this).attr("courtType")}-court-reg-booking`);
          var sports_centre_id = $("#id-holder").attr("data-sports-centre-id");
          $(this).find(".reg-input").each( function() {
                if ($(this).value.length = 0) {
                    filledIn = false;
                }
          });
          var startDate = new Date(form.find(".reg-startDate"));
          var noBookings = form.find(".reg-number");
          var days = form.find(".days");
          var endDate = addDays(startDate, parseInt(noBookings) * parseInt(days));
        //  var endDate =

          if (filledIn) {
            $.ajax({
              type: "POST",
              url: `${sports_centre_id}/addNewBookings`,
              data: {
                regularBooking: {
                  order: {
                    startDate: startDate,
                    endDate: endDate,
                    daysInBetween: days,
                    fullName: fullName
                  },
                  booking: {

                  }
                }
              },
              success: function(result) {
                  alert("new bookings posted");
              },
              failure: function(result) {
              },
              //dataType: "json"
            })
          } else {
            alert("Not all fields filled in");
          }
      });

      function addDays(date, days) {
        var copy = new Date(Number(date));
        copy.setDate(date.getDate() + days);
        return copy;
      } */
