document.addEventListener('DOMContentLoaded', function(){

    if ($("#mapid").length) {
        const payButton = document.querySelector(".book-now");
        var court_type = document.querySelector(".court-types > a.active").getAttribute("data-courtType");

        // for the time being
        // assume that guests only will book one session as a casual
        // possibly require signup for repeat bookings
        var player_type = "casual";

        // allow the admin to customise their prices by
        // choosing which times during the week and which date periods will have discounted rates.
        // for now assume the time rate is "off-peak"
        var time_type = "off_peak";
        var firstModal = $(".modal-content.firstModal");
        var hiddenModal = $("#allDatesModal");
        var timesAndCosts;
        var summaryModal = $("#payment-summary");
        //payButton.setAttribute('style', 'display: none;');
        //payButton.setAttribute('style', 'display: inline;');
        payButton.addEventListener('click', function(e) {
          //alert("working");
          // check that the startTime and the endTime has both been selected.
          // fix later
          var maxBookings = $("#maxBookingsWarning").attr("data-maxBookings");
          var booking = $("#repeat-card .number-of-bookings");
          if (parseInt(booking.text()) <= parseInt(maxBookings)){
              var start = document.querySelector("input.startTime");
              var end = document.querySelector("input.endTime");

              // missing either the start or end time
              if ((start.value == "") || (end.value == "")) {
                start.classList.add("is-invalid");
                end.classList.add("is-invalid");
                return;
              }

              fillInPaymentModal();
              var total_cost = calculateTotalPrice();
              console.log("total cost", total_cost);
              var clone;
              var durations = initPaymentRequest(total_cost);
              //var total = durations[0];
              // set durations[0] as the subtotal; durations[1] as the array of times
              // fill in the prices modal and dynamic prices/other text in main modal
              var jsonArray = durations[1];
              var subJsonArray;
              var newTypeString;
              console.log("jsonArray", jsonArray);
              var no_of_bookings = $("#payment-summary").attr("data-number-of-bookings");
              //if (no_of_bookings == 1) {
              hiddenModal.find('.modal-title').text("Details");
              //hiddenModal.find("#prices-title p").text("Prices");
              hiddenModal.find(".prices-header").siblings().remove();
              var pricesHeader = hiddenModal.find('.prices-header')
              pricesHeader.removeClass("d-none");
                //pricesHeader.next().hide();
                //pricesHeader.empty();
              var total = 0;
              for (var counter in jsonArray) {
                subJsonArray = jsonArray[counter];
                clone = pricesHeader.clone();
                clone.removeClass("prices-header");
                //console.log(subJsonArray["time"]);
                newTypeString = subJsonArray["type"].replace("_", " ");
                clone.find(".time").text(subJsonArray["time"]);
                clone.find(".rate").text(`${newTypeString} ($${subJsonArray["rate"]}/hr)`);
                clone.find(".hours").text(`${subJsonArray["duration"]}`);
                clone.find(".cost").text(`$${subJsonArray["cost"]}`);
                //clone.find(".cost").addClass("cost-price");
                total += parseFloat(subJsonArray["cost"]);
                // enter details from durations in payment modal
                clone.appendTo(pricesHeader.parent());
              }
              //} later move in the dates and prices here.
              //var total = // for one booking
              summaryModal.find(".single-booking-price").text(`${total.toFixed(2)}`);
              firstModal.find("#subtotal-booking-number").text(no_of_bookings);
              if (no_of_bookings == 1) {
                var remove_plural = firstModal.find("#subtotal-booking-text").text().replace("bookings", "booking");
                firstModal.find("#subtotal-booking-text").text(remove_plural);
              }
              firstModal.find("#subtotal").text(`$${(total * no_of_bookings).toFixed(2)}`);
              total *= no_of_bookings
              console.log(parseFloat(total));
              console.log(parseFloat($("#discount").text().substr(2)));
              subtotal = parseFloat(total) - parseFloat($("#discount").text().substr(2));
              $("#totalAmount").text(`$${subtotal.toFixed(2)}`);
          } else {
            alert("Not enough bookings available!");
            e.stopPropagation();
          }
        });

        $("#payment-confirmation").on('shown.bs.modal', function(e) {
          hiddenModal.css('top', `-${$(this).find(".firstModal").height()}px`);
          hiddenModal.height(firstModal.height());
        });
     }

      // the four below are not currently used
      // build and return a paymentRequest Object that contains order details and customer info.
      function initPaymentRequest(costAndTimes) {
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
        var booking_types = ["off peak", "peak hour", "school holiday"]
        var booking_rates;
        var typeHolder;
        var counter = 1;
        var real_prices;
        var prices_json;
        var booking_rate;
        var booking_type;
        //console.log(costAndTimes);
        if (typeof(costAndTimes) == 'object') {
            total = (costAndTimes["Total"]).toFixed(2); // get the total cost
            delete costAndTimes.Total

            real_prices = document.querySelector('.real-price-holder').innerText
            prices_json = JSON.parse(real_prices);
             // calculate the individual booking period for peak, off-peak and school holiday
            var frequency_type = $("#payment-confirmation .booking").attr("data-booking-type");
            var pre_court_type = $("#payment-confirmation .booking").attr("data-court-type").split("C")[0];
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

                    booking_rates = prices_json[frequency_type][court_type]; // assigning casual/regular or half_court/full_court respectively
                    booking_rate = booking_rates[type]; // for assigning off_peak or peak_hour

                    booking_full_label = `${convertTimeIntoString(start_of_booking_type)} - ${convertTimeIntoString(end_of_booking_type)}`;
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

      // calculate the booking price assuming only casual half-court booking
      // based on peak and non-peak hours.
      // first function: collect all the relevant times for input into next function
      function calculateTotalPrice() {
        var peak_hours_text = document.querySelector(".peak-hour-holder").innerHTML;
        var daySelected = document.querySelector(".dateHolder").value.substr(0,3);
        var peak_hours_object = JSON.parse(peak_hours_text);
        var peak_starting_hour = peak_hours_object[daySelected]["startingPeakHour"];
        var peak_closing_hour = peak_hours_object[daySelected]["closingPeakHour"];
        var bookingStartTime = document.querySelector("input.startTime").value;
        var bookingEndTime = document.querySelector("input.endTime").value;
        //console.log(bookingStartTime, bookingEndTime, peak_starting_hour, peak_closing_hour);
        var costAndTimes = generateIncrements(bookingStartTime, bookingEndTime, peak_starting_hour, peak_closing_hour);
        //console.log(totalCost);
        return costAndTimes; // [totalCost, times outside the peak, times inside the peak period]
      }

      // iterate through the selected booking time at half-intervals and increment the total cost based on
      // whether the time lies within between the centre's peak hours.
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
        var real_prices = document.querySelector('.real-price-holder').innerText
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
        console.log(time_period_peak);
        console.log(time_period_off_peak);
        // iterate through the resulting peak and off peak array to check for non 0.5 intervals
        // if exists separate into a separate array within.
        time_period_off_peak = checkArray(time_period_off_peak);
        time_period_peak = checkArray(time_period_peak);
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
      //
      // slide in a modal from right to left upon clicking an right arrow in the first modal
      /* $("#payment-confirmation").on('shown.bs.modal', function(e) {
        //hiddenModal.css("margin-left", firstModal.width());
        //hiddenModal.width(firstModal.width());
        hiddenModal.find(".modal-body").height(firstModal.find(".modal-body").height()+16);
      }) */

      $("body").on("click", ".modal-body .caret", function() {
        hiddenModal.addClass('show');
      });
      $("body").on("click", ".back-arrow", function() {
        $(this).closest(".modal-content").removeClass("show");
      });

      // select the value for the confirm payment modal
      // confirm and send all the details from payment modal to polipay
      $('body').on("click", ".polipay", function() {
        var sports_centre_id = $('.slideHolder').attr("data-centre");
        var modal_content = $(this).closest('.modal-content');
        var customer_email = modal_content.find('input[type="email"]').val();
        var total_amount = modal_content.find("#totalAmount").text();
        var total_amount_float = total_amount.substr(1);
        var modal_body = modal_content.find(".modal-body");
        // assuming only one booking is made
        var booking_type = modal_body.attr("data-booking-type");
        //var booking_type = (parseInt(booking_number) > 1) ? "regular" : "casual"
        //modal_body.attr("data-booking-type", booking_type);
        // set the value of the court-type
        // later send number of bookings in params to controller
        var court_type = modal_body.attr("data-court-type");

        var startTime = modal_body.attr("data-booking-startTime");
        var endTime = modal_body.attr("data-booking-endTime");

        var arrayCourtIdsAndTimes = hiddenModal.find(".templateCourtRow");
        var stringIdTimes;
        var courtId;
        var startCourtTime;
        var endCourtTime;
        var courtIdsTimesArray = [];
        arrayCourtIdsAndTimes.each( function(index) {
            //courtIdsTimesArray = [];
            courtId = $(this).attr("data-courtId");
            startCourtTime = $(this).attr("data-startTime");
            endCourtTime = $(this).attr("data-endTime");
            stringIdTime = `${courtId}-${startCourtTime}-${endCourtTime}`;
            courtIdsTimesArray.push(stringIdTime);
        });
        //courtIdsTimesArray = courtIdsTimesArray);

        var booking_rate = modal_body.attr("data-booking-rate");
        var all_dates = [];
        var new_text;
        var first_day_bookings = [];
        //var length_first_day = arrayCourtIdsAndTimes.length; // get the number of bookings on the first day
        var arrayOfRegularCourtIds;
        if (booking_type == "regular") {
          arrayOfRegularCourtIds = $("#courtIdBody").attr("data-regularBookingCourtIds"); // array of courtIds for all regular bookings beside the first one.
          $('#allDatesModal .booking-dates p').each( function() {
            new_text = $(this).text().split(", ")[1];
            all_dates.push(new_text);
          });
        } else { // casual
          all_dates.push($("input.dateHolder").val())
          arrayOfRegularCourtIds = "[]";
        }
        first_day_bookings = all_dates.splice(0, 1);
        //console.log("all dates", all_dates);
        var daysInBetween = modal_body.attr("data-booking-interval");
        //console.log(arrayOfRegularCourtIds);
        arrayOfRegularCourtIds = JSON.parse(arrayOfRegularCourtIds);
        //var daysInBetween = modal_body.attr("data-booking-interval");
        // passing info about the order for reference when transaction completed successfully to later create booking


        $.ajax({
           type: "POST",
           url: `/api/v1/sports_centres/${sports_centre_id}/bookings/initiate`,
           data: {
             // all info specific to the overall order
             order: {
               totalAmount: total_amount_float,
               customerEmail: customer_email,
               allDates: all_dates, // all regular bookings after the first day, if any are present
               firstDayBookings: first_day_bookings,
               daysInBetween: daysInBetween,
               arrayOfRegularCourtIds: arrayOfRegularCourtIds
             }, // all info specific to a booking
             // decide how to assign the court number later on
             booking: {
               bookingType: booking_type, // casual or regular
               courtType: court_type, // half court or full court
               startTime: startTime,
               endTime: endTime,
               courtIdTimesArray: courtIdsTimesArray // an array of all the courts/times for a casual one day booking.
               //(not necessarily continuous in one court throughout.)
             }
              // info: info, // < note use of 'this' here
           },
           success: function(result) {
               alert('ok, what the hell');
           },
           error: function(result) {
               alert('error');
           }
         });
      });

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
            console.log("Intersection", intersection);
            hashSets[intersection.size] = [intersection, courtTimes];
          }

          timesToBeFilled = Object.keys(hashSets).sort()[0];
          courtFreeIds.push(hashSets[timesToBeFilled][1]); // store the courtId of the court that is free for most of the booking
          newSetBooking = hashSets[timesToBeFilled][0]; // get the set which will contain the times which still need a courtId for.
          courtTimeDifference = [...setBooking].filter(x => !newSetBooking.has(x)); // array
          setBooking = newSetBooking;

      //} while (intersection.size != 0);
          console.log("Court Timing", courtTimeDifference);
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

    // get largest continuous subArray
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

    // fill in payment details except for the cost
    function fillInPaymentModal() {
      // fill in the court type i.e. half-court // full-court
      var courtType;
      var modal_body = $("#payment-summary");
      var court_type_holder = modal_body.find(".courtType");
      var intervalBetweenBookings = parseInt($("#repeat-card .frequency-in-days").text());

      if ($('#nav-halfCourt-tab').hasClass("active")) {
        courtType = "halfCourt"; // half-court
        court_type_holder.text("Half Court");
      }
      if ($('#nav-fullCourt-tab').hasClass("active")) {
        courtType = "fullCourt"; // full-court
        court_type_holder.text("Full Court");
      }
      modal_body.attr("data-court-type", courtType);
      modal_body.attr("data-booking-interval", intervalBetweenBookings);

      // fill the startTime and endTimes.
      var startTime = $("input.startTime").val();
      var endTime = $("input.endTime").val();

      modal_body.attr("data-booking-startTime", startTime);
      modal_body.attr("data-booking-endTime", endTime);
      var bookingPeriod = modal_body.find("span.bookingPeriod");
      bookingPeriod.text(`${convertToAMPM(startTime)}-${convertToAMPM(endTime)}`);

      // if the number of bookings under repeat booking is more than one
      // then create the regular booking format, otherwise leave casual as default.
      var repeat_card = $("#repeat-card");
      var number_of_bookings = parseInt(repeat_card.find(".number-of-bookings").text());
      modal_body.attr("data-number-of-bookings", number_of_bookings);
      var booking_type = (number_of_bookings > 1) ? "regular" : "casual"
      modal_body.attr("data-booking-type", booking_type)

      var startDate = $("input.dateHolder").val();
      var weekday = startDate.split(" ")[0];
      // set the day for the first booking
      modal_body.find('#weekday').text(weekday);
      var startDateObject = new Date(startDate);
      // in either cases we must fill in the date for the first booking-row
      var booking_start_row = modal_body.find(".booking-row-start");
      var booking_end_row = modal_body.find(".booking-row-end");
      // to be used for filling in prices and booking dates
      //console.log(booking_start_row);
      //console.log(startDateObject);

      var bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
      console.log("Booking Matrix", bookingMatrix);
      var bookingCourtIds = calculateCourtIds(startTime, endTime, bookingMatrix);
      // assign court ids and period to the rows in details modal
      var courtIdBody = $("#allDatesModal").find("#courtIdBody");
      assignCourtIdToBox(courtIdBody, bookingCourtIds);

      assignDateToBox(booking_start_row, startDateObject); // assigned the start date to the first box/row
      // if a regular booking is selected

      // show the dates title in both cases where booking is regular or casual
      //var dates_title = $("#allDatesModal").find("#dates-title");
      //dates_title.removeClass("d-none");
      //dates_title.prev().removeClass("d-none");
      var dateTextHolder;
      var booking_dates_modal = $("#allDatesModal").find(".booking-dates");

      var dateHolder = $("#allDatesModal").find(".template").first();
      var divider = dateHolder.next();

      // create a deep copy of both
      var copiedDivider;
      var copiedDateHolder;

      if (number_of_bookings > 1) {

        // if a regular booking, we want to add more rows to the court id body using the array stored
        var arrayOfFreeCourtIds = $("#maxBookingsWarning").attr("data-arrayOfFreeCourtIds");
        arrayOfFreeCourtIds = JSON.parse(arrayOfFreeCourtIds);
        var shortenedFreeCourtArray = arrayOfFreeCourtIds.slice(0,number_of_bookings-1);
        courtIdBody.attr("data-regularBookingCourtIds", JSON.stringify(shortenedFreeCourtArray));
        var templateCourtRowCopy;// = courtIdBody.find(".templateCourtRow").first().clone();
        //var pTagCourtId;
        var startTimeAMPM = convertToAMPM(startTime);
        var endTimeAMPM = convertToAMPM(endTime);
        for (var index in shortenedFreeCourtArray) {
          //console.log(shortenedFreeCourtArray[index]);
          templateCourtRowCopy = courtIdBody.find(".templateCourtRow").first().clone();
          templateCourtRowCopy.removeClass("templateCourtRow");
          templateCourtRowCopy.find("p").text(`Court ${shortenedFreeCourtArray[index]}: ${startTimeAMPM}-${endTimeAMPM}`);
          templateCourtRowCopy.attr("data-courtId", shortenedFreeCourtArray[index]);
          templateCourtRowCopy.appendTo(courtIdBody);
          $("<hr class='my-0'>").appendTo(courtIdBody);
          //console.log(index);
        }
        // remove the review booking div (intended only for one booking)
        $("#single-booking-review").remove();
        // fill in the booking-number holder
        modal_body.find(".booking-number").text(number_of_bookings);
        modal_body.next().find(".booking-number").text(number_of_bookings); // for the subtotal

        var frequencyNode = repeat_card.find(".frequency input");
        modal_body.find(".frequencyHolder").text(frequencyNode.val());
        // calculate the ending date.
        // remove the d-none, reveal the second row
        var frequency = parseInt(repeat_card.find(".frequency-in-days").text());
        //var frequencyType = repeat_card.find(".days_and_weeks").children();
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

        modal_body.find(".range-divider").removeClass("d-none");
        booking_end_row.removeClass("d-none");

        assignDateToBox(booking_end_row, endDateObject);

        // fill in the dates for the regular bookings
        booking_dates_modal.empty();

        i = 0
        while (i < allDateHolder.length) {
          //alert(allDateHolder[i]);
          copiedDivider = divider.clone();
          copiedDivider.removeClass("d-none");
          copiedDateHolder = dateHolder.clone();
          copiedDateHolder.removeClass("d-none").addClass("d-flex");
          copiedDateHolder.find("p").text(allDateHolder[i]); // insert the calculated Date
          booking_dates_modal.append(copiedDateHolder);
          booking_dates_modal.append(copiedDivider);
          i++;
        }

      } else if (number_of_bookings == 1){
        // nothing
        booking_dates_modal.empty();
        dateTextHolder = startDateObject.toLocaleDateString('en-GB', { weekday: 'long', day:'numeric', month: 'long', year:'numeric'});
        copiedDateHolder = dateHolder.clone();
        copiedDivider = divider.clone();
        copiedDivider.removeClass("d-none");
        copiedDateHolder.removeClass("d-none").addClass("d-flex");
        copiedDateHolder.find("p").text(dateTextHolder); // insert the calculated Date
        booking_dates_modal.append(copiedDateHolder);
        booking_dates_modal.append(copiedDivider);
      }

    }

    function assignCourtIdToBox(courtBody, hashIds) {
      var templateCourtRow = courtBody.find(".templateCourtRow").first();
      var rowClone;
      var hrElement = courtBody.find("hr").first();
      var hrClone;
      var split;
      courtBody.empty();
      for (var courtId in hashIds) {
        rowClone = templateCourtRow.clone().removeClass("d-none");
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
});
