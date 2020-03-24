


var modal_body = BookingWidget.$('#payment-confirmation');
var reviewDetailModal = BookingWidget.$('#secondModalCard');
var bw = BookingWidget.$("#BookingWidget");

bw.on("click", "#bookNowButton", function(e) {
  // set height of hidden modal to same as first modal
  var maxBookings = bw.find("#maxBookingsWarning").attr("data-maxBookings");
  var bookingsRequested = bw.find(".number-of-bookings").text();
  console.log(maxBookings);
  console.log(bookingsRequested);
  if (parseInt(bookingsRequested) <= parseInt(maxBookings)){
        modal_body[0].style.display='block';
        fillInPaymentModal();
        var total_cost = calculateTotalPrice();
        //console.log("Total Cost", total_cost)
        var finalDetails = registerPeakHours(total_cost);
        //console.log("final result", finalResult);
        var clone;
        //var durations = initPaymentRequest(total_cost);
        //var total = durations[0];
        // set durations[0] as the subtotal; durations[1] as the array of times
        // fill in the prices modal and dynamic prices/other text in main modal
        var jsonArray = finalDetails[1];
        var subJsonArray;
        var newTypeString;
        //console.log("jsonArray", jsonArray);
        var bookings_count = modal_body.attr("data-number-of-bookings");
        //if (no_of_bookings == 1) {
        //hiddenModal.find('.modal-title').text("Details");
        //hiddenModal.find("#prices-title p").text("Prices");
        var pricesHeader = reviewDetailModal.find('.prices-header');
        pricesHeader.siblings().remove();
        //pricesHeader.removeClass("d-none");
          //pricesHeader.next().hide();
          //pricesHeader.empty();
        var total = 0;
        for (var counter in jsonArray) {
          subJsonArray = jsonArray[counter];
          clone = pricesHeader.clone();
          clone.removeClass("prices-header");
          //console.log(subJsonArray["time"]);
          newTypeString = subJsonArray["type"].replace("_", " ");
          clone.find(".bw-time").text(subJsonArray["time"]);
          clone.find(".bw-rate").text(`${newTypeString} ($${subJsonArray["rate"]}/hr)`);
          clone.find(".bw-hours").text(`${subJsonArray["duration"]}`);
          clone.find(".bw-cost").text(`$${subJsonArray["cost"]}`);
          //clone.find(".cost").addClass("cost-price");
          total += parseFloat(subJsonArray["cost"]);
          // enter details from durations in payment modal
          BookingWidget.$("<hr class='my-0 bw-margin0 bw-negRem'>").appendTo(pricesHeader.parent());
          clone.appendTo(pricesHeader.parent());
        }

        modal_body.find("#single-booking-price").text(`${total.toFixed(2)}`);
        //firstModal.find("#subtotal-booking-number").text(no_of_bookings);
        if (parseInt(bookings_count) == 1) {
          var remove_plural = modal_body.find("#subtotal-booking-text").text().replace("bookings", "booking");
          modal_body.find("#subtotal-booking-text").text(remove_plural);
        }
        modal_body.find("#subtotal").text(`$${(total * bookings_count).toFixed(2)}`);
        total *= bookings_count;
        console.log(parseFloat(total));
        console.log(parseFloat(modal_body.find("#discount").text().substr(2)));
        subtotal = parseFloat(total) - parseFloat(modal_body.find("#discount").text().substr(2));
        BookingWidget.$("#totalAmount").text(`$${subtotal.toFixed(2)}`);

        var heightModal = modal_body.find("#firstModalCard").outerHeight();
        //modal_body.find("#bw-bookingSummary").css("max-height", heightModal);
        //reviewDetailModal.css("max-height", heightModal);
        reviewDetailModal.find("#allDatesModal").css("min-height", heightModal);
        reviewDetailModal.css("margin-top", `-${heightModal}px`);

        var customer_email = modal_body.find("input.bw-emailLine").val();
        var booking_type = modal_body.attr("data-booking-type");
        var activity_type = modal_body.attr("data-activity-type");
        var court_type = modal_body.attr("data-court-type");
        var startTime = modal_body.attr("data-booking-startTime");
        var endTime = modal_body.attr("data-booking-endTime");
        // event listener for submission of booking details
        // all info specific to the overall order
        var booking_rate = "peak_hour"//modal_body.attr("data-booking-rate"); // set the data booking rate
        var all_dates = [];
        var new_text;
        var first_day_bookings = [];
        //var length_first_day = arrayCourtIdsAndTimes.length; // get the number of bookings on the first day
        var arrayOfRegularCourtIds;
        if (booking_type == "regular") {
          arrayOfRegularCourtIds = reviewDetailModal.find("#courtIdBody").attr("data-regularBookingCourtIds"); // array of courtIds for all regular bookings beside the first one.
          console.log(reviewDetailModal.find('#courtIdBody p'));
          reviewDetailModal.find('.booking-dates p').each( function() { // i must set the regular Booking CourtIds
            new_text = BookingWidget.$(this).text().split(", ")[1];
            //console.log("new_text", new_text);
            all_dates.push(new_text);
          });
        } else { // casual
          all_dates.push(bw.find("#dateHolder").val().split(", ")[1]);
          arrayOfRegularCourtIds = "[]";
        }
        first_day_bookings = all_dates.splice(0, 1);
        //console.log("all dates", all_dates);
        var frequencyType = reviewDetailModal.find("#frequencyRate").attr("data-frequency-type");
        var daysInBetween = (frequencyType == "Weeks") ? (parseInt(modal_body.attr("data-booking-interval") * 7)) : (modal_body.attr("data-booking-interval"));
        //console.log(arrayOfRegularCourtIds);
        arrayOfRegularCourtIds = JSON.parse(arrayOfRegularCourtIds);
        var courtIdsTimesArray = [];

        var arrayCourtIdsAndTimes = reviewDetailModal.find(".templateCourtRow");
        arrayCourtIdsAndTimes.each( function(index) {
            //courtIdsTimesArray = [];
            courtId = BookingWidget.$(this).attr("data-courtId");
            startCourtTime = BookingWidget.$(this).attr("data-startTime");
            endCourtTime = BookingWidget.$(this).attr("data-endTime");
            stringIdTime = `${courtId}-${startCourtTime}-${endCourtTime}`;
            courtIdsTimesArray.push(stringIdTime);
        });

        var jsonOrderParams = {
              totalAmount: total, //yes
              customerEmail: customer_email, // yes
              bwAllDates: JSON.stringify(all_dates), // all regular bookings after the first day, if any are present
              bwFirstDayBookings: JSON.stringify(first_day_bookings), // yes
              daysInBetween: daysInBetween, // yes
              bwArrayOfRegularCourtIds: JSON.stringify(arrayOfRegularCourtIds) // yes
        } // all info specific to a booking
            // decide how to assign the court number later on
        var jsonBookingParams = {
              bookingType: booking_type, // casual or regular
              activityType: activity_type,
              courtType: court_type, // half court or full court
              startTime: startTime, // yes
              endTime: endTime, //yes
              bwCourtIdTimesArray: JSON.stringify(courtIdsTimesArray) // an array of all the courts/times for a casual one day booking.`
        }  //(not necessarily continuous in one court throughout.)
        var paramsOrderText = addParams("order", jsonOrderParams);
        var paramsBookingText = addParams("booking", jsonBookingParams);
        //console.log("all_dates", all_dates);
        //console.log("first_day", first_day_bookings);
        //debugger
        BookingWidget.$("#firstModalCard #polipayInfo").hover( showPolipayInfo, hidePolipayInfo );
        //console.log(paramsText);
        var sportsCentreId = document.querySelector("#weBallWidget").getAttribute("data-sportsCentreId");
        modal_body.on("click", "#polipay", function() {
          var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/initiate`, "POST");
          request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          request.onload = function(e) {
            var response = request.response;
            //var redirect_url = response["redirect_url"];
            var parsedResponse = JSON.parse(response);
            var redirect_url = parsedResponse["redirect_url"];
            //window.location.href = redirect_url;
            window.location.replace(redirect_url);
          }
          request.send(`${paramsOrderText}&${paramsBookingText}`);
        })
    } else {
        alert("Not enough courts available!");
        e.stopPropagation();
    }
});

modal_body.on("click", "#modalClose", function() {
  modal_body[0].style.display='none';
})

modal_body.on("click", ".back-arrow-booking", function() {
  reviewDetailModal.css("margin-left", "100%");
});

modal_body.on("click", ".trigger-detail-modal", function() {
  reviewDetailModal.css("margin-left", "0%");
});
// fill in payment details except for the cost
function showPolipayInfo() {
    BookingWidget.$("#firstModalCard #polipayFooter").removeClass("bw-none");
}

function hidePolipayInfo() {
    BookingWidget.$("#firstModalCard #polipayFooter").addClass("bw-none");
}

function addParams(name, jsonParams) {
  var newString;
  var newParams = "";
  for (var prop in jsonParams) {
    newString = `${name}[${prop}]=${jsonParams[prop]}&`;
    //console.log(newString);
    newParams = newParams.concat(newString);
  }
  //console.log("new", newParams);
  newParams = newParams.slice(0,-1);
  return newParams;
}

// make a Cors request
function makeCORSRequest(url, method) {
  if (typeof XMLHttpRequest === "undefined") {
    return null;
  }

  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest !== "undefined") {
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    xhr = null;
  }
  return xhr;
}

function registerPeakHours(costAndTimes) {
  var total;
  var booking_array;
  var start_of_booking_type;
  var end_of_booking_type;
  var booking_duration;
  var booking_full_label;
  var booking_rate;

  var objectsArray = []; // for details
  var tempObject;
  //var ["Booking"]
  var booking_types = ["off peak", "peak hour", "school holiday"];
  var booking_rates;
  var typeHolder;
  var counter = 1;
  var real_prices;
  var prices_json;
  var booking_rate;
  var booking_type;
  //console.log(costAndTimes);
  if (typeof(costAndTimes) == 'object') {
      console.log(costAndTimes);
      total = (costAndTimes["Total"]).toFixed(2); // get the total cost
      delete costAndTimes.Total

      real_prices = bw.find('#real-price-holder').attr("data-prices");
      prices_json = JSON.parse(real_prices);
       // calculate the individual booking period for peak, off-peak and school holiday
      var frequency_type = modal_body.attr("data-booking-type");
      var pre_court_type = bw.find("#tabHolder").attr("data-courtType").split("C")[0];
      var court_type = `${pre_court_type}_court`;
      var smallBookingArray;

      for (var type in costAndTimes) {
          booking_array = costAndTimes[type];
          for (var subArray in booking_array) {
          //if (booking_array.length != 0) {
              smallBookingArray = booking_array[subArray];
              start_of_booking_type = smallBookingArray[0];
              end_of_booking_type = smallBookingArray[smallBookingArray.length - 1] + 0.5;
              booking_duration = end_of_booking_type - start_of_booking_type;

              booking_rates = prices_json["casual"][court_type]; // assigning casual/regular or half_court/full_court respectively
              booking_rate = booking_rates[type]; // for assigning off_peak or peak_hour

              booking_full_label = `${convertToAMPM(convertTimeIntoString(start_of_booking_type))} - ${convertToAMPM(convertTimeIntoString(end_of_booking_type))}`;
              booking_type = `${type}`;

              tempObject = { time: booking_full_label, type: booking_type, rate: booking_rate,
                 duration: booking_duration, cost: (booking_rate * booking_duration).toFixed(2) }
              //console.log(tempObject);
              objectsArray.push(tempObject);
          } //else do not register as a part of the final checkout detail;
      }
      //console.log(objectsArray);
      //console.log(total);
      return [total, objectsArray];
    }
}

function calculateTotalPrice() {
  var peak_hours_text = bw.find("#peak-hour-holder").attr("data-peak-hours");
  var daySelected = bw.find("#dateHolder").val().substr(0,3); // abbr
  var peak_hours_object = JSON.parse(peak_hours_text);
  //console.log("peak_hours", peak_hours_object);
  var peak_starting_hour = convertAMPMToString(peak_hours_object[daySelected]["startingPeakHour"]);
  var peak_closing_hour = convertAMPMToString(peak_hours_object[daySelected]["closingPeakHour"]);
  var bookingStartTime = bw.find("input.startTime").val();
  var bookingEndTime = bw.find("input.endTime").val();
  //console.log(bookingStartTime, bookingEndTime, peak_starting_hour, peak_closing_hour);
  //console.log("peak-start", peak_starting_hour);
  //console.log("peak-close", peak_closing_hour);
  //console.log("booking-start", bookingStartTime);
  //console.log("booking-end", bookingEndTime);
  var costAndTimes = generateIncrements(bookingStartTime, bookingEndTime, peak_starting_hour, peak_closing_hour);
  //console.log(totalCost);
  //console.log(costAndTimes);
  return costAndTimes; // [totalCost, times outside the peak, times inside the peak period]
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

function generateIncrements(start_time, end_time, peak_start, peak_end) {
  // convert selected booking times to decimal
  var newStartTime = start_time.replace(':3', ':5').replace(':', '.');
  var newEndTime = end_time.replace(':3', ':5').replace(':', '.');
  var decimalStart = parseFloat(newStartTime);
  var decimalEnd = parseFloat(newEndTime);
  //console.log(decimalStart, decimalEnd)
  // convert peak hour times to decimal
  var peakStartTime = peak_start.replace(':3', ':5').replace(':', '.');
  var peakEndTime = peak_end.replace(':3', ':5').replace(':', '.');
  var decimalPeakStart = parseFloat(peakStartTime);
  var decimalPeakEnd = parseFloat(peakEndTime);
  //var real_prices = $('.real-price-holder').text()
  var real_prices = bw.find('#real-price-holder').attr("data-prices");
  var prices_json = JSON.parse(real_prices);
  //console.log(prices_json);
  //var prices = $(".priceHolder")[];
  var rate;
  var totalCost = 0;
  //var booking_type;
  var time_period_peak = [];
  var time_period_off_peak = [];
  var productListing = [];
  //console.log(decimalStart, decimalEnd);
  //console.log("start", decimalStart);
  //console.log("end", decimalEnd);
  while (decimalStart != decimalEnd) {
    //console.log(totalCost)
      // if the booked time lies between the designated peak hours
      if (decimalStart >= peakStartTime && decimalStart < peakEndTime) {
          // then then startTime of interval is within the peak hours
          rate = parseFloat(prices_json["casual"]["half_court"]["peak_hour"])/2.0 // peak_hour_rate
          //booking_type = "Booking (peak hour)";
          time_period_peak.push(decimalStart);
          //console.log(rate);
      } else {
          rate = parseFloat(prices_json["casual"]["half_court"]["off_peak"])/2.0 //non-peak_hour rate
          time_period_off_peak.push(decimalStart);
          //console.log(rate);
      }
      totalCost += rate;

      decimalStart += 0.5;
      // increment by thirty minutes
  }
  //console.log(totalCost);
  // iterate through the resulting peak and off peak array to check for non 0.5 intervals
  // if exists separate into a separate array within.
  time_period_off_peak = checkArray(time_period_off_peak);
  time_period_peak = checkArray(time_period_peak);
  console.log(time_period_peak);
  console.log(time_period_off_peak);
  var costAndTimes = {"Total": totalCost, "off_peak":time_period_off_peak, "peak_hour":time_period_peak}
  //console.log(time_period_peak, time_period_off_peak);
  return costAndTimes;
}
// provide an array and return an array of subarrays if the provided array's
// elements are all separate by 0.5 interval.
function checkArray(arrayTimes) {
  var i = arrayTimes.length - 1;
  var subArray;
  var newArray = [];
  if (i == 0) { // where arrayTimes length is only one where the customer wants to book a half-hour booking
      newArray.unshift(arrayTimes);
  }
  while (i > 0) {
    if (arrayTimes[i] - arrayTimes[i-1] != 0.5) {
      subArray = arrayTimes.splice(i);
      newArray.unshift(subArray);
      if (i == 1) {
        subArray = arrayTimes.splice(0);
        newArray.unshift(subArray);
      }
    } else {
      // if different by 0.5 & on index = 1
      if (i == 1) {
        subArray = arrayTimes.splice(0);
        newArray.unshift(subArray);
      }
    }
    i--;
  }
  return newArray;
}

function fillInPaymentModal() {
  // to store the courtype for later use
  var courtType;
  // get the court Type div in the modal (should be empty initially or default to half-court).
  var court_type_holder = modal_body.find(".courtType");
  // get the frequency of booking (not checking whether days or weeks yet).
  var frequency = parseInt(bw.find(".frequency-in-days").text());

  var activityChosen = bw.find("#activityHolder").text();

  //var intervalBetweenBookings = parseInt(BookingWidget.$("#repeatBookingCard .frequency-in-days").text());

  // assign half court or half court to item in modal
  if (BookingWidget.$('#halfCourtTab').hasClass("active")) {
    courtType = "halfCourt"; // set item to half-court
    court_type_holder.text("Half Court");
  }
  if (BookingWidget.$('#fullCourtTab').hasClass("active")) {
    courtType = "fullCourt"; // full-court
    court_type_holder.text("Full Court");
  }

  modal_body.attr("data-activity-type", activityChosen)
  modal_body.find("#activityType").text(activityChosen + " ")
  // store court type and interval in the div payment modal.
  modal_body.attr("data-court-type", courtType);
  modal_body.attr("data-booking-interval", frequency);

  // get the startTime and endTimes from booking widget
  var startTime = bw.find("input.startTime").val();
  var endTime = bw.find("input.endTime").val();

  var startTimeAMPM = convertToAMPM(startTime);
  var endTimeAMPM = convertToAMPM(endTime);
  //console.log("start",startTime);
  //console.log("end", endTime);
  // store the times also in the div payment modal;
  modal_body.attr("data-booking-startTime", startTime);
  modal_body.attr("data-booking-endTime", endTime);

  // get the span holder in the payment modal and fill it in with the start and endTime of booking.
  var bookingPeriod = modal_body.find("span.bookingPeriod");
  bookingPeriod.text(`${startTimeAMPM}-${endTimeAMPM}`);

  // if the number of bookings under repeat booking is more than one
  // then create the regular booking format, otherwise leave casual as default.
  //var repeat_card = BookingWidget.$("#repeat-card");
  // get number of bookings
  var number_of_bookings = parseInt(bw.find(".number-of-bookings").text());
  modal_body.attr("data-number-of-bookings", number_of_bookings);
  var booking_type = (number_of_bookings > 1) ? "regular" : "casual";
  modal_body.attr("data-booking-type", booking_type)

  // get the starting date selected as string.
  var startDate = bw.find("input#dateHolder").val();
  var weekday = startDate.split(" ")[0];
  // set the day for the first booking
  console.log("weekday", weekday);
  modal_body.find('#weekday').text(weekday);
  var startDateObject = new Date(startDate);
  // in either cases we must fill in the date for the first booking-row
  // get the start and bottom rows
  var booking_start_row = modal_body.find(".booking-row-start");
  var booking_end_row = modal_body.find(".booking-row-end");
  var calendarDivider = modal_body.find(".range-divider");
  var singleReview = modal_body.find(".reviewSingleBooking");
  // to be used for filling in prices and booking dates
  //console.log(booking_start_row);
  //console.log(startDateObject);

  // get the array of arrays for that date
  var bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
  //console.log(bookingMatrix);
  var bookingCourtIds = (courtType == "halfCourt") ? calculateCourtIds(startTime, endTime, bookingMatrix) : calculateFullCourtIds(startTime, endTime, bookingMatrix);
  //console.log("Court Ids", bookingCourtIds);
  // assign court ids and period to the rows in details modal
  var courtIdBody = reviewDetailModal.find("#courtIdBody");
  assignCourtIdToBox(courtIdBody, bookingCourtIds);

  assignDateToBox(booking_start_row, startDateObject); // assigned the start date to the first box/row
  // if a regular booking is selected

  // show the booking start row in both cases where booking is regular or casual
  var dateTextHolder;
  var booking_dates_modal = reviewDetailModal.find(".booking-dates");

  var dateHolder = reviewDetailModal.find(".templateDateRow").first();
  var divider = dateHolder.next();

  // create a deep copy of both
  var copiedDivider;
  var copiedDateHolder;

  if (number_of_bookings > 1) { //** DO NOT DELETE
    // This part of the code deals with court ids for future bookings; ignore for now
    // if a regular booking, we want to add more rows to the court id body using the array stored
    var arrayOfFreeCourtIds = bw.find("#maxBookingsWarning").attr("data-arrayOfFreeCourtIds");
    arrayOfFreeCourtIds = JSON.parse(arrayOfFreeCourtIds);
    var shortenedFreeCourtArray = arrayOfFreeCourtIds.slice(0,number_of_bookings-1);
    courtIdBody.attr("data-regularBookingCourtIds", JSON.stringify(shortenedFreeCourtArray));

    var templateCourtRowCopy;// = courtIdBody.find(".templateCourtRow").first().clone();

    for (var index in shortenedFreeCourtArray) {
      //console.log(shortenedFreeCourtArray[index]);
      templateCourtRowCopy = courtIdBody.find(".templateCourtRow").first().clone();
      templateCourtRowCopy.removeClass("templateCourtRow");
      templateCourtRowCopy.find("p").text(`Court ${shortenedFreeCourtArray[index]}: ${startTimeAMPM}-${endTimeAMPM}`);
      templateCourtRowCopy.attr("data-courtId", shortenedFreeCourtArray[index]);
      templateCourtRowCopy.appendTo(courtIdBody);
      BookingWidget.$("<hr class='my-0 bw-margin0 bw-negRem'>").appendTo(courtIdBody);
      //console.log(index);
    }
    // remove the review booking div (intended only for one booking)
    singleReview.addClass("bw-none");
    // fill in the booking-number holder
    calendarDivider.removeClass("bw-none");
    booking_end_row.removeClass("bw-none");

    // fill in number of bookings
    modal_body.find(".booking-number").text(number_of_bookings);
    modal_body.find("#subtotal-booking-number").text(number_of_bookings); // for the subtotal

    var frequencyNode = bw.find("#frequencyBottomRow input");
    modal_body.find(".frequencyHolder").text(frequencyNode.val());
    // calculate the ending date.
    // remove the d-none, reveal the second row
    //var frequency = parseInt(bw.find(".frequency-in-days").text());
    //var frequencyType = repeat_card.find(".days_and_weeks").children();
    // weeks or days
    var frequencyType = frequencyNode.attr("data-frequency-type");
    frequency = (frequencyType == "Days") ? frequency : frequency * 7; // frequency in days
    var total_days_in_period = (number_of_bookings - 1) * frequency; // taking account of number of bookings
    // copy the startDateObject
    var endDateObject = new Date(startDate);
    endDateObject.setDate(endDateObject.getDate()+total_days_in_period);

    // create an array of dates which track the intervals between the start and endDate
    var intervalDateObject = new Date(startDate);
    var i = 0;
    var allDateHolder = [];
    while (i < number_of_bookings) {
      dateTextHolder = intervalDateObject.toLocaleDateString('en-GB', { weekday: 'long', day:'numeric', month: 'long', year:'numeric'});
      //alert(dateTextHolder);
      allDateHolder.push(dateTextHolder);
      intervalDateObject.setDate(intervalDateObject.getDate()+frequency);
      i++;
    }

    // enter the date into the bottom row.
    assignDateToBox(booking_end_row, endDateObject);

    // fill in the dates for the regular bookings
    booking_dates_modal.empty();

    var j = 0
    while (j < allDateHolder.length) {
      //alert(allDateHolder[i]);
      copiedDivider = divider.clone();
      copiedDivider.removeClass("bw-none");
      copiedDateHolder = dateHolder.clone();
      copiedDateHolder.removeClass("bw-none");
      copiedDateHolder.find("p").text(allDateHolder[j]); // insert the calculated Date
      booking_dates_modal.append(copiedDateHolder);
      booking_dates_modal.append(copiedDivider);
      j++;
    }

  } else if (number_of_bookings == 1){
    // nothing
    booking_end_row.addClass("bw-none");
    calendarDivider.addClass("bw-none");
    singleReview.removeClass("bw-none");
    booking_dates_modal.empty();
    dateTextHolder = startDateObject.toLocaleDateString('en-GB', { weekday: 'long', day:'numeric', month: 'long', year:'numeric'});
    copiedDateHolder = dateHolder.clone();
    copiedDivider = divider.clone();
    copiedDivider.removeClass("bw-none");
    copiedDateHolder.removeClass("bw-none");
    copiedDateHolder.find("p").text(dateTextHolder); // insert the calculated Date
    booking_dates_modal.append(copiedDateHolder);
    booking_dates_modal.append(copiedDivider);
  }

}

function convertToAMPM(timeString) {
  var hours_and_minutes = timeString.split(":");
  var parsed_int = parseInt(hours_and_minutes[0]);
  var int = (parsed_int % 12 == 0) ? 12 : parsed_int % 12;
  var am_or_pm = (hours_and_minutes[0] >= 12) ? "PM" : "AM";
  return `${int}:${hours_and_minutes[1]}${am_or_pm}`
}

function calculateCourtIds(startTime, endTime, courtArrays) {
  //var bookingMatrix = localStorage.getItem("BookingsMatrix");
  var bookingIntervals = getIntervals(startTime, endTime);
  var setBooking = new Set(bookingIntervals);
  var setCourtBookings;
  var intersection;
  var courtFreeIds = [];
  var timesToBeFilled;
  var newSetBooking;
  //var intersectionMatrix = [];
  var courtTimeDifference;
  var hashSets = {};
  var courtFreePeriods = [];
  var arrayBookedSets = [];
  var finalHash = {};
  for (var item in courtArrays) {
    arrayBookedSets.push(new Set(courtArrays[item]));
  }
  //console.log("ArrayBookedSets", arrayBookedSets);
  do {
      for (var courtTimes in arrayBookedSets) { // array of arrays
        //setCourtBookings = new Set(courtArrays[courtTimes]);
        intersection = new Set([...courtArrays[courtTimes]].filter(x => setBooking.has(x)));
        /* if (intersection.size == 0) {
          courtFreeIds.push(courtTimes + 1);
          break
        } */// if no overlapping times, then this court is available to be booked. return the court id.
        //intersectionMatrix.push(intersection); use hash instead of array
        //console.log("Intersection", intersection);
        hashSets[intersection.size] = [intersection, courtTimes];
      }

      timesToBeFilled = Object.keys(hashSets).sort()[0];
      //console.log("hash sets", hashSets);
      //console.log("times to be filled", timesToBeFilled);
      courtFreeIds.push(hashSets[timesToBeFilled][1]); // store the courtId of the court that is free for most of the booking
      newSetBooking = hashSets[timesToBeFilled][0]; // get the set which will contain the times which still need a courtId for.
      courtTimeDifference = [...setBooking].filter(x => !newSetBooking.has(x)); // array
      setBooking = newSetBooking;

  //} while (intersection.size != 0);
      courtFreePeriods.push(getLargestSubArray(courtTimeDifference));
  //return courtFreeIds;
  /*console.log("Times that still need filling", timesToBeFilled);
  console.log("id of the best matching court", courtFreeIds);
  console.log("Times that still need a court to accomodate", setBooking);
  *///console.log("HashSets", hashSets);
} while(timesToBeFilled != 0);
  for (var i in courtFreeIds) {
      finalHash[parseInt(courtFreeIds[i])+1] = courtFreePeriods[i];
  }
  return finalHash;
  //console.log("Court Ids", courtFreeIds);
  //console.log("Respective Court Periods", courtFreePeriods);
}

function calculateFullCourtIds(startTime, endTime, courtArrays) {
  //var bookingMatrix = localStorage.getItem("BookingsMatrix");
  var bookingIntervals = getIntervals(startTime, endTime);
  var setBooking = new Set(bookingIntervals);
  var setCourtBookings;
  var intersection;
  var intersection2;
  var courtFreeIds = [];
  var timesToBeFilled;
  var newSetBooking;
  //var intersectionMatrix = [];
  var courtTimeDifference;
  var hashSets = {};
  var courtFreePeriods = [];
  var arrayBookedSets = [];
  var finalHash = {};
  for (var item in courtArrays) {
    arrayBookedSets.push(new Set(courtArrays[item]));
  }
  //console.log("ArrayBookedSets", arrayBookedSets);
  do {
      for (var courtTimes = 0; courtTimes < (arrayBookedSets.length-1); courtTimes += 2) { // array of arrays
        //setCourtBookings = new Set(courtArrays[courtTimes]);
        //console.log(courtTimes);
        intersection = new Set([...courtArrays[courtTimes]].filter(x => setBooking.has(x)));
        intersection2 = new Set([...courtArrays[courtTimes+1]].filter(x => setBooking.has(x)));
        isSetsEqual = (a, b) => a.size === b.size && [...a].every(value => b.has(value));
        if (isSetsEqual(intersection, intersection2)) {
          hashSets[intersection.size] = [intersection, courtTimes];
        }
        /* if (intersection.size == 0) {
          courtFreeIds.push(courtTimes + 1);
          break
        } */// if no overlapping times, then this court is available to be booked. return the court id.
        //intersectionMatrix.push(intersection); use hash instead of array
        //console.log("Intersection", intersection);
      }

      timesToBeFilled = Object.keys(hashSets).sort()[0];
      console.log("HashSets", hashSets);
      console.log("Times to be filled", timesToBeFilled);
      //console.log("hash sets", hashSets);
      //console.log("times to be filled", timesToBeFilled);
      courtFreeIds.push(hashSets[timesToBeFilled][1]); // store the courtId of the court that is free for most of the booking
      newSetBooking = hashSets[timesToBeFilled][0]; // get the set which will contain the times which still need a courtId for.
      courtTimeDifference = [...setBooking].filter(x => !newSetBooking.has(x)); // array
      setBooking = newSetBooking;

  //} while (intersection.size != 0);
      courtFreePeriods.push(getLargestSubArray(courtTimeDifference));
  //return courtFreeIds;
  /*console.log("Times that still need filling", timesToBeFilled);
  console.log("id of the best matching court", courtFreeIds);
  console.log("Times that still need a court to accomodate", setBooking);
  *///console.log("HashSets", hashSets);
  //console.log(timesToBeFilled);
} while(timesToBeFilled != 0);
  for (var i in courtFreeIds) {
      finalHash[parseInt(courtFreeIds[i])+1] = courtFreePeriods[i];
  }
  return finalHash;
  //console.log("Court Ids", courtFreeIds);
  //console.log("Respective Court Periods", courtFreePeriods);
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

function getLargestSubArray(array) {
  var decimalArray = [];
  var subArrayHolder = [];
  var shiftsArray = [];
  //var longestSubBooking = 0;
  var longestSubBooking = [];
  var holderArray = [];
  var finalString; // final string containing the period to be returned.

  for (var item in array) {
    decimalArray.push(parseFloat(array[item].replace(":3", ".5")));
  }
  var indexCounter = 0;
  while (indexCounter < (decimalArray.length - 1)) {
    if (Math.abs(decimalArray[indexCounter + 1] - decimalArray[indexCounter]) != 0.5) {
      subArrayHolder.unshift(indexCounter + 1);
    }
    indexCounter++;
  }
  subArrayHolder.push(0);
  for (var arrayIndex in subArrayHolder) {
    holderArray = decimalArray.splice(subArrayHolder[arrayIndex]);
    if (holderArray.length > longestSubBooking.length) {
      longestSubBooking = holderArray;
    }
    shiftsArray.push(holderArray);
  }
  var startSubBooking = convertToAMPM(convertTimeIntoString(longestSubBooking[0]));
  var endSubBooking = convertToAMPM(convertTimeIntoString(longestSubBooking[longestSubBooking.length - 1] + 0.5));
  finalString = `${startSubBooking}-${endSubBooking}`
  return finalString
}

function assignCourtIdToBox(courtBody, hashIds) {
  var templateCourtRow = courtBody.find(".templateCourtRow").first();
  var rowClone;
  var hrElement = courtBody.find("hr").first();
  var hrClone;
  var split;
  courtBody.empty();
  for (var courtId in hashIds) {
    rowClone = templateCourtRow.clone().removeClass("bw-none");
    rowClone.attr("data-courtId", `${courtId}`);
    split = hashIds[courtId].split("-");
    rowClone.attr("data-startTime", `${split[0]}`);
    rowClone.attr("data-endTime", `${split[1]}`);
    rowClone.children().eq(0).text(`Court ${courtId}: ${hashIds[courtId]}`);
    hrClone = hrElement.clone();
    courtBody.append(rowClone);
    courtBody.append(hrClone);
  }
}

function assignDateToBox(booking_row, date) {
  var monthLong = date.toLocaleDateString('en-US', {month: 'long'});
  var numberDay = date.toLocaleDateString('en-US', {day: 'numeric'});
  booking_row.find(".monthHolder").text(monthLong);
  booking_row.find(".dayHolder").text(numberDay);
}

bw.on("click", "#checkAvailabilityButton", function() {
  // call functions to check 10 bookings ahead of time.
  var allBookings = JSON.parse(localStorage.getItem("bookings_array"));
  var date = bw.find("#dateHolder").val();
  var bookingNumber = parseInt(bw.find(".frequency-in-days").text());
  var bookingInput = bw.find("#frequencyRate").attr("data-frequency-type");
  var interval_in_days = (bookingInput == "Days") ? bookingNumber : (bookingNumber * 7); // get interval in days
  var startTime = bw.find("input.startTime").val();
  var endTime = bw.find("input.endTime").val();
  var courtType = bw.find("#tabHolder").attr("data-courtType"); // set courtType later on click
  var numberOfCourts = parseInt(localStorage.getItem("numberOfCourts"));
  var arrayOfFreeCourtIds = [];
  /*
  console.log(bookings);
  console.log(date);
  console.log(interval_in_days);
  */

  var arrayOfArrays = extract_relevant_days(allBookings, date, interval_in_days);
  console.log("selected days", arrayOfArrays);
  // after extracting the relevant days; let us filter the bookings so that only bookings matching the relevant dates remain.
  //console.log("all bookings", bookings);
  var courtIdFree = null;
  for (var bookingsOfOneSelectedDate in arrayOfArrays) {
    //if (arrayOfArrays[bookingsOfOneSelectedDate].length != 0) { an array containing all the bookings in one day, which matches a regular booking day
      courtIdFree = checkDayAvailability(arrayOfArrays[bookingsOfOneSelectedDate], startTime, endTime, numberOfCourts) // return boolean depending on whether a court is free on that particular day
      // add courtType later
      if (courtIdFree == null) {
        break
      } else {
        arrayOfFreeCourtIds.push(courtIdFree);
      }
  }
  console.log("free Court Ids", arrayOfFreeCourtIds);
  var maxNoBookings = arrayOfFreeCourtIds.length + 1; // max-bookings, count the number of extra bookings ahead and include the current/first booking
  var maxContainer = bw.find("#maxBookingsWarning");
  maxContainer.text(`Max. ${maxNoBookings} bookings available`);
  maxContainer.parent().removeClass("bw-none");
  maxContainer.attr("data-maxBookings", maxNoBookings);
  maxContainer.attr("data-arrayOfFreeCourtIds", JSON.stringify(arrayOfFreeCourtIds));
});

// add on click listener later.

function checkDayAvailability(arrayOfHash, startTime, endTime, numberOfCourts) {
  console.log("arrayOFHash", arrayOfHash);
  var arr = [...Array(numberOfCourts+1).keys()];
  arr.shift();
  var availabilityBoolean = false;
  var intervalTimes = new Set(getIntervals(startTime, endTime));
  var hashSetTime;
  var startTimeEdited;
  var endTimeEdited;
  var hashSet;
  var bookingOverlapCounter = 0; // keep track of number of bookings in a day matching a court and also overlapping time. If none, then the court is free
  var prevCourtCounter = 0;
  var courtFreeId = null;
  var intersection;
  for (var court_no = 1; court_no <= arr.length; court_no++) { // 1..6
    //console.log(court_no);
    for (var hashBooking in arrayOfHash) {
      hashSet = arrayOfHash[hashBooking];
      // if none of the bookings in the hash (each representing a day) match, then no bookings for the current court on that day.
      // bookingOverlapCounter remains zero or no difference
      if ((hashSet.court_no == court_no) || ((hashSet.court_no == (court_no - 1)) && (hashSet.courtType == "fullCourt"))) { // if the previous skipped booking was in fact a full court booking
        startTimeEdited = hashSet.startTime.split("T")[1].substr(0,5);
        endTimeEdited = hashSet.endTime.split("T")[1].substr(0,5);
        //console.log(hashSet, startTimeEdited, endTimeEdited);
        hashSetTime = new Set(getIntervals(startTimeEdited, endTimeEdited));
        intersection = new Set([...intervalTimes].filter(x => hashSetTime.has(x)));
        // if intersection.size == 0, then bookingOverlapCounter remains 0 or no difference
        if (intersection.size != 0) { // meaning the court is free during the time in question
          bookingOverlapCounter++; // note that a booking in the current court overlaps with the desired booking
        }
      }
    }
    if (bookingOverlapCounter == prevCourtCounter) { // after iteration if no bookings match with a court
      courtFreeId = court_no;
      break;
    } else {
      prevCourtCounter = bookingOverlapCounter; // if not zero, i.e. assign the prevCourtCounter the new value to monitor difference.
    }
  }
  //console.log("Free court id", courtFreeId);
  return courtFreeId; // null means no court available
}

function extract_relevant_days(bookings, date, interval_in_days) {
    var counter = 0;
    var regularDate = new Date(date);
    var stringDate;
    var arrayOfDates = [];
    var arrayOfArrays = [];
    // check all dates for a regular booking up to ten bookings ahead
    while (counter < 9) {
      arrayOfDates = [];
      regularDate.setDate(regularDate.getDate() + interval_in_days);
      stringDate = regularDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
      replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
      console.log(stringDate);
      // iterate through all bookings and add those matching one day to a subarray
      for (var jsonBooking in bookings) {
          if (bookings[jsonBooking]["date"] == stringDate) {
              arrayOfDates.push(bookings[jsonBooking]);
          }
      }
      arrayOfArrays.push(arrayOfDates); // add to larger array if found
      //arrayOfDates.push(stringDate);
      counter++;
    }
    // returns array of Arrays aka (where all days that have bookings on the same as the regular booking appear).
    return arrayOfArrays;
}
