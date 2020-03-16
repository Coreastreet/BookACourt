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
  var firstClick;
  $("#activityCardHolder .activityCard").each( function() {
      var sportOffered = $(this).attr("data-activity");
      var capSportOffered = sportOffered.charAt(0).toUpperCase() + sportOffered.substr(1);
      $("#col-9-admin datalist#sports").append($(`<option value=${capSportOffered}></option>`));
  });

  $(document).on("click", ".courts-table td:not(.booked)", function() {
    var currentClick = parseInt(localStorage.getItem("clickCounter"));
    if ($("#addRemoveBookings").hasClass("bg-black") && (currentClick < 2)) {
      if ($(this).hasClass("table-active")) {
        disableSelection($(this));
      } else {
        firstClick = $('#dashBoardTable tbody td.table-active.unconfirmed');
          if (firstClick.length != 0) {
            if (parseInt(firstClick.attr("data-court")) % 2 == 0) { // even column
                if (parseInt($(this).attr('data-court')) - parseInt(firstClick.attr("data-court")) == 0) {
                  enableSelection($(this));
                  localStorage.setItem("clickCounter", currentClick+1);
                }
            } else { // odd column
                var diff = parseInt($(this).attr('data-court')) - parseInt(firstClick.attr("data-court"));
                if ( diff == 1 || diff == 0 ) {
                  enableSelection($(this));
                  localStorage.setItem("clickCounter", currentClick+1);
                }
            }
          } else {
            enableSelection($(this));
            localStorage.setItem("clickCounter", currentClick+1);
          }
      }
      if (currentClick+1 == 2) {
          var topSelection = $("#dashBoardTable tbody td.unconfirmed").eq(0);
          var bottomSelection = $(this);//$("#dashBoardTable tbody td.unconfirmed").eq(1);
          var columnTop = parseInt($(topSelection).attr("data-court"));
          var columnBottom = parseInt($(bottomSelection).attr("data-court"));
          var courtType = "half_court";
          // on second click a full court is selected
          if ((columnTop % 2 == 1) && (columnBottom-columnTop == 1)) {
                enableFullCourtSelection(topSelection, bottomSelection, columnTop); // adding grey squares to the full court booking
                courtType = "full_court";
          }
          //console.log("ts", topSelection);
          //console.log("bs", bottomSelection);
          insertAbsoluteDiv(topSelection, bottomSelection, courtType);// insert absolute name and sport type div
      }
    }
  });
