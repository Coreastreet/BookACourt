import consumer from "./consumer"

$(document).on('turbolinks:load', function () {

  if ($("#id-holder").length > 0) {
        consumer.subscriptions.create({
          channel: "DashboardChannel",
          sports_centre_id: parseInt(document.querySelector("#id-holder").getAttribute("data-sports-centre-id"))
          }, {
          connected() {
          	console.log("Connected!");
            // Called when the subscription is ready for use on the server
          },

          disconnected() {
            // Called when the subscription has been terminated by the server
            console.log("Disconnected!");
          },

          received(data) { // data equal to bookings
             console.log("Recieved Data");
             console.log(data);
             var currentDateNumbers = document.querySelector("#my_hidden_input").value.split("/");
          	 var bookingHash = data.filter((booking) => (booking.date == `${currentDateNumbers[2]}-${currentDateNumbers[0]}-${currentDateNumbers[1]}`));
             insertNewBooking(bookingHash[0]);
             $("#NotificationModal").slideDown("slow", "swing");
             setTimeout(function() {
               $("#NotificationModal").slideUp("slow", "swing");
             }, 3000);
            // Called when there's incoming data on the websocket for this channel
           }
         });
    }

    function convertToAMPM(timeString) {
      var hours_and_minutes = timeString.split(":");
      var parsed_int = parseInt(hours_and_minutes[0]);
      var int = (parsed_int % 12 == 0) ? 12 : parsed_int % 12;
      var am_or_pm = (hours_and_minutes[0] >= 12) ? "PM" : "AM";
      return `${int}:${hours_and_minutes[1]}${am_or_pm}`
    }

    function insertNewBooking(booking) {
          var j = 0;
          var booking_start = booking.startTime.substr(11,5);
          var booking_end = booking.endTime.substr(11,5);
          console.log("start", booking_start);
          console.log("end", booking_end);
          var columnArray = document.querySelectorAll(`[data-court="${booking.court_no}"]`);
          var nextColumnArray;
          var booked = false;
          var counter = 0;
          if (booking.courtType == "halfCourt") {
                console.log(booking.courtType);
                while (j < columnArray.length) {
                  if (columnArray[j].dataset.time == booking_start) {
                    booked = true;
                  }
                  if (columnArray[j].dataset.time == booking_end) {
                    booked = false;
                  }
                  if (booked) {
                    columnArray[j].classList.add(`table${booking.sportsType}`, "booked");
                    columnArray[j].setAttribute("data-toggle", "tooltip");
                    columnArray[j].setAttribute("title", `${booking.name}\nType: ${booking.sportsType}\nStart:`
                    + ` ${convertToAMPM(booking_start)}\nEnd: ${convertToAMPM(booking_end)}`);
                    //columnArray[j].setAttribute("data-placement", "top");
                    if (counter == 0) {  // first selected td.
                        columnArray[j].innerHTML = `<div>${booking.name}</div>` + "<div class='delete-booking'" + `data-booking-id=${booking.id} data-order-id=${booking.order_id}>&times</div>`
                        columnArray[j].classList.add("textHolder");
                        counter++;
                    }
                  }
                  j++;
                }
           } else if (booking.courtType == "fullCourt") {
                console.log(booking.courtType)
               nextColumnArray = document.querySelectorAll(`[data-court="${booking.court_no + 1}"]`);
               while (j < columnArray.length) {
                 if (columnArray[j].dataset.time == booking_start) {
                   booked = true;
                 }
                 if (columnArray[j].dataset.time == booking_end) {
                   booked = false;
                 }
                 if (booked) {
                   columnArray[j].classList.add(`table${booking.sportsType}`, "booked");
                   nextColumnArray[j].classList.add(`table${booking.sportsType}`, "booked");
                   if (counter == 0) {  // first selected td.
                       columnArray[j].innerHTML = `<div>${booking.name}</div>`;
                       columnArray[j].classList.add("textHolder");
                       nextColumnArray[j].innerHTML = "<div></div><div class='delete-booking'" + `data-booking-id=${booking.id} data-order-id=${booking.order_id}>&times</div>`;
                       nextColumnArray[j].classList.add("textHolder");
                       counter++;
                   }
                 }
                 j++;
               }
           }
        }

});
