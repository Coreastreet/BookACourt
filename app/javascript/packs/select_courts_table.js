$(document).on('turbolinks:load', function() {
  //var $td = document.getElementsByTagName("td");
  /* l = td.length;
  for (i = 0; i < l; i++) {
    td[i].classList.add("table-active");
  }; */
  //var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  //console.log($('td'));
  var popUpBox = $("#col-9-admin .popUpBox");
  var relativeWidth = popUpBox.outerWidth()/2;
  var relativeHeight = popUpBox.outerHeight();
  localStorage.setItem("clickCounter", "0");
  localStorage.setItem("newBookings", "[]");
  var timeSetting = localStorage.getItem("12HRTimeSetting");
  var rowTimesFirst = $("#dashBoardTable tbody th.bookSpecial sup");
  var rowTimeFirst;
  var newTimeFirst;
  var newTimeArrFirst;
  if ( timeSetting == "on") {
      $(`#hourControl button[data-control='on']`).addClass("btn-clickedHR");
          rowTimesFirst.each( function() {
              rowTimeFirst = $(this).attr("data-timeRef");
              newTimeFirst = convertToAMPM(rowTimeFirst);
              $(this).attr("data-timeRef", newTimeFirst);
              newTimeArrFirst = newTimeFirst.split(":");
              $(this).children().first().text(newTimeArrFirst[0]);
              $(this).children().last().text(newTimeArrFirst[1].substr(2));
          });
  } else {
      $(`#hourControl button[data-control='off']`).addClass("btn-clickedHR");
  }
  var firstClick;
  $("#activityCardHolder .activityCard").each( function() {
      var sportOffered = $(this).attr("data-activity");
      var capSportOffered = sportOffered.charAt(0).toUpperCase() + sportOffered.substr(1);
      $("#col-9-admin datalist#sports").append($(`<option value=${capSportOffered}></option>`));
  });

  $(document).on("click", ".courts-table td:not(.booked)", function() {
    var currentClick = parseInt(localStorage.getItem("clickCounter"));
    if ($("#addRemoveBookings").hasClass("bg-black") && (currentClick < 2) && $("#dashBoardTable tbody div.name-and-sport.clone").length == 0) {
      if ($(this).hasClass("table-active")) {
        disableSelection($(this));
      } else {
        firstClick = $('#dashBoardTable tbody td.table-active.unconfirmed').not(this);
          if (firstClick.length != 0) {
            if (parseInt(firstClick.attr("data-court")) % 2 == 0) { // even column
                if ((parseInt($(this).attr('data-court')) - parseInt(firstClick.attr("data-court")) == 0)
                  && ( $(this).attr("data-time") >= firstClick.attr("data-time"))) {
                      enableSelection($(this));
                      localStorage.setItem("clickCounter", currentClick+1);
                      $(this).parent().next().children().first().removeClass("text-muted");
                } else {
                  return false; // when clicked above in even column.
                }
            } else { // odd column
                var diff = parseInt($(this).attr('data-court')) - parseInt(firstClick.attr("data-court"));
                if (( diff == 1 || diff == 0 )
                  && ( $(this).attr("data-time") >= firstClick.attr("data-time"))) {
                      enableSelection($(this));
                      localStorage.setItem("clickCounter", currentClick+1);
                      $(this).parent().next().children().first().removeClass("text-muted");
                } else {
                  return false; // when clicked above in odd column.
                }
            }
          } else {
            enableSelection($(this));
            localStorage.setItem("clickCounter", currentClick+1);
          }
      }
      if (currentClick+1 == 2) {
          //alert("inserted");
          console.log("topSelection", $("#dashBoardTable tbody td.unconfirmed"));
          var topSelection = $("#dashBoardTable tbody td.unconfirmed").eq(0);
          /* if (topSelection.length == 2) {
              topSelection = (topSelection.eq(0).attr("data-court") <= topSelection.eq(1).attr("data-court"))
              ? topSelection.eq(0) : topSelection.eq(1);
          } */
          //var topSelection = $("#dashBoardTable tbody td.unconfirmed").eq(0);
          var bottomSelection = $(this);//$("#dashBoardTable tbody td.unconfirmed").eq(1);
          var columnTop = parseInt($(topSelection).attr("data-court"));
          var columnBottom = parseInt($(bottomSelection).attr("data-court"));
          var courtType = "half_court";

          var startSelectionTime = topSelection.attr("data-time");
          var endSelectionTime = bottomSelection.attr("data-time");
          // on second click a full court is selected
          console.log("start and end Time", startSelectionTime, endSelectionTime);
          if ((columnTop % 2 == 1) && (columnBottom-columnTop == 1) && (endSelectionTime >= startSelectionTime)) {
                enableFullCourtSelection(topSelection, bottomSelection, columnTop); // adding grey squares to the full court booking
                courtType = "full_court";
          }
          //console.log("ts", topSelection);
          //console.log("bs", bottomSelection);
          insertAbsoluteDiv(topSelection, bottomSelection, courtType);// insert absolute name and sport type div
      }
    }
  });

  $("#hourControl").on("click", "button", function() {
        var control = $(this).attr("data-control");
        if ($(this).hasClass("btn-clickedHR")) {
            //$(this).removeClass("btn-clickedHR");
        } else {
            $(this).siblings().removeClass("btn-clickedHR");
            $(this).addClass("btn-clickedHR");
            var rowTimes = $("#dashBoardTable tbody th.bookSpecial sup");
            var rowTime;
            var newTime;
            var newTimeArr;
            if (control == "on") {
                rowTimes.each( function() {
                    rowTime = $(this).attr("data-timeRef");
                    newTime = convertToAMPM(rowTime);
                    $(this).attr("data-timeRef", newTime);
                    newTimeArr = newTime.split(":");
                    $(this).children().first().text(newTimeArr[0]);
                    $(this).children().last().text(newTimeArr[1].substr(2));
                });
                localStorage.setItem("12HRTimeSetting", "on");
            }
            if (control == "off") {
              rowTimes.each( function() {
                  rowTime = $(this).attr("data-timeRef");
                  newTime = convertAMPMToString(rowTime);
                  $(this).attr("data-timeRef", newTime);
                  newTimeArr = newTime.split(":");
                  $(this).children().first().text(newTimeArr[0]);
                  $(this).children().last().text(":" + newTimeArr[1]);
              });
              localStorage.setItem("12HRTimeSetting", "off");
            }
        }

  });

  $("#dashBoardTable tbody").on("click", "th.bookSpecial", function() {
          var firstClicked = $("#dashBoardTable tbody th.border-right-orange");
          var collectionTimes = $("#dashBoardTable tbody th.bookSpecial");
          var indexFirstClick;
          var indexSecondClick;
          var thBookSpecial;
          var holderIndex;
          var topLeft;
          var bottomRight;
          var popUpBox;
          var belowBottomRight;

          if (firstClicked.length == 0) { // no clicks
              $("#dashBoardTable tbody th.bookSpecial:not(.text-muted)").addClass("text-muted");
              //$(this).siblings().find("h3").addClass("text-muted");
              $(this).removeClass("text-muted").addClass("border-right-orange");
          } else { // clicked on other time first
              indexFirstClick = collectionTimes.index(firstClicked);
              indexSecondClick = collectionTimes.index($(this));
              if ((indexSecondClick >= indexFirstClick) && ($("#dashBoardTable tbody th.bookSpecial:not(.text-muted)").length == 1)) {
                  holderIndex = indexFirstClick;
                  collectionTimes.eq(holderIndex).removeClass("text-muted").addClass("border-right-orange");
                  while(holderIndex <= indexSecondClick) {
                      thBookSpecial = collectionTimes.eq(holderIndex);
                      thBookSpecial.addClass("border-right-orange");
                      thBookSpecial.parent().find("td").addClass("table-active");
                      holderIndex++;
                  }
                  collectionTimes.eq(holderIndex).removeClass("text-muted");
                  topLeft = firstClicked.next();
                  // add unconfirmed for later reference
                  $("#dashBoardTable tbody td.border-darkBlue").removeClass("border-darkBlue");
                  topLeft.addClass("unconfirmed border-darkBlue");
                  bottomRight = collectionTimes.eq(indexSecondClick).siblings().last();
                  bottomRight.addClass("unconfirmed");

                  belowBottomRight = collectionTimes.eq(holderIndex).siblings().last();
                  console.log("bottomRight", bottomRight);
                  fillInOriginalPopup("allCourt", topLeft.attr("data-time"), belowBottomRight.attr("data-time"), parseInt(topLeft.attr("data-court")), parseInt(bottomRight.attr("data-court")));
                  insertAbsoluteDiv(topLeft, bottomRight, "allCourt");

                  // some small adjustment to the pop up box for special event bookings
                  popUpBox = $("#dashBoardTable tbody div.name-and-sport.clone");
                  popUpBox.find(".nb-second-row input.sportTypeInput").val("Event");
                  popUpBox.find(".popUpBox > .nb-second-row").css("display", "none");
                  popUpBox.find(".nb-event-row").removeClass("d-none");
                  popUpBox.find(".courtCost").css("display", "none");
                  popUpBox.find("button.addNewBooking").text("Add event");
              } else {
                // do nothing
              }
          }
  });

  $("#col-9-admin").on("click", ".cancelNewBooking", function() {
      var courtType = $(this).closest(".clone").attr("data-bookingType");
      $(this).closest(".clone").remove();
      var start = $("#dashBoardTable tbody td.unconfirmed").eq(0);
      var end = ($("#dashBoardTable tbody td.unconfirmed").length > 1) ? $("#dashBoardTable tbody td.unconfirmed").eq(1) : $("#dashBoardTable tbody td.unconfirmed").eq(0);
      console.log("start and end", start, end);
      var startTime = start.attr("data-time");
      var endTime = end.attr("data-time");
      var intervalArray = getIntervalsInclusive(startTime, endTime);
      var unConfirmedCourtId = start.attr("data-court");
      var endCourtId = parseInt(unConfirmedCourtId)+1;
      if (courtType == "halfCourt") {
        for (var i in intervalArray) {
          $(`#dashBoardTable tbody td[data-time="${intervalArray[i]}"][data-court="${unConfirmedCourtId}"]`).removeClass("table-active unconfirmed");
        }
      } else if (courtType == "fullCourt") { // full court
        for (var i in intervalArray) {
          $(`#dashBoardTable tbody td[data-time="${intervalArray[i]}"][data-court="${unConfirmedCourtId}"]`).removeClass("table-active unconfirmed");
        }
        //console.log(endCourtId);
        for (var i in intervalArray) {
          $(`#dashBoardTable tbody td[data-time="${intervalArray[i]}"][data-court="${endCourtId}"]`).removeClass("table-active unconfirmed");
        }
      } else { // all court case
        for (var i in intervalArray) {
          $(`#dashBoardTable tbody td[data-time="${intervalArray[i]}"]`).removeClass("table-active unconfirmed");
        }
        var topLeft = $(`#dashBoardTable tbody td[data-time="${intervalArray[0]}"]`);
        $("#dashBoardTable tbody th").not(topLeft.prev()).removeClass("border-right-orange").addClass("text-muted");
        topLeft.prev().removeClass("border-right-orange");
      }
      $(`#dashBoardTable tbody td[data-time='${endTime}']`).first().parent().next().children().first().addClass("text-muted");
      localStorage.setItem("clickCounter", "0");
      Mousetrap.unbind('ctrl+right');
      Mousetrap.unbind('ctrl+left');

      // remove all traees of borders
      $("#dashBoardTable tbody td.border-darkBlue").removeClass("border-darkBlue border-bottom-0 border-top-0 border-left-0 border-right-0");
      $("#dashBoardTable tbody td.border-x-darkBlue").removeClass("border-x-darkBlue");
      start.removeClass("border-right-0 border-bottom-0 border-left-0 border-top-0").addClass("border-darkBlue");
  });

  $("#col-9-admin").on("click", ".addNewBooking", function() {
      var dateChosen = new Date($("#my_hidden_input").val());
      var formattedToday = dateChosen.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
      replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
      var newBookings = JSON.parse(localStorage.getItem("newBookings"));
      var preBookedId = parseInt(localStorage.getItem("preBookingsMade"));
      //var count = Object.keys(newBookings).length;
      var box = $(this).closest(".name-and-sport");
      var name = box.find(".nameInput").val();
      var sportType = box.find(".sportTypeInput").val() + "::" + box.find(".eventTypeInput").val();
      var sportMainType = sportType.split("::")[0];
      sportMainType = sportMainType.charAt(0).toUpperCase() + sportMainType.substr(1);
      var totalCost = box.attr("data-totalCost");
      var courtType = box.attr("data-bookingType");

      var startTime = box.attr("data-startTime");
      var endTime = box.attr("data-endTime");

      var sportsCentreId = parseInt($("#id-holder").attr("data-sports-centre-id"));
      var newBooking = { booking: {court_no: box.attr("data-courtNo"), startTime: startTime,
      endTime: endTime, courtType: courtType, date: formattedToday,
      sports_centre_id: sportsCentreId, bookingType: "casual", sportsType: sportType, name: name }, order: {fullName: name,
      totalCost: totalCost, adminEntry: true, startDate: formattedToday,
      endDate: formattedToday, daysInBetween: 0 }, preBookingId: preBookedId};
      newBookings.push(newBooking);
      localStorage.setItem("newBookings", JSON.stringify(newBookings));
      $(this).closest(".clone").remove();
      // replace td selected with table-color
      var tdCounter = 0;
      var rowLength = $(`#dashBoardTable tbody td[data-time='${endTime}']`).first().parent().index() - $(`#dashBoardTable tbody td[data-time='${startTime}']`).first().parent().index();
      var courtWidthHash = { "halfCourt": 1, "fullCourt":2, "allCourt": $("#dashBoardTable thead th.equalTH").length };
      var numberOfBookingsFilled = rowLength * courtWidthHash[`${courtType}`];
      console.log(numberOfBookingsFilled);
      $("#dashBoardTable tbody td.border-darkBlue").removeClass("border-darkBlue");
      $("#dashBoardTable tbody td.table-active").each( function() {
          $(this).removeClass("unconfirmed table-active border-bottom-0 border-top-0 border-left-0 border-right-0 border-darkBlue");
          $(this).addClass(`table${sportMainType} booked`);
          if (tdCounter == 0) {
            $(this).addClass("border-darkBlue");
            if (sportType.toLowerCase().startsWith("event")) {
                var sportInfoType = sportType.split("::")[1];
                $(this).html(`<div>${sportInfoType}</div>`);
            } else {
                $(this).html(`<div>${sportMainType}</div>`);
            }
            $(this).addClass("textHolder");
          }
          if (tdCounter == (numberOfBookingsFilled - 1)) {
            $(this).append(`<div class="ml-auto">${name}</div>`);
            $(this).addClass("textHolder");
            //console.log("appended", $(this));
            $(this).parent().next().children().first().addClass("text-muted");
          }
          if ((tdCounter == 0 && courtType == "halfCourt") || (tdCounter == 1 && courtType == "fullCourt")) {
            $(this).append("<div class='delete-presaved-booking ml-auto'>&times</div>");
          }

          //$(this).attr("data-toggle", "tooltip");
          //$(this).attr("title", `${name}\nType: ${sportMainType}\nStart: ${ convertToAMPM(box.attr("data-startTime")) }\nEnd: ${ convertToAMPM(box.attr("data-endTime")) }`);
          $(this).attr("data-preBookedId", preBookedId);
          tdCounter++;
      });
      localStorage.setItem("clickCounter", "0");
      localStorage.setItem("preBookingsMade", preBookedId+1)

      // remove the right border of orange color.
      if (courtType == "allCourt") {
            var allCourtTimesSelected = $("#dashBoardTable th.border-right-orange");
            var sportInfoType = sportType.split("::")[1];
            //console.log(allCourtTimesSelected);
            $(this).attr("title", $(this).attr("title") + `\nEvent: ${sportInfoType}`);

            allCourtTimesSelected.first().siblings().last().append("<div class='delete-presaved-booking ml-auto'>&times</div>").addClass("textHolder");
            allCourtTimesSelected.each(function() {
                $(this).removeClass("border-right-orange");
                $(this).addClass("text-muted");
            });
            var nextTimeHeader = allCourtTimesSelected.last().parent().next().children().first();
            nextTimeHeader.removeClass("border-right-orange");
            nextTimeHeader.addClass("text-muted");
      }
  });

  function convertToAMPM(timeString) {
    var hours_and_minutes = timeString.split(":");
    var parsed_int = parseInt(hours_and_minutes[0]);
    var int = (parsed_int % 12 == 0) ? 12 : parsed_int % 12;
    var am_or_pm = (hours_and_minutes[0] >= 12) ? "PM" : "AM";
    return `${int}:${hours_and_minutes[1]}${am_or_pm}`
  }


  $("#col-9-admin").on("click", "#newBookingsSave", function() {
      var sports_centre_id = $("#id-holder").attr("data-sports-centre-id");
      $.ajax({
        type: "POST",
        url: `${sports_centre_id}/addNewBookings`,
        data: {
          arrOrderAndBookings: JSON.parse(localStorage.getItem("newBookings"))
        },
        success: function(result) {
            alert("new bookings posted");
        },
        failure: function(result) {
        },
        //dataType: "json"
      })
  });

  $("#ViewAndBookBody").on("click", "#removeUnconfirmed", function() {
      var cells = $("#dashBoardTable tbody td.table-active");
      cells.removeClass("unconfirmed table-active border-right-0 border-left-0 border-x-darkBlue border-top-0 border-bottom-0 border-darkBlue");
      $("#dashBoardTable .clone.name-and-sport").remove();
      $("#dashBoardTable tbody th.border-right-orange").removeClass("border-right-orange");
      $("#dashBoardTable tbody th:not(.text-muted)").addClass("text-muted");
      //$("#dashBoardTable tbody td.border-darkBlue").removeClass("border-darkBlue");

      cells.first().addClass("border-darkBlue");
      cells.first().siblings().first().removeClass("text-muted");
      localStorage.setItem("clickCounter", 0);
  });

  $("#col-9-admin").on("click", ".delete-booking", function(e) {
    var sports_centre_id = $("#id-holder").attr("data-sports-centre-id");
    var answer;
    var bookingId = $(this).attr("data-booking-id");
    if (e.ctrlKey) {
        answer = window.confirm("Delete this Order?")
        if (answer) {
            var orderID = $(this).attr("data-order-id");
            $.ajax({
              type: "POST",
              url: `${sports_centre_id}/deleteOrder`,
              data: {
                order_id: orderID,
              },
              success: function(result) {
                  alert("Order Deleted");
              },
              failure: function(result) {
              },
              //dataType: "json"
            })
            $(this).remove();
            $(`#dashBoardTable td[data-booking-id="${bookingId}"]`).each( function(index) {
                  if (index == (0 || 1)) {
                    console.log(this);
                    $(this).children().remove();
                  }
                  $(this).removeClass("booked textHolder");
                  $(this).removeAttr("data-booking-id data-toggle title");
                  removeClassByPrefix($(this)[0], "table");
            });
        }
    } else {
        answer = window.confirm("Delete this Booking?")
        if (answer) {
            var bookingID = $(this).attr("data-booking-id");
            $.ajax({
              type: "POST",
              url: `${sports_centre_id}/deleteBooking`,
              data: {
                booking_id: bookingID,
              },
              success: function(result) {
                  alert("Booking Deleted");
              },
              failure: function(result) {
              },
              //dataType: "json"
            })
            $(this).remove();
            var allBookingCells = $(`#dashBoardTable td[data-booking-id="${bookingId}"]`);
            allBookingCells.each( function(index) {
                  if ((index == 0) || (index == 1) || (index == (allBookingCells.length-1))) {
                    $(this).children().remove();
                  }
                  $(this).removeClass("booked textHolder");
                  $(this).removeAttr("data-booking-id data-toggle title");
                  removeClassByPrefix($(this)[0], "table");
            });
        }
    }
  });

  $("#col-9-admin").on('click', "#pinNameHolder", function() {
      var matchedBooking = $(this).attr("data-booking-id");
      var chosenBooking = $(`#dashBoardTable td.textHolder[data-booking-id=${matchedBooking}]:first`);
      if (chosenBooking) {
          $("#dashBoardTable td.border-darkBlue").removeClass("border-darkBlue");
          //realChosenBooking = (chosenBooking.length == 1) ? chosenBooking : chosenBooking.first();
          //console.log(chosenBooking);
          var tdHeight = $("#dashBoardTable td:first").outerHeight();
          var tdIndex = chosenBooking.parent().index();
          console.log("tdIndex", tdIndex);

          $("tbody.dashBoardHeight").animate({scrollTop: (tdHeight*tdIndex)});
          chosenBooking.addClass("border-darkBlue");
      }
  });

  $("#col-9-admin").on('click', "#sports_centre_booking_pin", function() {
        $(this).removeClass("is-invalid");
        $(this).removeClass("is-valid");
        $(this).val("");
  });

  $("#col-9-admin").on("click", ".delete-presaved-booking", function() {
        //var bookingID = $(this).attr("data-booking-id");
        $("#dashBoardTable tbody td.border-darkBlue").removeClass("border-darkBlue");
        $("#dashBoardTable tbody th:not(.text-muted)").addClass("text-muted");
        var preBooking = $(this).parent();
        var preBookingId = preBooking.attr("data-preBookedId");
        preBooking.empty();

        var textHolder = $(`#dashBoardTable td[data-preBookedId="${preBookingId}"].textHolder`);
        //textHolder.last().parent().next().children().first().removeClass("h3").addClass("text-muted h4");
        textHolder.empty();
        textHolder.removeClass("textHolder");
        // check for event type booking to delete text.
        // remove borders
        $(`#dashBoardTable td[data-preBookedId="${preBookingId}"]`).each( function() {
              $(this).removeClass("booked border-darkBlue border-left-0 border-right-0 border-top-0 border-bottom-0 border-x-darkBlue");
              $(this).removeAttr("data-preBookedId");
              $(this).removeAttr("data-toggle");
              $(this).removeAttr("title");
              removeClassByPrefix($(this)[0], "table");
        });
        textHolder.first().addClass("border-darkBlue");
        textHolder.first().siblings().first().removeClass("text-muted");
        var newBookings = JSON.parse(localStorage.getItem("newBookings"));
        var newArray = newBookings.filter((el) => el.preBookingId == preBookingId );
        var index = newBookings.indexOf(newArray[0]);
        if (index !== -1) {
          newBookings.splice(index, 1);
        }
        localStorage.setItem("newBookings", JSON.stringify(newBookings));
  });

  $("#dashBoardTable").on("click", ".nb-intervalButton", function() {
      $(this).addClass("button-selected");
      var buttonGroup = $(this).parent();
      var secondIntervalRow = $(this).closest(".nb-second-row");
      var clone = $(this).clone();
      buttonGroup.addClass("d-none");
      secondIntervalRow.find(".nb-intervalInput").removeClass("d-none");
      secondIntervalRow.find(".input-group-append").append(clone);
  });
  $("#dashBoardTable").on("click", ".addNewRegularBooking", function() {
      var box = $(this).closest(".clone");
      var datesChosen = JSON.parse(box.attr("data-reg-dates")); // array
      var sportsCentreId = parseInt($("#id-holder").attr("data-sports-centre-id"));
      var name = box.find(".nameInput").val();
      var preBookedId = parseInt(localStorage.getItem("preBookingsMade"));
      //var sportType = box.find(".sportTypeInput").val();
      var sportType = box.find(".sportTypeInput").val() + "::" + box.find(".eventTypeInput").val();
      var sportMainType = sportType.split("::")[0];
      sportMainType = sportMainType.charAt(0).toUpperCase() + sportMainType.substr(1);

      var courtType = box.attr("data-bookingType");
      var startTime = box.attr("data-startTime");
      var endTime = box.attr("data-endTime");

      // get number of courts for allCourts
      var bookingsLength = $("#dashBoardTable thead th.equalTH").length;
      var hashCourtTypes = { "halfCourt": 1, "fullCourt": 2, "allCourt": bookingsLength };

      var numberOfRows = getIntervals(startTime, endTime).length;
      var totalCells = hashCourtTypes[courtType] * numberOfRows;
      console.log("totalCells", totalCells);

      var newBookings = JSON.parse(localStorage.getItem("newBookings"));
      var newBooking = { booking: {court_no: box.attr("data-courtNo"), startTime: startTime,
      endTime: endTime, courtType: courtType, date: datesChosen,
      sports_centre_id: sportsCentreId, bookingType: "regular", sportsType: sportType,
      name: name }, order: {fullName: name, totalCost: box.attr("data-reg-totalCost"), adminEntry: true, startDate: datesChosen[0],
      endDate: datesChosen[datesChosen.length-1], daysInBetween: box.attr("data-reg-interval-days") }, preBookingId: preBookedId};
      newBookings.push(newBooking);
      localStorage.setItem("newBookings", JSON.stringify(newBookings));
      box.remove();
      // replace td selected with table-color
      var tdCounter = 0;
      $("#dashBoardTable tbody td.table-active").each( function() {
          if (tdCounter == 0) {
            //$(this).addClass("border-darkBlue");
            if (sportType.toLowerCase().startsWith("event")) {
                var sportInfoType = sportType.split("::")[1];
                $(this).html(`<div><i class="fas fa-redo pr-2"></i>${sportInfoType}</div>`);
                //$(this).html(`<div>${sportInfoType}</div>`);
            } else {
                $(this).html(`<div>${sportMainType}</div>`);
            }
            $(this).addClass("textHolder");
          }
          //console.log("length", bookingsLength);
          //console.log("counter", tdCounter);
          if ((tdCounter == 0 && courtType == "halfCourt") || (tdCounter == 1 && courtType == "fullCourt")
            || (tdCounter == (bookingsLength - 1) && courtType == "allCourt")) {
            $(this).append("<div class='ml-auto delete-presaved-booking'>&times</div>");
            $(this).addClass("textHolder");
          }
          if (tdCounter == (totalCells - 1)) {
            $(this).append(`<div>${name}</div>`);
            $(this).addClass("textHolder");
          }
          $(this).removeClass("unconfirmed table-active");
          $(this).addClass(`table${sportMainType} booked`);
          $(this).attr("data-preBookedId", preBookedId);
          tdCounter++;
      });
      $("#dashBoardTable tbody th.border-right-orange").removeClass("border-right-orange");
      localStorage.setItem("clickCounter", "0");
      localStorage.setItem("preBookingsMade", preBookedId+1)
  });


  $("#dashBoardTable").on("input", "input.nb-intervalInput", function() {
      var repeatDetailCard = $(this).closest(".repeatDetail");
      var frequencyType = repeatDetailCard.find("button.button-selected").attr("data-frequency-type");
      var typeMultiple = (frequencyType == "Days") ? 1 : 7;
      var interval = typeMultiple * parseInt($(this).val());
      var startDate = repeatDetailCard.find(".nb-startDate").attr("data-startDate-reg");

      var startDateObj = new Date(startDate);
      var no_of_bookings = repeatDetailCard.find(".nb-numberInput").val();

      var popUp = $("#dashBoardTable .name-and-sport.clone");
      var startTime = popUp.attr("data-startTime");
      var endTime = popUp.attr("data-endTime");
      var courtType = popUp.attr("data-bookingType");

      popUp.attr("data-reg-startDate", startDate);
      popUp.attr("data-reg-interval-days", interval);
      //popUp.attr("data-reg-noob", no_of_bookings);

      var currentDateHolder = startDateObj;
      var total = 0;
      var arrayDates = []
      var singleBookingCost;
      while (no_of_bookings > 0) {
          arrayDates.push(currentDateHolder.toLocaleDateString("en-AU"));
          singleBookingCost = calculateSingleBookingCost(startTime, endTime, currentDateHolder.getDay(), courtType);
          total += singleBookingCost;
          currentDateHolder.setDate(currentDateHolder.getDate() + interval);
          no_of_bookings--;
      }
      var totalCost = total.toFixed(2);
      repeatDetailCard.find(".courtRegularCost").text(`$${totalCost}`);
      popUp.attr("data-reg-totalCost", totalCost);
      popUp.attr("data-reg-dates", JSON.stringify(arrayDates));
  });

  function removeClassByPrefix(node, prefix) {
  	var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
  	node.className = node.className.replace(regx, '');
  	return node;
  }

  // convert a decimal into a string time
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

  function getIntervalsInclusive(start, end) {
    var startBookingTime = parseFloat(start.replace(":3", ".5"));
    var endBookingTime = parseFloat(end.replace(":3", ".5"));
    arrayIntervals = [];
    var stringTime;
    while (startBookingTime != endBookingTime) {
      stringTime = convertTimeIntoString(startBookingTime);
      arrayIntervals.push(stringTime);
      startBookingTime += 0.5;
    }
    arrayIntervals.push(end);
    return arrayIntervals;
  }


  function getIntervals(start, end) {
    var startBookingTime = parseFloat(start.replace(":3", ".5"));
    var endBookingTime = parseFloat(end.replace(":3", ".5"));
    arrayIntervals = [];
    var stringTime;
    while (startBookingTime != endBookingTime) {
      stringTime = convertTimeIntoString(startBookingTime);
      arrayIntervals.push(stringTime);
      startBookingTime += 0.5;
    }
    return arrayIntervals;
  }
  function enableFullCourtSelection(selectedTopLeftCorner, selectedBottomRightCorner, firstColumnNumber) {
      var startTime = selectedTopLeftCorner.attr("data-time");
      var endTime = selectedBottomRightCorner.attr("data-time");
      var arr = getIntervalsInclusive(startTime, endTime);
      var secondColumnNumber = firstColumnNumber + 1;
      var column = ("td[data-court=" + secondColumnNumber + "]");
      var realEndTime = ($(column).eq($(column).index(selectedBottomRightCorner)+1)).attr("data-time");
      //console.log(realEndTime);
      for (var i in arr) {
        $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${firstColumnNumber}"]`).addClass("table-active");
        // border-darkBlue, leave bottom border on last cell
        //if (i != (0 || (arr.length-1))) {
        $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${firstColumnNumber}"]`).addClass("border-darkBlue border-right-0 border-bottom-0 border-top-0");
        //} else {
        if (i == 0) {
            $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${firstColumnNumber}"]`).removeClass("border-top-0");
        }
        if (i == (arr.length-1)) {
            $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${firstColumnNumber}"]`).removeClass("border-bottom-0");
        }
      }
      for (var i in arr) {
        $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${secondColumnNumber}"]`).addClass("table-active");
        // border-darkBlue
        $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${secondColumnNumber}"]`).addClass("border-darkBlue border-left-0 border-bottom-0 border-top-0");

        if (i == 0) {
            $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${secondColumnNumber}"]`).removeClass("border-top-0");
        }
        if (i == (arr.length-1)) {
            $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${secondColumnNumber}"]`).removeClass("border-bottom-0");
        }
      }
      fillInOriginalPopup("fullCourt", startTime, realEndTime, firstColumnNumber, secondColumnNumber);
  }
  //td.addClass('table-active');

  function enableSelection(selectedCell) {
    $("#dashBoardTable tbody td.border-darkBlue:not(.unconfirmed)").removeClass("border-darkBlue");
    // add the time font change.
    if (parseInt(localStorage.getItem("clickCounter")) == 0) {
        $("#dashBoardTable tbody th:not(.text-muted)").addClass("text-muted");
        selectedCell.parent().children().first().removeClass("text-muted");
    }

    selectedCell.addClass('table-active unconfirmed border-darkBlue');
    var holder = selectedCell;
    var court = selectedCell.data('court');
    var column = ("td[data-court=" + court + "]");
    var counter = 0;
    var opening_index = 0;
    $(column).each( function(index) {
      if ($(column).eq(index).hasClass( "table-active" )) {
        counter++;

        var end_index = $(column).index(holder);
        var start_index = index + 1;

        // save the starting time
        if (counter == 1) {
          opening_index = index.valueOf();
        }
        // code for logging the opening_times
        var starting_time = $(column).eq(opening_index).data('time');
        //console.log(opening_index);
        var ending_time = $(column).eq(end_index+1).data('time');
        //var courtHolder = '#court-no-' + court;
        //console.log(courtHolder);
        /* var original = $("#col-9-admin .name-and-sport");
        original.attr("data-bookingType", "halfCourt");
        original.attr("data-courtNo", court);
        original.attr("data-startTime", starting_time);
        original.attr("data-endTime", ending_time);

        var popUp = $("#col-9-admin .half-court-new-booking");
        popUp.find(".courtNumber").text(`Court ${court}:`);
        popUp.find(".courtTime").text(`${starting_time}-${ending_time}`); */
        fillInOriginalPopup("halfCourt", starting_time, ending_time, court);
        //console.log("st", starting_time);
        //console.log("et", ending_time);
        //$("#half-court-new-booking").find(".nb-start-time input").val(starting_time);
        //$("#half-court-new-booking").find(".nb-end-time input").val(ending_time);

        while (end_index > start_index) {
          $(column).eq(start_index).addClass("table-active border-x-darkBlue");
          start_index++;
        }
        if (opening_index != end_index) {
          $(column).eq(opening_index).addClass("border-darkBlue border-bottom-0");
          $(column).eq(end_index).addClass("border-top-0");
        }
      }
    });
  }

  function fillInOriginalPopup(courtType, start, realEnd, startColumn, endColumn) {
      var popUp = $("#col-9-admin .half-court-new-booking");
      var popUpText = (endColumn !== undefined) // check if end column present.
        ? `Court ${startColumn} - ${endColumn}:` : `Court ${startColumn}:`

      popUp.find(".courtNumber").text(popUpText);
      popUp.find(".courtTime").text(`${start}-${realEnd}`);

      var original = $("#col-9-admin .name-and-sport");
      original.attr("data-bookingType", courtType);
      original.attr("data-courtNo", startColumn);
      original.attr("data-startTime", start);
      original.attr("data-endTime", realEnd);
  }

  function disableSelection(selectedCell) {
      var holder = selectedCell;
      var court = selectedCell.data('court');
      var column = ("[data-court=" + court + "]");
      var selectedColumn = ('.table-active' + column);
      var selectedColumnFirstIndex = $(column).index($(selectedColumn).eq(0));
      var selectedColumnLastIndex = $(column).index($(selectedColumn).eq(-1));
      var holderIndex = $(column).index(selectedCell);
      var difference1 = Math.abs(holderIndex - selectedColumnFirstIndex);
      var difference2 = Math.abs(selectedColumnLastIndex - holderIndex);
      var difference = (difference1 > difference2) ? difference2 : difference1;
      var counter = 0;
      while (difference > 0) {
        // if selectedCell is closer to the end time
        if (difference1 > difference2) {
          $(column).eq(selectedColumnLastIndex - counter).removeClass('table-active');
        } else { // if selectedCell is closer to the start time
          $(column).eq(selectedColumnFirstIndex + counter).removeClass('table-active');
        }
        counter++;
        difference--;
      }
      var new_column = (".table-active" + column);
      // code for logging the closing_times
      var starting_time = $(new_column).eq(0).data('time');
      var last_cell = $(new_column).eq(-1);
      var position_of_last_cell = $(column).index(last_cell);
      var ending_time = $(column).eq(position_of_last_cell + 1).data('time');
      var courtHolder = '#court-no-' + court;
      //console.log($(dayHolder));
      $(courtHolder).text( "Court no." + court + ": " + starting_time + "-" + ending_time);
    //selectedCell.removeClass('table-active');
  };

  function insertAbsoluteDiv(topTD, bottomTD, courtType) {
      console.log("top", topTD);
      console.log("bottomTd", bottomTD);
      var topPosition = topTD.position();
      console.log("topPosition", topPosition);
      var bottomPosition = bottomTD.position();
      var dashBoardPosition = $("#dashBoardTable").position().top;
      var halfway = (topPosition.top + bottomPosition.top)/2;
      var clone = $("#col-9-admin .name-and-sport").clone();
      clone.addClass("clone");
      var down = false;

      if (topPosition.top < 100) {
        clone.children().first().addClass("triangle-up");
        down = true;
      }
      var cloneTopHeight = (down) ? (bottomPosition.top + dashBoardPosition + 52) : (topPosition.top - dashBoardPosition - 115);
      clone.removeClass("d-none");
      if (courtType == "half_court") {
          if (topPosition.left == bottomPosition.left) {
            //non adjacent courts blocked here
            if (topTD.is(":last-child")) {
              $("#dashBoardTable tbody").append(clone.css({top: cloneTopHeight, right: 10, position: "absolute"}));
              var cloneWidth = clone.outerWidth()/2;
              var cloneHeight = (down) ? -20 : clone.outerHeight();
              $("#col-9-admin .triangle").eq(1).css({top: cloneHeight, left: cloneWidth + 100});
            } else {
              var admin_panel_width = $(".admin-panel").width()/2;
              $("#dashBoardTable tbody").append(clone.css({top: cloneTopHeight, left: (topPosition.left - admin_panel_width), position: "absolute"}));
              var cloneWidth = clone.outerWidth()/2;
              var cloneHeight = (down) ? -20 : clone.outerHeight();
              $("#col-9-admin .triangle").eq(1).css({left: cloneWidth, top: cloneHeight});
            }
            clone.find(".nameInput").trigger("focus");
            //console.log(clone.find("#nameInput"));
          }
      } else { // fult court two courts adjacent; has been checked already. // also includes the special event case.
          if (topTD.is(":last-child")) {
            $("#dashBoardTable tbody").append(clone.css({top: cloneTopHeight, right: 10, position: "absolute"}));
            var cloneWidth = clone.outerWidth()/2;
            var cloneHeight = (down) ? -20 : clone.outerHeight();
            $("#col-9-admin .triangle").eq(1).css({top: cloneHeight, left: cloneWidth + 100});
          } else {
            var admin_panel_width = $(".admin-panel").width()/2;
            $("#dashBoardTable tbody").append(clone.css({top: cloneTopHeight, left: (topPosition.left - admin_panel_width), position: "absolute"}));
            var cloneWidth = clone.outerWidth()/2;
            var cloneHeight = (down) ? -20 : clone.outerHeight();
            $("#col-9-admin .triangle").eq(1).css({left: cloneWidth, top: cloneHeight});
          }
          //clone.attr("data-courtNo", topTD.attr("data-court"));
          clone.find(".nameInput").trigger("focus");
      }
      // add the repeat detail slider for admin
      var popUpBox = clone.find(".popUpBox");
      popUpBox.width(popUpBox.width());
      popUpBox.height(popUpBox.height());
      var repeatDetailClone = popUpBox.find(".repeatDetail");
      repeatDetailClone.removeClass("d-none");
      //popUpBox.append(repeatDetailClone);
      // edit the repeat detail to show different inputs
      $(clone).on("input", ".sportTypeInput, .nameInput", function() {
          var sportType = clone.find(".sportTypeInput").val();
          //console.log(sportType);
          var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          var sportCard = $(`#activityCardHolder .activityCard[data-activity='${sportType.toLowerCase()}']`);
          if (sportCard.length) {
              //var parentClone = $(this).closest(".clone");
              var price_code;
              var fullArr = getIntervals(clone.attr("data-startTime"), clone.attr("data-endTime"));
              var weekDay = new Date(parseInt($("#datepicker td.active.day").attr("data-date")));
              //console.log("index", weekDay.getDay());
              var dayButton = $(`#weekdaysButtonRow2 button[data-day=${weekDays[weekDay.getDay()]}]`);
              //console.log(dayButton);
              var startPeak = convertAMPMToString(dayButton.attr("data-peakHourStart"));
              var endPeak = convertAMPMToString(dayButton.attr("data-peakHourEnd"));
              //console.log("sp", startPeak);
              //console.log("ep", endPeak);
              var total = 0;
              for (var time in fullArr) {
                  price_code = (clone.attr("data-bookingType") == "halfCourt") ? "-hc" : "-fc";
                  //console.log(fullArr[time]);
                  if (fullArr[time] >= startPeak && fullArr[time] < endPeak) {
                      price_code += "-p";
                  } else {
                      price_code += "-op";
                  }
                  total += (parseFloat(sportCard.attr(`data${price_code}`))/2);
                //console.log("pc", price_code);
                // check whether time is within the peak hour zone or outside.
              }
              //if (sportType.toLowerCase() != "event") {
          }

          var arrSports = [];
          var sportsDatalist = $("datalist#sports").first().children();
          sportsDatalist.each( (index) => arrSports.push(sportsDatalist[index].value) );
          var secondRow = clone.find(".nb-second-row");
          var eventRow = clone.find(".nb-event-row");
          //console.log("sports Array", arrSports);
          var sportType = sportType.charAt(0).toUpperCase() + sportType.substr(1);
          if (arrSports.includes(sportType) && (clone.find("input.nameInput").val().length > 0)) {
            if (sportType.toLowerCase() == "event" && secondRow.css("display") != "none") { // not an allCourt booking
                secondRow.find(".sportTypeInput").removeClass("col-12").addClass("col-6");
                secondRow.find(".input-group-append").removeClass("d-none");
            } else {
                clone.find(".courtCost").text(`$${total.toFixed(2)}`);
                clone.attr("data-totalCost", total.toFixed(2));
            }
            console.log("arr Sports", arrSports);
            $(this).addClass("mousetrap");
            Mousetrap.bind('ctrl+right', function() {
              var currentDate = $('#datepicker').datepicker('getFormattedDate');
              var currentDateObj = new Date(currentDate);
              repeatDetailClone.css("left", "-6%");
              repeatDetailClone.find(".nb-startDate").attr("data-startDate-Reg", currentDate);
              repeatDetailClone.find(".nb-startDate").text(currentDateObj.toLocaleDateString("en-AU", {weekday: "short", day:"numeric", month:"short"}));
            });
            Mousetrap.bind('ctrl+left', function() { $("#dashBoardTable .repeatDetail").css("left", "106%") });
          } else {
            clone.find(".courtCost").empty();
            secondRow.find(".sportTypeInput").removeClass("col-6").addClass("col-12");
            secondRow.find(".input-group-append").addClass("d-none");
            $(this).removeClass("mousetrap");
            Mousetrap.unbind('ctrl+right');
            Mousetrap.unbind('ctrl+left');
          }
      });

      $(clone).on("click", ".nb-event-info", function() {
          var secondRow = $(this).closest(".nb-second-row")
          secondRow.addClass("d-none");
          secondRow.next().removeClass("d-none");
      });
  }

  // taking into account the peak and off peak rates while in the admin dashboard
  function calculateSingleBookingCost(startTime, endTime, weekday, courtType) { // where start and end are 24hour format
    var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var fullArr = getIntervals(startTime, endTime);
    //var weekDay = new Date(parseInt($("#datepicker td.active.day").attr("data-date")));
    //console.log("index", weekDay.getDay());
    var dayButton = $(`#weekdaysButtonRow2 button[data-day=${weekDays[weekday]}]`);
    //console.log(dayButton);
    var startPeak = convertAMPMToString(dayButton.attr("data-peakHourStart"));
    var endPeak = convertAMPMToString(dayButton.attr("data-peakHourEnd"));
    //console.log("sp", startPeak);
    //console.log("ep", endPeak);
    var total = 0;
    var sportCard = $(`#activityCardHolder .activityCard[data-activity='${$("#dashBoardTable .clone input.sportTypeInput").val().toLowerCase()}']`);
    for (var time in fullArr) {
        price_code = (courtType == "halfCourt") ? "-hc" : "-fc";
        //console.log(fullArr[time]);
        if (fullArr[time] >= startPeak && fullArr[time] < endPeak) {
            price_code += "-p";
        } else {
            price_code += "-op";
        }
        total += (parseFloat(sportCard.attr(`data${price_code}`))/2);
      //console.log("pc", price_code);
      // check whether time is within the peak hour zone or outside.
    }
    return total;
  }

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
});