/*
  $("#dashBoardTable").on("click", "i.fa-redo", function() {
      var topSelection = $(this).parent();
      var preBookingId = topSelection.attr("data-preBookedId");
      var bottomSelection = $(`#dashBoardTable td[data-preBookedId="${preBookingId}"]`).last();

      var selectedPreBookings = JSON.parse(localStorage.getItem("newBookings"));
      var selectedB = selectedPreBookings.filter((preBooking) => preBooking.preBookingId == preBookingId)
      var courtType = selectedB[0].booking.courtType;
      insertAbsoluteDiv(topSelection, bottomSelection, courtType);
      // get the clone;
      var clone = $("#dashBoardTable .clone");
      clone.removeClass("name-and-sport");
      clone.addClass("repeat-detail");
      var cancelButton = clone.find(".cancelNewBooking");
      cancelButton.removeClass("cancelNewBooking");
      cancelButton.addClass("cancelRegularDetail");
      var addButton = clone.find(".addNewBooking");
      addButton.removeClass("addNewBooking");
      addButton.addClass("addRegularDetail");
  }); */

  $("#col-9-admin").on("click", ".cancelNewBooking", function() {
      var courtType = $(this).closest(".clone").attr("data-courtType");
      $(this).closest(".clone").remove();
      var start = $("#dashBoardTable tbody td.unconfirmed").eq(0);
      var end = $("#dashBoardTable tbody td.unconfirmed").eq(1);
      var startTime = start.attr("data-time");
      var endTime = end.attr("data-time");
      var intervalArray = getIntervalsInclusive(startTime, endTime);
      var unConfirmedCourtId = start.attr("data-court");
      var endCourtId = parseInt(unConfirmedCourtId)+1;
      if (courtType == "halfCourt") {
        for (var i in intervalArray) {
          $(`td[data-time="${intervalArray[i]}"][data-court="${unConfirmedCourtId}"]`).removeClass("table-active unconfirmed");
        }
      } else { // full court
        for (var i in intervalArray) {
          $(`td[data-time="${intervalArray[i]}"][data-court="${unConfirmedCourtId}"]`).removeClass("table-active unconfirmed");
        }
        //console.log(endCourtId);
        for (var i in intervalArray) {
          $(`td[data-time="${intervalArray[i]}"][data-court="${endCourtId}"]`).removeClass("table-active unconfirmed");
        }
      }
      localStorage.setItem("clickCounter", "0");
      Mousetrap.unbind('ctrl+right');
      Mousetrap.unbind('ctrl+left');
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
      var sportType = box.find(".sportTypeInput").val();
      var totalCost = box.attr("data-totalCost");
      var courtType = box.attr("data-bookingType");
      var sportsCentreId = parseInt($("#id-holder").attr("data-sports-centre-id"));
      var newBooking = { booking: {court_no: box.attr("data-courtNo"), startTime: box.attr("data-startTime"),
      endTime: box.attr("data-endTime"), courtType: courtType, date: formattedToday,
      sports_centre_id: sportsCentreId, bookingType: "casual", sportsType: sportType, name: name }, order: {fullName: name,
      totalCost: totalCost, adminEntry: true, startDate: formattedToday,
      endDate: formattedToday, daysInBetween: 0 }, preBookingId: preBookedId};
      newBookings.push(newBooking);
      localStorage.setItem("newBookings", JSON.stringify(newBookings));
      $(this).closest(".clone").remove();
      // replace td selected with table-color
      var tdCounter = 0;
      $("#dashBoardTable tbody td.table-active").each( function() {
          if (tdCounter == 0) {
            $(this).html(`<i class="fas fa-redo"></i><div>${name}</div>`);
            $(this).addClass("textHolder");
          }
          if ((tdCounter == 0 && courtType == "halfCourt") || (tdCounter == 1 && courtType == "fullCourt")) {
            $(this).append("<div class='delete-presaved-booking'>&times</div>");
          }
          $(this).removeClass("unconfirmed table-active");
          $(this).addClass(`table${sportType} booked`);
          $(this).attr("data-preBookedId", preBookedId);
          tdCounter++;
      });
      localStorage.setItem("clickCounter", "0");
      localStorage.setItem("preBookingsMade", preBookedId+1)
  });

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

  $("#col-9-admin").on("click", ".delete-booking", function(e) {
    var sports_centre_id = $("#id-holder").attr("data-sports-centre-id");
    var answer;
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
        }
    }
  });

  $("#col-9-admin").on("click", ".delete-presaved-booking", function() {
        //var bookingID = $(this).attr("data-booking-id");
        var preBooking = $(this).parent();
        var preBookingId = preBooking.attr("data-preBookedId");
        preBooking.empty();
        preBooking.removeClass("textHolder");
        preBooking.prev().empty();
        preBooking.prev().removeClass("textHolder");
        $(`#dashBoardTable td[data-preBookedId="${preBookingId}"]`).each( function() {
              $(this).removeClass("booked");
              $(this).removeAttr("data-preBookedId");
              removeClassByPrefix($(this)[0], "table");
        });
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
      var sportType = box.find(".sportTypeInput").val();
      var courtType = box.attr("data-bookingType");

      var newBookings = JSON.parse(localStorage.getItem("newBookings"));
      var newBooking = { booking: {court_no: box.attr("data-courtNo"), startTime: box.attr("data-startTime"),
      endTime: box.attr("data-endTime"), courtType: courtType, date: datesChosen,
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
            $(this).html(`<i class="fas fa-redo"></i><div>${name}</div>`);
            $(this).addClass("textHolder");
          }
          if ((tdCounter == 0 && courtType == "halfCourt") || (tdCounter == 1 && courtType == "fullCourt")) {
            $(this).append("<div class='delete-presaved-booking'>&times</div>");
          }
          $(this).removeClass("unconfirmed table-active");
          $(this).addClass(`table${sportType} booked`);
          $(this).attr("data-preBookedId", preBookedId);
          tdCounter++;
      });
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
      }
      for (var i in arr) {
        $(`#dashBoardTable tbody td[data-time="${arr[i]}"][data-court="${secondColumnNumber}"]`).addClass("table-active");
      }
      var popUp = $("#col-9-admin .half-court-new-booking");
      popUp.find(".courtNumber").text(`Court ${firstColumnNumber} & ${secondColumnNumber}:`);
      popUp.find(".courtTime").text(`${startTime}-${realEndTime}`);
      var original = $("#col-9-admin .name-and-sport");
      original.attr("data-bookingType", "fullCourt");
      original.attr("data-courtNo", firstColumnNumber);
      original.attr("data-startTime", startTime);
      original.attr("data-endTime", realEndTime);
  }
  //td.addClass('table-active');

  function enableSelection(selectedCell) {
    selectedCell.addClass('table-active unconfirmed');
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
        var original = $("#col-9-admin .name-and-sport");
        original.attr("data-bookingType", "halfCourt");
        original.attr("data-courtNo", court);
        original.attr("data-startTime", starting_time);
        original.attr("data-endTime", ending_time);

        var popUp = $("#col-9-admin .half-court-new-booking");
        popUp.find(".courtNumber").text(`Court ${court}:`);
        popUp.find(".courtTime").text(`${starting_time}-${ending_time}`);
        //console.log("st", starting_time);
        //console.log("et", ending_time);
        //$("#half-court-new-booking").find(".nb-start-time input").val(starting_time);
        //$("#half-court-new-booking").find(".nb-end-time input").val(ending_time);

        while (end_index > start_index) {
          $(column).eq(start_index).addClass("table-active");
          start_index++;
        }
      }
    });
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
    //console.log("top", topTD);
    //console.log("bottomTd", bottomTD);
      var topPosition = topTD.position();
      var bottomPosition = bottomTD.position();
      var dashBoardPosition = $("#dashBoardTable").position().top;
      var halfway = (topPosition.top + bottomPosition.top)/2;
      var clone = $("#col-9-admin .name-and-sport").clone();
      clone.addClass("clone");
      clone.removeClass("d-none");
      if (courtType == "half_court") {
          if (topPosition.left == bottomPosition.left) {
            if (topTD.is(":last-child")) {
              $("#dashBoardTable tbody").append(clone.css({top: (topPosition.top - dashBoardPosition - 115), right: 10, position: "absolute"}));
              var cloneWidth = clone.outerWidth()/2;
              var cloneHeight = clone.outerHeight();
              $("#col-9-admin .triangle").eq(1).css({top: cloneHeight, left: cloneWidth + 100});
            } else {
              var admin_panel_width = $(".admin-panel").width()/2;
              $("#dashBoardTable tbody").append(clone.css({top: (topPosition.top - dashBoardPosition - 115), left: (topPosition.left - admin_panel_width), position: "absolute"}));
              var cloneWidth = clone.outerWidth()/2;
              var cloneHeight = clone.outerHeight();
              $("#col-9-admin .triangle").eq(1).css({left: cloneWidth, top: cloneHeight});
            }
            clone.find(".nameInput").trigger("focus");
            //console.log(clone.find("#nameInput"));
          }
      } else { // fult court two courts adjacent; has been checked already.
          if (topTD.is(":last-child")) {
            $("#dashBoardTable tbody").append(clone.css({top: (topPosition.top - dashBoardPosition - 115), right: 10, position: "absolute"}));
            var cloneWidth = clone.outerWidth()/2;
            var cloneHeight = clone.outerHeight();
            $("#col-9-admin .triangle").eq(1).css({top: cloneHeight, left: cloneWidth + 100});
          } else {
            var admin_panel_width = $(".admin-panel").width()/2;
            $("#dashBoardTable tbody").append(clone.css({top: (topPosition.top - dashBoardPosition - 115), left: (topPosition.left - admin_panel_width), position: "absolute"}));
            var cloneWidth = clone.outerWidth()/2;
            var cloneHeight = clone.outerHeight();
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
      $(clone).on("input", ".sportTypeInput", function() {
          var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          var sportCard = $(`#activityCardHolder .activityCard[data-activity='${$(this).val().toLowerCase()}']`);
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
              clone.find(".courtCost").text(`$${total.toFixed(2)}`);
              clone.attr("data-totalCost", total.toFixed(2));
          }

          var arrSports = [];
          var sportsDatalist = $("datalist#sports").first().children();
          sportsDatalist.each( (index) => arrSports.push(sportsDatalist[index].value) );
          if (arrSports.includes($(this).val()) && (clone.find("input.nameInput").val().length > 0)) {
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
            $(this).removeClass("mousetrap");
            Mousetrap.unbind('ctrl+right');
            Mousetrap.unbind('ctrl+left');
          }
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
