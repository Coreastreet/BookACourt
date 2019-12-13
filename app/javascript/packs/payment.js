document.addEventListener('DOMContentLoaded', function(){

  var stripe = Stripe('pk_test_N75DfmVdVk3b8FE5JMbkrgfY00sngv9GrB');

  if ($(".book-now").length > 0) {
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

    //payButton.setAttribute('style', 'display: none;');
    if (window.PaymentRequest) {
      let request = initPaymentRequest();
      //payButton.setAttribute('style', 'display: inline;');
      payButton.addEventListener('click', function() {
        //alert("working");
        // check that the startTime and the endTime has both been selected.
        // fix later
        var start = document.querySelector("input.startTime");
        var end = document.querySelector("input.endTime");
        if ((start.value == "") || (end.value == "")) {
          start.classList.add("is-invalid");
          end.classList.add("is-invalid");
          return;
        }

        var total_cost = calculateTotalPrice();
        //alert(total_cost);
        request = initPaymentRequest(total_cost);
        onBuyClicked(request);
      });
    } else {
      console.log('This browser does not support web payments');
    }

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
        //console.log(costAndTimes);
        if (typeof(costAndTimes) == 'object') {
            total = (costAndTimes[0]).toFixed(2); // get the total cost
            real_prices = document.querySelector('.real-price-holder').innerText
            prices_json = JSON.parse(real_prices);
             // calculate the individual booking period for peak, off-peak and school holiday
            while (counter < costAndTimes.length) {
              booking_array = costAndTimes[counter];
              if (booking_array.length != 0) {
                console.log(booking_array.length);
                start_of_booking_type = booking_array[0];
                end_of_booking_type = booking_array[booking_array.length - 1] + 0.5;
                booking_duration = end_of_booking_type - start_of_booking_type;

                booking_rates = prices_json["casual"]["half_court"];
                typeHolder = booking_types[counter-1].replace(/\s/g, "_");
                booking_rate = booking_rates[typeHolder];

                booking_full_label = `Booking ( ${booking_types[counter-1]} ) ${convertTimeIntoString(start_of_booking_type)} - ${convertTimeIntoString(end_of_booking_type)}`;

                tempObject = { label: booking_full_label, amount: {currency: "AUD", value: `${booking_rate * booking_duration}`} }
                //console.log(tempObject);
                objectsArray.push(tempObject);
              } // else do not register as a part of the final checkout detail;
              counter++;
            }
            console.log(objectsArray);
            //booking_off_peak =  `Booking ( off-peak hour ) ${convertTimeIntoString(start_of_off_peak_booking)} - ${convertTimeIntoString(start_of_off_peak_booking)}`
            //console.log(convertTimeIntoString(start_of_off_peak_booking), convertTimeIntoString(end_of_off_peak_booking));
            //alert(total);
            let networks = ['amex', 'diners', 'discover', 'jcb', 'mastercard', 'unionpay',
                'visa', 'mir'];
            let types = ['debit', 'credit', 'prepaid'];
            let supportedInstruments = [{
              supportedMethods: 'basic-card',
              data: {supportedNetworks: networks, supportedTypes: types},
            }];

            let details = {
              total: {label: 'Total cost', amount: {currency: 'AUD', value: total}},
              displayItems: objectsArray,
            };

            let options = {
              requestPayerName: true,
              requestPayerPhone: true,
              requestPayerEmail: true,
            };

            return new PaymentRequest(supportedInstruments, details, options);
          }
      }

      // display the paymentRequest object.
      function onBuyClicked(request) {
        request.show().then(function(paymentResponse) {
          sendPaymentToServer(paymentResponse);
        })
        .catch(function(err) {
          console.log(err);
        });
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
        return costAndTimes;
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
            // check if decimal start is equal to or greater than peakStartTime
            // check also if decimalStart less than peakEndTime
            if (decimalStart >= peakStartTime && decimalStart <= peakEndTime) {
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
        //console.log(time_period_peak, time_period_off_peak);
        return [totalCost, time_period_off_peak, time_period_peak];
      }

      //
      function sendPaymentToServer(paymentResponse) {

          window.setTimeout(function() {
            paymentResponse.complete('success')
                .then(function() {
                  //document.getElementById('result').innerHTML =
                      //paymentToJsonString(paymentResponse);
                      console.log(paymentResponse);
                })
                .catch(function(err) {
                  console.log(err);
                });
          }, 2000);
        }
    }
});
