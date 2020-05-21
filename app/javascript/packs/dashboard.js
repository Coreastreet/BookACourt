$.noConflict();
$(document).on('turbolinks:load', function () {

      Colors = {};
      DefaultColors = {};
      DefaultColors.names = {
        // always available for default sports
          basketball: "#ffce80",
          badminton: "#99ccff",
          volleyball: "#bfff80",
          event: "#e7c7ae",
      };
      Colors.names = {
          // variable new colors
          aqua: "#00ffff",
          azure: "#f0ffff",
          blue: "#0000ff",
          brown: "#a52a2a",
          darkblue: "#00008b",
          darkcyan: "#008b8b",
          darkgrey: "#a9a9a9",
          darkgreen: "#006400",
          darkkhaki: "#bdb76b",
          darkmagenta: "#8b008b",
          darkolivegreen: "#556b2f",
          darkorange: "#ff8c00",
          darkorchid: "#9932cc",
          darkred: "#8b0000",
          darksalmon: "#e9967a",
          fuchsia: "#ff00ff",
          gold: "#ffd700",
          green: "#008000",
          indigo: "#4b0082",
          khaki: "#f0e68c",
          lightgreen: "#90ee90",
          lime: "#00ff00",
          maroon: "#800000",
          navy: "#000080",
          olive: "#808000",
          orange: "#ffa500",
          purple: "#800080",
          violet: "#800080",
          red: "#ff0000",
      };
      // random color selector.
      Colors.random = function() {
          var result;
          var count = 0;
          for (var prop in this.names)
              if (Math.random() < 1/++count)
                 result = prop;
          return result;
      };

      // set up nice and early the colors of venues and courts.
      $("#activityCardHolder .activityCard[data-color]").each( function() {
            $(this).find(".display-1").css("color", $(this).attr("data-color"));
          }
      );
      //$("#NotificationModal").slideUp("fast", "swing");
      var idValue = $("#id-holder").attr("data-sports-centre-id");

      var transactionFee = parseFloat($("#feeHolder").text());
      if (transactionFee != 0) {
        $("#feeHolder").text(`${transactionFee}%`);
      } else {
        $("#feeHolder").text("N/A");
      }
      var upgradePlanButton = $("#upgrade_plan");
      var currentPlanType = upgradePlanButton.attr("data-plan");
      var currentPlanButton = $('#upgradePlanBody button.planButton').filter(`[data-planType=${currentPlanType}]`)
      currentPlanButton.text("Current Plan");
      currentPlanButton.prev().click();
      currentPlanButton.closest(".planCard").addClass("border border-dark");

      // attach color to each activity letter.
      var activityColor;
      $("#activityCardHolder .activityCard").each( function() {
          $(this).find(".display-icon").css("color", $(this).attr("data-color"));
      });

      // max width css for the equalTH
      var headersEqualTH = $("#dashBoardTable thead th.equalTH");
      headersEqualTH.css("max-width", `${100/headersEqualTH.length}%`);

      $("#upgradePlanBody").on("click", "button.planButton", function() {
          $(this).prev().click();
          //$(this).prev().prop("checked", true);
          $("#upgradePlanBody button.planButton").each( function() {
              $(this).closest(".planCard").removeClass("border border-dark");
              $(this).text("Select");
          });
          $(this).closest(".planCard").addClass("border border-dark");
          $(this).text("Current Plan");
      });

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
             url:  `${idValue}/date/`,
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
             url: `${idValue}/date/`,
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
                  currentTD.parent().children().eq(1).addClass("border-darkBlue");
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
                 currentTD.parent().children().eq(-1).addClass("border-darkBlue");
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
                parentRow.children().first().addClass("text-muted");
                parentRow.prev().children().first().removeClass("text-muted");
             } else {
                //parentRow.children().first().removeClass("h3").addClass("h4 text-muted");
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
                parentRow.children().first().addClass("text-muted");
                parentRow.next().children().first().removeClass("text-muted");
             } else {
                //parentRow.children().first().removeClass("h3").addClass("h4 text-muted");
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

      $("#editLogoForm").submit( function() {
        // get an array of the court names
        var arrayCourtNames = [];
        var courtNamesButtonGroup = $("#courtNamesButtonGroup button");
        courtNamesButtonGroup.each( function() {
            arrayCourtNames.push($(this).text());
        });
        $("#sports_centre_arrayCourtNames").val(arrayCourtNames);
        // attach the value of the random colors to each activity/venue.

        var buttonRef = $(this).parent().attr("data-buttonRef");
        var input = $("<input>").attr("type", "hidden").attr("name", "buttonRef").val(buttonRef);
        $('#editLogoForm').append(input);
        return true
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
              $(`${connectedRowId}`).find(".alert").addClass("d-none");
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
            if (shortened == "12:00") {
              newTime = "24:00";
            } else {
              newTime = (parseInt(shortened.substr(0,2)) < 10) ? `0${shortened}` : shortened;
            }
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
          var newActivity = $("#newActivityInput");
          var newActivityValue = newActivity.val();
          var activityRow = $("#activityCardHolder");
          var optionMatched = false;
          var optionSrc;
          var clone;
          var currentColors = [];
          var randColor;
          //var iconHolder = $("#icon_photo");
          var imgInClone;
          var buttonsCourtsAllowed = $("#courtsAllowedButtons button.selected-button");
          var courtsAllowedString = "";
          //var iconInput = $("#customIconFile");
          var defaultPrice = (newActivityValue == "event") ? "0" : "";
          if (newActivityValue.length > 0) {
            clone = $("#templateActivityCard").clone();

            $("#activities option").each( function() {
                if ($(this).val() == newActivityValue) {
                  optionMatched = true;
                  optionSrc = $(this).attr("data-assetPath");
                  clone.attr("data-color", $(this).attr("data-color"));
                }
            });

            // accumulate all the courts allowed to a string.
            buttonsCourtsAllowed.each(function() {
                courtsAllowedString += $(this).attr("data-courtId") + ",";
            });
            courtsAllowedString = courtsAllowedString.substring(0, courtsAllowedString.length - 1);

            clone.find(".activityName").text(newActivityValue);
            // clear data attributes
            clone.attr("data-courtsAllowed", courtsAllowedString);
            clone.attr("data-hc-op", defaultPrice);
            clone.attr("data-hc-p", defaultPrice);
            clone.attr("data-hc-we", defaultPrice);
            clone.attr("data-fc-op", defaultPrice);
            clone.attr("data-fc-p", defaultPrice);
            clone.attr("data-fc-we", defaultPrice);

            clone.attr("data-activity", newActivityValue.split(" ").join("_"));
            clone.removeClass("selectedCard, d-none");
            if (optionMatched) {
              clone.find("img").attr("src", optionSrc);
            } else {
              imgInClone = clone.find("img");
              imgInClone.addClass("d-none");
              //$(`<div class="display-1">${}</div>`).insertBefore(imgInClone);
              // create a random color to associate with venue;
              activityRow.find(".activityCard").each(function() {
                currentColors.push($(this).attr("data-color"));
              });
              do {
                randColor = Colors.random();
              } while (currentColors.includes(randColor));
              clone.attr("data-color", randColor);
              clone.find(".display-icon").removeClass("d-none").css("color", randColor).text(newActivityValue.charAt(0).toUpperCase());
            }
            clone.prependTo($("#activityCardHolder"));
          } else {
            newActivity.addClass("is-invalid");
          }
      });

      // for the button set on edit prices form, both of them
      $("#courtsAllowedButtons").on("click", "button", function() {
          if ($(this).hasClass("selected-button")) {
            $(this).removeClass("selected-button");
          } else {
            if ($(this).hasClass("allCourts")) {
                $(this).siblings().removeClass("selected-button");
            } else {
              $(this).siblings().last().removeClass("selected-button");
            }
            $(this).addClass("selected-button");
          }
      });

      $("#courtsAllowedButtonsReg").on("click", "button", function() {
          if ($(this).hasClass("selected-button")) {
            $(this).removeClass("selected-button");
          } else {
            if ($(this).hasClass("allCourts")) {
                $(this).siblings().removeClass("selected-button");
            } else {
              $(this).siblings().last().removeClass("selected-button");
            }
            $(this).addClass("selected-button");
          }

          var buttonsCourtsAllowedReg = $("#courtsAllowedButtonsReg button.selected-button");
          var courtsAllowedStringReg = "";
          buttonsCourtsAllowedReg.each(function() {
              courtsAllowedStringReg += $(this).attr("data-courtId") + ",";
          });
          courtsAllowedStringReg = courtsAllowedStringReg.substring(0, courtsAllowedStringReg.length - 1);

          $("#activityCardHolder div.selectedCard").attr("data-courtsAllowed", courtsAllowedStringReg);
      });

      // on click button for court name, enter name into input.
      $("#courtNamesButtonGroup").on("click", "button", function() {
          var courtNameInput = $("#newCourtNameInput");
          if ($(this).hasClass("selected-button")) {
            $(this).removeClass("selected-button");
            courtNameInput.val("");
          } else {
            $(this).siblings().removeClass("selected-button");
            $(this).addClass("selected-button");
            courtNameInput.val($(this).text());
          }
      });

      $("#newCourtNameInput").on("input", function() {
            var selectedButton = $("#courtNamesButtonGroup button.selected-button");
            selectedButton.text($(this).val());
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
        // hide on event card since price zero already set.
          if ($(this).attr("data-activity") == "event") {
              $("#editPricesForm #priceSettings").css("display", "none");
          } else {
              $("#editPricesForm #priceSettings").css("display", "flex");
          }
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

          var courtAllowedButtons = $("#courtsAllowedButtonsReg button");
          courtAllowedButtons.removeClass("selected-button");
          if ($(this).attr("data-courtsAllowed") != "") {
                //var courtAllowedButtons = $("#courtsAllowedButtonsReg button");
                var splitCourtsAllowed = $(this).attr("data-courtsAllowed").split(",");
                console.log(splitCourtsAllowed, courtAllowedButtons);
                if (splitCourtsAllowed.length == (courtAllowedButtons.length - 1)) { // all courts selected
                    courtAllowedButtons.last().addClass("selected-button");
                } else {
                    for (var courtId in splitCourtsAllowed) {
                        $(`#courtsAllowedButtonsReg button[data-courtId=${splitCourtsAllowed[courtId]}]`).addClass("selected-button");
                    }
                }
            }
      });

      // enable deletion of activity on click in the top right corner.
      $("#activityCardHolder").on("click", ".deleteActivity", function() {
          $(this).closest(".activityCard").remove();
      });

      function convertTimeIntoString(number) {
        var stringTime = number.toString();
        //var minutes = stringTime.substr(1);
        if (Number.isInteger(number)) {
          if (number == 24) {
            stringTime = '00';
          }
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

      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
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
      $("#editLogoForm .custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        var reader = new FileReader();
        var imageLogo = document.getElementById("image");
        // get loaded data and render thumbnail.
        reader.onload = function (e) {
          imageLogo.src = e.target.result;
          imageLogo.classList.remove("d-none");
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

/*      $("#payFeesBody").on("click", "#payTransactionFees", function() {
          $.ajax({
              type: "GET",
              url: ``,
              data: {
              },
              success: function(result) {
                alert("Yes");
              },
              error: function(result) {
                alert("error");
              }
          });
      });
*/
      $("#planForm").bind('ajax:complete', function() {
          $(this).find("#plan-success").removeClass("d-none");
          var planRadio = $("input[type='radio']:checked");
          $("#upgradePlanBody button.planButton").text("Select");
          var planSelectedButton = planRadio.next()
          planSelectedButton.text("Current Plan");
          var planSelected = planRadio.val();
          $("#upgrade_plan").attr("data-plan", planSelected);
          $("#feeHolder").text(planSelectedButton.attr("data-planFee"));
          $("#planHolder").text(planSelectedButton.attr("data-planType"));
          if (planSelected != "Basic") {
              $("#wrapperCode").removeClass("d-none");
              $("#step4").removeClass("d-none");
              $("#step5").removeClass("d-none");
              $("#wrapperCode #scriptCode").val('<script async src="https://weball.com.au/demo_async.js"></script>');
              $("#wrapperCode #widgetCode").val(`<div data-sportsCentreId=${idValue}></div>`);
          } else {
              $("#wrapperCode #scriptCode").val("");
              $("#wrapperCode #widgetCode").val("");
              $("#wrapperCode").addClass("d-none");
              $("#step4").addClass("d-none");
              $("#step5").addClass("d-none");
          }
      });

      $("#planForm").submit(function() {
            var buttonRef = $(this).parent().attr("data-buttonRef");
            var input = $("<input>").attr("type", "hidden").attr("name", "buttonRef").val(buttonRef);
            $('#planForm').append(input);
      });

       $("#planForm").bind('ajax:error', function() {
           $(this).find("#plan-failure").removeClass("d-none");
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

          // attach buttonref
          var buttonRef = $(this).parent().attr("data-buttonRef");
          var input = $("<input>").attr("type", "hidden").attr("name", "buttonRef").val(buttonRef);
          $('#editBusinessHoursForm').append(input);

          return true;
      });

      $("#editPricesForm").submit(function() {

          $(this).find("#prices-success").addClass("d-none");
          $(this).find("#prices-failure").addClass("d-none");

          var pricesHash = {};
          var courtsAllowedHash = {};
          var activity;
          //var halfCourtPrices;
          //var fullCOurtPrices;
          var hc_op;
          var hc_p;
          var hc_we;
          var fc_op;
          var fc_p;
          var fc_we;

          // first set value for the colors of Venues
          var venue_colors = {};
          $("#activityCardHolder .activityCard[data-color]").each( function() {
                venue_colors[$(this).attr("data-activity")] = $(this).attr("data-color");
              }
          );
          //console.log("venue colors", JSON.stringify(venue_colors);
          $("#sports_centre_venue_colors").val(JSON.stringify(venue_colors));

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
              courtsAllowedHash[activity] = $(this).attr("data-courtsAllowed");
          });
          //console.log(JSON.stringify(pricesHash));
          $("#sports_centre_prices").val(JSON.stringify(pricesHash));
          $("#sports_centre_courtsAllowed").val(JSON.stringify(courtsAllowedHash));
          // attach the panel button id
          var buttonRef = $(this).parent().attr("data-buttonRef");
          var input = $("<input>").attr("type", "hidden").attr("name", "buttonRef").val(buttonRef);
          $('#editPricesForm').append(input);
          return true;
      });

      $("#editPricesForm").bind('ajax:complete', function() {
          $(this).find("#prices-success").removeClass("d-none");
      });

      $("#col-9-admin").on("click", ".checkAdminPin", function() {
          var adminPin = $(this).prev().val();
          var buttonId = $(this).closest(".lockdown").attr("data-buttonRef");
          $.ajax({
             type: "POST",
             url:  `${idValue}/checkAdminPin`,
             data: {
               adminPin: adminPin,
               buttonId: buttonId,
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
             },
             error: function(result) {
                 alert('error');
             }
           });
      });

      $("#col-9-admin").on("click", "button.lockPage", function() {
            var overlay = $(this).closest(".lockdown").find(".overlay")
            overlay.find("input").val("");
            overlay.removeClass("d-none");
            var buttonRef = overlay.parent().attr("data-buttonRef");
            $(`${buttonRef}`).find("i.lock").removeClass("d-none");
            $.ajax({
               type: "POST",
               url:  `${idValue}/lockPage`,
               data: {
                 buttonRef: buttonRef,
                  // info: info, // < note use of 'this' here
               },
               success: function(result) {
               },
               error: function(result) {
                   alert('error');
               }
             });
      });

      $("#editBusinessHoursForm").bind('ajax:error', function() {
          $(this).find("#prices-failure").removeClass("d-none");
      });

      // this is code for getting the payment records of chosen dates.
      $("#payFeesBody").on("click", "#recordArrowControls i", function() {
          var recordDateHolder = $("#payFeesBody #recordDateBox");
          var nextDate = new Date(recordDateHolder.text());
          var lastPayDateHolder = $("#payFeesBody #lastPayDateHolder");
          var lastPayDate = new Date(lastPayDateHolder.attr("data-lastPayDate"));
          lastPayDate2 = new Date(lastPayDate.getFullYear(), lastPayDate.getMonth(), lastPayDate.getDate(), 0, 0, 0);
          //if (nextDate < myToday) {
            if ($(this).hasClass("add-icon")) {
                if ($(this).hasClass("day")) {
                    nextDate.setDate(nextDate.getDate() + 1);
                } else { //
                    nextDate.setMonth(nextDate.getMonth() + 1);
                }
            } else { // minus
                if ($(this).hasClass("day")) {
                    nextDate.setDate(nextDate.getDate() - 1);
                } else { //
                    nextDate.setMonth(nextDate.getMonth() - 1);
                }
            }
            var options = { day: 'numeric', month: 'long', year: 'numeric' };
            var formattedDate = nextDate.toLocaleDateString("en-AU", options);

            var todayDate = new Date();
            todayDate.setDate(todayDate.getDate()-1);
            var myPrevDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, 0, 0);

            var addIcons = $("#recordArrowControls i.add-icon");

            if (nextDate < myPrevDate) {
              addIcons.removeClass("color-gainsboro");
              recordDateHolder.text(formattedDate);
              $.ajax({
                 type: "GET",
                 url:  `/admin/sports_centres/${idValue}/getPastRecords`,
                 data: {
                   date: formattedDate,
                    // info: info, // < note use of 'this' here
                 },
                 success: function(result) {
                 },
                 error: function(result) {
                     alert('error');
                 }
               });
               console.log("nextDate", nextDate);
               console.log("lastPayDate", lastPayDate2);
               if (nextDate < lastPayDate2) {
                 lastPayDateHolder.removeClass("d-none");
               } else {
                 lastPayDateHolder.addClass("d-none");
               }
             } else {
               addIcons.addClass("color-gainsboro");
               recordDateHolder.text(myPrevDate.toLocaleDateString("en-AU", options));
               $.ajax({
                  type: "GET",
                  url:  `/admin/sports_centres/${idValue}/getPastRecords`,
                  data: {
                    date: myPrevDate.toLocaleDateString("en-AU", options),
                     // info: info, // < note use of 'this' here
                  },
                  success: function(result) {
                  },
                  error: function(result) {
                      alert('error');
                  }
                });
             }
            //} else {

            //}
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
