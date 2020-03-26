// The code for loading hit regions. Save for later reference if necessary.

/* canvas[0].addEventListener("click", function(event) {

  if(event.region == `bookableSlot ${startTime}`) {
    // get colour on click
      //console.log("clicked");
      imageData = ctx.getImageData(event.layerX, event.layerY, 1, 1);
    //console.log(Object.values(imageData["data"]));
      if (imageData["data"][0] == 178 && imageData["data"][1] == 255 &&
        imageData["data"][2] == 178 && imageData["data"][3] == 255) { // if time is already selected, deselect...
        /*  ctx.beginPath();
          ctx.arc(0, 0, radius-5, ((2*Math.PI*counter)+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24);
          ctx.lineTo(0,0);
          ctx.fillStyle = "white";
          ctx.fill();
          //console.log("Bookable spot: " + startTime);
      } else {
        startCounter = startTimeInput.getAttribute("data-counter");
        if (startCounter.length > 0) {// startTime selected, so draw arc to selected endTime {
          startTimeInterval = startTimeInput.getAttribute("data-interval");
          var intervalHolder = parseInt(startTimeInterval);
          var continuousBooking = true; // booking is continuous
          if (startTimeInterval.substring(2) == ".5") {
            intervalHolder += 0.5;
          }
          var startIntervalHolder = convertTimeIntoString(intervalHolder);
          var stringInterval;
          // intervalHolder is the decimal value of the starting time and interval is the decimal value of the endTime
          while (intervalHolder <= interval) {
            stringInterval = convertTimeIntoString(intervalHolder);
            if (bookingSchedule[stringInterval] == true) {
              continuousBooking = false;
              //console.log(continuousBooking);
              break;
            }
            //console.log(bookingSchedule[stringInterval], stringInterval, intervalHolder);
            intervalHolder += 0.5;
            //console.log(startTimeInterval, intervalHolder, interval);
          }
          //console.log(continuousBooking);
          if (continuousBooking == true && (convertTimeIntoString(intervalHolder) > startIntervalHolder)) { // indeed is continuous booking
            // and the second selected period - endTime - is greater than the startTime.
            startTimeInterval = startTimeInput.getAttribute("data-interval");
            endTimeInput.value = convertTimeIntoString(intervalHolder);

            currentBookings = JSON.parse(localStorage.getItem("currentBookings"));
            trueBookings = [];
            for (var time in currentBookings) {
                if (currentBookings[time]) {
                    trueBookings.push(time);
                }
            }
            setSelected = new Set(getIntervals(startTimeInput.value, endTimeInput.value));
            setBooked = new Set(trueBookings);
            arrayOverlap = [...setSelected].filter(time => setBooked.has(time)); // intersection of selected times and times already booked out

            if (arrayOverlap.length == 0) {
                drawClock(ctx, radius);
                ctx.beginPath();
                ctx.arc(0, 0, radius-5, ((2*Math.PI*(startCounter))+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24);
                ctx.strokeStyle = "rgba(0,128,0,1)";
                ctx.lineWidth = 8;
                ctx.stroke();
                ctx.lineTo(0,0);
                ctx.fillStyle = "rgba(0,255,0,0.3)";
                ctx.fill();
            } else {
              alert("Cannot Book this time!");
              clearTimeButton.click();
              //break;
            }
          }
          //intervalHolder += 0.5;
        } else { // startTime not selected, so select a startTime
          ctx.beginPath();
          ctx.arc(0, 0, radius-10, ((2*Math.PI*counter)+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24);
          ctx.lineTo(0,0);
          ctx.fillStyle = "rgba(0,255,0,0.3)";
          ctx.fill();
          startTimeInput.setAttribute("data-counter", counter);
          startTimeInput.setAttribute("data-interval", interval);
          //console.log(ctx.fillStyle);
          startTimeInput.value = startTime;
          endTimeInput.value = convertTimeIntoString(interval + 0.5);
        }
      }
        //console.log(event.layerX, event.layerY);
  }
});
*/
