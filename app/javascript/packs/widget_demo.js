
$(document).on('turbolinks:load', function ()  {

  if ($("#weBallWidget").length >= 1) {
                      //var greeting = $("#p1").text();
                      //alert(greeting);
                      //set the width and height of the canvas to match the parent
  // ------------------------- start datepicker.js -------------------------//
                      var mainClockCard = $("#BookingWidget #clockHolderCard");
                      var repeatCard = $("#BookingWidget #repeatBookingCard");
                      var canvas = mainClockCard.find("#canvas");

                      var mainCardWidth = mainClockCard.width();
                      var mainCardHeight = mainClockCard.outerHeight();
                      //console.log("height", mainCardHeight);
                    //  console.log("clock holder height", mainCardHeight);

                      document.querySelector("canvas#canvas").width = mainCardWidth;
                      document.querySelector("canvas#canvas").height = mainCardWidth;
                      repeatCard.height(mainClockCard.outerHeight());
                      repeatCard.css("margin-top", `-${mainClockCard.outerHeight()}px`);
                      // format the datepicker and display the date selected
                      var now = new Date();
                      //now.setHours(now.getHours() - 8);
                      var dateString;
                      var lastIndex;
                      // context and radius
                      var ctx = canvas[0].getContext("2d");
                      var radius = mainCardWidth / 2;
                      ctx.resetTransform();
                      ctx.translate(radius, (radius * 0.9)); //----------------------------------- uncomment if copying code to widget code.
                      radius = radius * 0.8;

                      var halfCourtTab = document.querySelector("#halfCourtTab");
                      var fullCourtTab = document.querySelector("#fullCourtTab");
                      dateString = now.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'});

                          // set initial date of regular booking
                          //lastIndex = dateString.lastIndexOf(" ");
                      var startDate = repeatCard.find("#startDate");
                      var bookings_array;
                      var bookingMatrix;
                      var bookingSchedule;
                      var formattedDate;
                      var stringFormattedDate;
                      var numberOfCourts;

                      startDate.val(dateString);
                      mainClockCard.find("#dateHolder").val(`${dateString} ${now.getFullYear()}`);

                      const circleHeight = parseFloat(radius*1.05).toFixed(2);
                      const circleWidth = parseFloat(radius*0.8).toFixed(2);
                      const circleRadius = parseFloat(radius*0.2).toFixed(2);

                      const canvas2 = document.querySelector("#BookingWidget #canvas");

                    //  console.log("Circle Width", circleWidth);
                      const circles = [
                        {
                          x: -circleWidth,
                          y: circleHeight,
                          radius: circleRadius,
                          id: "AM"
                        },
                        {
                          x: circleWidth,
                          y: circleHeight,
                          radius: circleRadius,
                          id: "PM"
                        }
                      ];

                      drawClock(ctx, radius);

                      var startTimeInput = document.querySelector("#startTime");
                      var endTimeInput = document.querySelector("#endTime");
                      var clearTimeButton = document.querySelector("#clearButton");

                          //alert("hey!");
                      $('[data-provide="datepicker"]').datepicker({
                         format: "DD, d MM yyyy",
                         todayHighlight: true,
                         autoclose: true,
                         clearBtn: true,
                         startDate: now.toLocaleDateString(),
                         maxViewMode: "years"
                      }).on('changeDate', function(e) {
                          //$(".startDate").val(($(this).datepicker('getFormattedDate')));
                         //repeatCard.attr("data-availabilityChecked", "false");
                         uncheckAvailability();
                         var fullDateString = $(this).datepicker('getFormattedDate');
                         if (fullDateString == "") {
                           console.log("empty date!");
                           return false;
                         }
                         lastIndex = fullDateString.lastIndexOf(" ");
                         dateString = fullDateString.substring(0, lastIndex);
                         startDate.val(dateString);

                         // get all the bookings from localStorage and parse them;
                         //drawClock(ctx, radius);
                         //halfCourtTab.removeEventListener("click", addListeners);
                         //fullCourtTab.removeEventListener("click", addListeners);

                         formattedDate = new Date(fullDateString);
                         //console.log(dateString);
                         stringFormattedDate = formattedDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                         replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

                         //console.log(stringFormattedDate);
                         bookings_array = JSON.parse(localStorage.getItem("bookings_array"));
                         bookingMatrix = createBookingMatrix(bookings_array, stringFormattedDate, numberOfCourts);
                         //console.log("matrix", bookingMatrix);
                         //console.log("date", stringFormattedDate);
                         //console.log("Half-Court schedule", bookingSchedule);
                         localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));

                         // adjust the min and max of valid input depending on the date chosen.
                         var currentDayAbbr = dateString.substr(0,3);
                         //console.log("abbr", currentDayAbbr);
                         var hoursToday = JSON.parse(localStorage.getItem("opening_hours"))[currentDayAbbr];
                         //console.log("hoursToday", hoursToday);
                         startTimeInput.setAttribute("min", convertAMPMToString(hoursToday["openingHour"]));
                         startTimeInput.setAttribute("max", convertAMPMToString(hoursToday["closingHour"]));
                         //console.log("hoursToday openingHour", hoursToday["openingHour"]);
                         endTimeInput.setAttribute("min", convertAMPMToString(hoursToday["openingHour"]));
                         endTimeInput.setAttribute("max", convertAMPMToString(hoursToday["closingHour"]));

                         halfCourtTab.addEventListener("click", function() {
                           //drawClock(ctx, radius);
                           bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
                           mainClockCard.find("#tabHolder").attr("data-courtType", "halfCourt");
                           bookingSchedule = check_availability("halfCourt", bookingMatrix);
                           localStorage.setItem("currentBookings", JSON.stringify(bookingSchedule));
                           if (canvas.attr('data-ampm') == 'AM') {
                              //console.log("AM now", now);
                               drawBookedTimes(ctx, radius, stringFormattedDate, bookingSchedule, 'AM');
                           } else {
                              //console.log("PM now", now.getHours());
                               drawBookedTimes(ctx, radius, stringFormattedDate, bookingSchedule, 'PM');
                           };
                           //canvas[0].addEventListener("click", function(event) {
                             //drawClock(ctx, radius);
                             //canvas.off("click", "**");
                             mainClockCard.attr("data-buttonsAttached", "false");
                             attachButtonFunctions(event, bookingSchedule, stringFormattedDate);
                           //});

                             fullCourtTab.classList.remove("active");
                             halfCourtTab.classList.add("active");
                             uncheckAvailability();
                         });

                         //console.log("full-Court schedule", bookingS);
                         fullCourtTab.addEventListener("click", function() {
                           // refer to local storage booking matrix each time.
                           bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
                           mainClockCard.find("#tabHolder").attr("data-courtType", "fullCourt");
                           bookingSchedule = check_availability("fullCourt", bookingMatrix);
                           //console.log("bookingSchedule", bookingSchedule);
                           localStorage.setItem("currentBookings", JSON.stringify(bookingSchedule));
                           if (canvas.attr('data-ampm') == 'AM') {
                               //console.log("AM now", now);
                               drawBookedTimes(ctx, radius, stringFormattedDate, bookingSchedule, 'AM');
                           } else {
                              //console.log("PM now", now);
                               drawBookedTimes(ctx, radius, stringFormattedDate, bookingSchedule, 'PM');
                           };
                           //canvas[0].addEventListener("click", function(event) {
                             //drawClock(ctx, radius);
                             //canvas.off("click", "**");
                             mainClockCard.attr("data-buttonsAttached", "false");
                             attachButtonFunctions(event, bookingSchedule, stringFormattedDate);
                           //});

                             halfCourtTab.classList.remove("active");
                             fullCourtTab.classList.add("active");
                             uncheckAvailability();
                         });

                         halfCourtTab.click();
                      });

                      // begin adding the drawClock functions.
                      function drawClock(ctx, radius) {

                        //console.log("radius", radius);
                        //var smallerRadius = radius * 0.80; // make clock slightly smaller than container
                        drawFace(ctx, radius);
                        drawNumbers(ctx, radius);
                        drawBottomButtons2(ctx, radius);
                        drawTime(ctx, radius, now);
                        //drawTime(ctx, radius);
                      }

                      // section for drawBottomButtons without addHitRegion -- start

                      function drawBottomButtons2(ctx, radius) {
                        //ctx.moveTo(-radius, radius);
                        // draw circle of left side;
                      //  console.log(circles);
                        circles.forEach( circle => {
                            ctx.beginPath();
                            ctx.arc(circle.x, circle.y, circle.radius, 0, 2*Math.PI);
                            ctx.strokeStyle = "white";
                            ctx.fillStyle = "white";
                            ctx.fill();
                            //ctx.addHitRegion({id: "AM"});
                            ctx.lineWidth = 2;
                            ctx.stroke();
                            //ctx.strokeStyle = "black";
                            ctx.fillStyle = "black";
                            //ctx.moveTo(0,0);
                            //console.log(circle.id);
                            ctx.fillText(circle.id, circle.x, circle.y);
                        });

                        // move to seperate function and only run once
                      }

                      function getMousePos(canvas2, evt) {
                          var rect = canvas2.getBoundingClientRect();
                          return {
                              x: ((evt.clientX - rect.left) / (rect.right - rect.left) * canvas2.width) - (canvas2.width/2),
                              y: ((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas2.height) - (0.45 * canvas2.height)
                          };
                      }

                      function isIntersect(point, circle) {
                      //  console.log("point", point);
                      //  console.log("circle", circle);
                        return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
                      }
                      // section for drawBottomButtons without addHitRegion -- end

                      function drawFace(ctx, radius) {
                        //var grad;
                      //  console.log("face-radius", radius);
                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, 2*Math.PI);
                        ctx.strokeStyle = "black";
                        ctx.fillStyle = 'white';
                        ctx.fill();
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.arc(0, 0, radius*0.025, 0, 2*Math.PI);
                        ctx.fillStyle = 'black';
                        ctx.fill();
                      }

                      function drawNumbers(ctx, radius) {
                        var ang;
                        var num;
                        ctx.font = radius*0.15 + "px arial";
                        ctx.textBaseline="middle";
                        ctx.textAlign="center";
                        ctx.fillStyle = 'black';
                        for(num = 1; num < 13; num++){
                          ang = num * Math.PI / 6;
                          ctx.rotate(ang);
                          ctx.translate(0, -radius*0.80);
                          ctx.rotate(-ang);
                          ctx.fillText(num.toString(), 0, 0);
                          ctx.rotate(ang);
                          ctx.translate(0, radius*0.80);
                          ctx.rotate(-ang);
                        }
                      }

                      /* old drawBottomButtons function using addHitRegion
                      function drawBottomButtons(ctx, radius) {
                        //ctx.moveTo(-radius, radius);
                        // draw circle of left side;
                        ctx.beginPath();
                        ctx.arc(-radius*0.8, radius*1.05, radius * 0.2, 0, 2*Math.PI);
                        ctx.strokeStyle = "white";
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.addHitRegion({id: "AM"});
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        //ctx.strokeStyle = "black";
                        ctx.fillStyle = "black";
                        //ctx.moveTo(0,0);
                        ctx.fillText("AM", -radius*0.8, radius*1.05);

                        // draw circle of the right side;
                        ctx.beginPath();
                        ctx.arc(radius*0.8, radius*1.05, radius * 0.2, 0, 2*Math.PI);
                        ctx.strokeStyle = "white";
                        ctx.fillStyle = "white";
                        ctx.fill();
                        ctx.addHitRegion({id: "PM"});
                        ctx.lineWidth = 2;
                        ctx.stroke();
                        //ctx.strokeStyle = "black";
                        ctx.fillStyle = "black";
                        //ctx.moveTo(0,0);
                        ctx.fillText("PM", radius*0.8, radius*1.05);

                      } */

                      function drawTime(ctx, radius, now) {
                        var hour = now.getHours();
                        var minute = now.getMinutes();

                        hour = hour%12;
                        hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60));
                        drawHand(ctx, hour, radius*0.65, radius*0.03);
                        ctx.lineCap = "butt";
                      }

                      function drawHand(ctx, pos, length, width) {
                          ctx.beginPath();
                          ctx.lineWidth = width;
                          ctx.lineCap = "round";
                          ctx.moveTo(0,0);
                          ctx.rotate(pos);
                          ctx.lineTo(0, -length);
                          ctx.strokeStyle = "black";
                          ctx.stroke();
                          ctx.rotate(-pos);
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

                      // insert function to calculate availability based on bookings and the date given.
                      // date in "YYYY-MM-DD" format string
                      function createBookingMatrix(bookedArray, date, numberOfCourts) {
                        // cut down the array of bookings to contain only those bookings that match the selected date.
                        // no distinction made between fullCourt and halfCourt bookings
                        // filter out all the reservations with null id and longer than 2min creation time
                        var isExpiredReservation2;
                        var currentTime = new Date();
                        var minutesPastReservation;
                        var bookingsByDate = bookedArray.filter(function(booking) {
                           minutesPastReservation = (currentTime - Date.parse(booking.created_at))/60000;
                           isExpiredReservation2 = ((booking.id == null) && (minutesPastReservation > 15));
                           return ((booking.date == date) && !isExpiredReservation2);
                        });

                        var outerArray = [];
                        var subArray;
                        var counter4;
                        var courtCounter = 1;
                        var bookingsByDateAndCourt;

                        // treat all bookings as halfCourt and create the booking Matrix
                        while (courtCounter <= numberOfCourts) {
                          //subArray = [];
                          counter4 = 0;
                          bookingsByDateAndCourt = bookingsByDate.filter(function(booking) {return booking.court_no == courtCounter});
                          //console.log(bookingsByDateAndCourt);
                          subArray = [];
                          while (counter4 < bookingsByDateAndCourt.length) {
                            subArray.push(calculateTimes(bookingsByDateAndCourt[counter4]));
                            counter4++;
                          }
                          courtCounter++;
                          outerArray.push(subArray.flat());
                        }

                        // account for all full court bookings by adding the same times to the next/adjacent court.
                        var bookingsByFullCourt = bookingsByDate.filter(function(booking) {return booking.courtType == "fullCourt"});
                        //console.log("full court", bookingsByFullCourt);
                        var fullCourtBooking;
                        for (var index in bookingsByFullCourt) {
                          fullCourtBooking = bookingsByFullCourt[index];
                          outerArray[fullCourtBooking.court_no] = outerArray[fullCourtBooking.court_no].concat(calculateTimes(fullCourtBooking));
                        }
                        //console.log("This is the outerArray", outerArray);
                        var arrayBooked = outerArray;
                        //localStorage.setItem("BookingsMatrix", JSON.stringify(arrayBooked));
                        return arrayBooked;
                      }

                      // using the currently stored booking matrix
                      function check_availability(courtType, bookingMatrix) {
                          var outerBookingsArray = bookingMatrix;
                          var setA;
                          var setB;
                          var union;
                          var oddCounter
                          var length = outerBookingsArray.length;
                          var fullCourtArray = [];
                          if (courtType == "fullCourt") {
                            oddCounter = 0;
                            while ((oddCounter + 1) < length) {
                              setA = new Set(outerBookingsArray[oddCounter]);
                              setB = new Set(outerBookingsArray[oddCounter+1]);
                              union = new Set([...setA, ...setB]);
                              fullCourtArray.push(Array.from(union));
                              oddCounter += 2;
                            }
                            if ((length % 2) != 0) { // if the number of courts is odd and has an extra half court
                              fullCourtArray.push(outerBookingsArray[length - 1]);
                            }
                            outerBookingsArray = fullCourtArray;
                          }
                          //console.log("fullCourtArray", outerBookingsArray);
                          // initialise a hash of courts times (courtsBooked) and set first all times to true
                          var courtsBooked = new Object();
                          var availability = ["06:00", "06:30", "07:00", "07:30", "08:00",
                          "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                          "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00",
                          "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
                          "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00",
                          "22:30", "23:00", "23:30"];
                          var counter = 0;
                          while (counter < availability.length) {
                            courtsBooked[availability[counter]] = true;
                            counter++;
                          }

                          var set1 = new Set(Object.keys(courtsBooked));
                          var set2; // for the subArray of outerBookingsArray
                          var difference; // the times that do not overlap.
                          counter = 0;

                          while (counter < outerBookingsArray.length) {
                            counter2 = 0;
                            set2 = new Set(outerBookingsArray[counter]); // counter
                            difference = ([...set1].filter(x => !set2.has(x))); // get all the times not booked for each court.
                            //console.log("this is difference:", difference);
                            while (counter2 < difference.length) { //counter
                              //console.log(arrayBooked[counter]);
                                // counter3 = 0;
                              courtsBooked[difference[counter2]] = false;
                              counter2++;
                            }
                            counter++;
                          }

                          return courtsBooked; // array of hash will be true if no half-courts available at that time.
                      }

                      function calculateTimes(booking) {
                        var arrayOfTimes = []
                        //var time;
                        var start = new Date(booking.startTime.slice(0,-1));
                        //var time = start;
                        var finish = new Date(booking.endTime.slice(0,-1));
                        // var count = 10
                        while (start.getTime() != finish.getTime()) {
                          //time = start.strftime("%R")
                          arrayOfTimes.push(start.toLocaleTimeString().slice(0,5));
                          //return arrayOfTimes
                          start = new Date(start.setMinutes( start.getMinutes() + 30));
                        //  count--;
                        }
                        return arrayOfTimes;
                      }

                      function drawHalfHourBooking(ctx, radius, startTime, colour, bookingSchedule) {
                          // if '30' exists in time, replace with five, otherwise leave as is
                          // then parse string into a decimal to be divided by 0.5 intervals
                          var newTime = startTime.replace(':3', ':5').replace(':', '.');
                          var interval = parseFloat(newTime);
                          var counter = (interval/0.5) - 6;
                          var imageData;
                          var currentBookings;
                          var trueBookings = [];
                          var setSelected;
                          var setBooked;
                          var arrayOverlap;
                        //  var startTimeInput = document.querySelector(".startTime");
                        //  var endTimeInput = document.querySelector(".endTime");
                          var startTimeInterval;
                          var startCounter;

                        //  var endTimeData = $(".endTime");
                          //console.log(counter);
                          ctx.beginPath();
                          ctx.arc(0, 0, radius-5, ((2*Math.PI*counter)+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24);
                          ctx.strokeStyle = colour;
                          ctx.lineWidth = 8;
                          ctx.stroke();

                          if (colour == "rgba(0,128,0,1)") { // green aka. open for bookings
                            ctx.lineTo(0,0);
                            ctx.fillStyle = "transparent";
                            //ctx.arc(0, 0, radius-20, ((2*Math.PI*counter)+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24);
                            //ctx.arc(0, 0, radius/2, ((2*Math.PI*counter)+0.2)/24, ((2*Math.PI*(counter+1))-0.2)/24); // repeat the same arc.
                            ctx.fill();
                            //ctx.addHitRegion({ id: `bookableSlot ${startTime}` });
                          }
                            //console.log("bookableSlot filled");
                          //var clicked = false;

                          // ------ addHitRegion.js code goes here. ------
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

                      function drawBookedTimes(ctx, radius, dateSelected, bookingSchedule, meridiem) {
                        //console.log("schedule", bookingSchedule);
                        drawClock(ctx, radius);

                        //var now = new Date();
                        //console.log("now", now);
                        //var dateSelected = document.querySelector("#dateHolder").value;
                        var dateSelectedFormatted = new Date(dateSelected); //.toLocaleDateString();

                        var nowDate = now.toLocaleDateString();
                        var transparentRed = "rgba(255,0,0,1)";
                        var transparentGreen = "rgba(0,128,0,1)";

                        //var days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                        //var currentDay = days[now.getDay()];
                        //var sports_centre = JSON.parse('<%= @sports_centre.to_json.html_safe %>');
                        // fix
                        var jsonOpeningHours = JSON.parse(localStorage.getItem("opening_hours"));
                        var weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        var weekDay = weekDays[dateSelectedFormatted.getDay()];
                        var openingHour = convertAMPMToString(jsonOpeningHours[weekDay]["openingHour"]);//sports_centre["opening_hours"][currentDay]["openingHour"];
                        var closingHour = convertAMPMToString(jsonOpeningHours[weekDay]["closingHour"]);//sports_centre["opening_hours"][currentDay]["closingHour"];
                        //console.log(JSON.stringify(jsonOpeningHours));
                      //  console.log("open", openingHour);
                      //  console.log("close", closingHour);
                        var currentTime = now.toTimeString().substring(0,5);
                        //console.log(halfCourtsBooked);

                        // re
                        //var nowDateRearranged = nowDate.split("/");

                        //var newDateSelected = dateSelectedFormatted.toLocaleDateString().split("/");
                        //console.log(nowDate, dateSelectedFormatted.toLocaleDateString());
                        if (nowDate == dateSelectedFormatted.toLocaleDateString()) {
                          if (now.getMinutes() >= 30) {
                            currentTime = currentTime.replace(currentTime.substr(2), ":30");
                            // console.log(now.getMinutes());
                          } else {
                            currentTime = currentTime.replace(currentTime.substr(2), ":00");
                          }
                        } else { // if not equal, then must be greater
                          currentTime = "00:00" // so time will always be greater and all bookings will be shown.
                        }
                        //console.log(currentTime);
                        if (meridiem == 'AM') {
                        // iterate over times; if book shade in red an half-hour arc
                          //drawClock();
                          for (const time in bookingSchedule) {
                            if ((time < "12:00") && (time >= openingHour) && (time >= currentTime)) {
                              //console.log(time, openingHour);
                              if (bookingSchedule[time] == true) {
                                drawHalfHourBooking(ctx, radius, time, transparentRed, bookingSchedule);
                              } else {
                                drawHalfHourBooking(ctx, radius, time, transparentGreen, bookingSchedule);
                              }
                              //console.log(time);
                            }
                          }
                        } else {
                          //drawClock();
                          for (const time in bookingSchedule) {
                            if (time >= "12:00" && (time < closingHour) && (time >= currentTime)) {
                              if (bookingSchedule[time] == true) {
                                drawHalfHourBooking(ctx, radius, time, transparentRed, bookingSchedule);
                                //console.log("Booked");
                              } else {
                                drawHalfHourBooking(ctx, radius, time, transparentGreen, bookingSchedule);
                              }
                            }
                          }
                        }
                      }

                      function attachButtonFunctions(event, bookingSchedule, dateSelected) {
                          //canvas.off();
                          canvas.off('click', attachCode);
                          if (mainClockCard.attr("data-buttonsAttached") == "false") {
                              canvas.on('click', {bookingSchedule: bookingSchedule, dateSelected: dateSelected}, attachCode);
                              mainClockCard.attr("data-buttonsAttached", "true");
                          };
                      }

                      function attachCode(e) {
                            var dateSelected = e.data.dateSelected;
                            var bookingSchedule = e.data.bookingSchedule;

                            var pos = getMousePos(canvas2, e);
                            var boundingRect = canvas2.getBoundingClientRect();
                            //console.log(pos);
                            if (isIntersect(pos, circles[0])) {
                              //alert(dateSelected);
                              drawBookedTimes(ctx, radius, dateSelected, bookingSchedule, 'AM');
                              canvas.attr('data-ampm', 'AM');
                            }
                            if (isIntersect(pos, circles[1])) {
                              //alert(dateSelected);
                              drawBookedTimes(ctx, radius, dateSelected, bookingSchedule, 'PM');
                              canvas.attr('data-ampm', 'PM');
                            }
                      }

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

                      function convertAMPMToString(ampmTime) {
                         var newTime;
                         console.log(ampmTime);
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

                      function bookings_live_update(sports_centre_id) {
                        console.log(sports_centre_id);
                        var source = new EventSource(`https://weball.com.au/sub/${sports_centre_id}`);
                        var updated_bookings_array;
                        var clean_bookings_array;
                        var no_courts;
                        var currentDate;
                        var currentFormattedDate;
                        var activeTab;
                        var decodedData;
                        source.onopen = function() {
                           activeTab = document.querySelector("#tabHolder .tab.active");
                           console.log('connection to stream has been opened');

                           no_courts = localStorage.getItem("numberOfCourts");
                           currentDate = new Date(document.querySelector("#dateHolder").value);
                           currentFormattedDate = currentDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                           replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

                           clean_bookings_array = JSON.parse(localStorage.getItem("bookings_array"));
                           /* clean_bookings_array = clean_bookings_array.filter(function(booking) {
                             minutesSinceBooked = (nowDate - Date.parse(booking.created_at))/60000;
                             isExpiredReservation = (minutesSinceBooked > 2) && (booking.id == null);
                             return !isExpiredReservation;
                           }); */

                           //localStorage.setItem("bookings_array", JSON.stringify(clean_bookings_array));
                           bookingMatrix = createBookingMatrix(clean_bookings_array, currentFormattedDate, no_courts);
                           localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));

                           activeTab.click();
                        };
                        source.onerror = function (error) {
                          console.log('An error has occurred while receiving stream', error);
                        };
                        source.onmessage = function (event) {
                          console.log('received stream');
                          console.log(event);
                          decodedData = JSON.parse(event.data);
                          no_courts = localStorage.getItem("numberOfCourts");
                          currentDate = new Date(document.querySelector("#dateHolder").value);
                          currentFormattedDate = currentDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                          replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
                          activeTab = document.querySelector("#tabHolder .tab.active");
                          var reserved_bookings;
                          var current_bookings;
                          var isExpiredReservation;
                          var minutesSinceBooked;
                          var nowDate;
                          var utcDate;
                          var reservationTimeLocalSecs;
                          current_bookings = JSON.parse(localStorage.getItem("bookings_array"));

                          if (decodedData.event == "live_update") {
                            updated_bookings_array = decodedData.bookings;
                            localStorage.setItem("bookings_array", updated_bookings_array);
                            bookingMatrix = createBookingMatrix(JSON.parse(updated_bookings_array), currentFormattedDate, no_courts);
                            localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
                            console.log("updated EventSource check stringify bookings_array", updated_bookings_array);
                          } else if (decodedData.event == "live_reservation_remove") {
                            console.log("live_remove");
                            utcDate = new Date(decodedData.reservationTime).toISOString();
                            current_bookings = current_bookings.filter( function(booking) {
                                return booking.updated_at != utcDate;
                            });
                            console.log(    "removed reservation!", current_bookings);
                            localStorage.setItem("bookings_array", JSON.stringify(current_bookings));
                            bookingMatrix = createBookingMatrix(current_bookings, currentFormattedDate, no_courts);
                            localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
                          } else if (decodedData.event == "live_reservation_update") {
                            nowDate = new Date();

                            reserved_bookings = (decodedData.bookings === Array) ? decodedData.bookings : JSON.parse(decodedData.bookings);
                            //console.log("" reserved_bookings);
                            // check if the user just clicked on the reserve button, if so do not add this reservation to the bookings array
                            reservationTimeLocalSecs = JSON.parse(localStorage.getItem("reservationTime"));
                            if (reservationTimeLocalSecs != null) {
                                utcDate = new Date(parseInt(reservationTimeLocalSecs)).toISOString();
                                // filter out the old bookings.
                                console.log("reservationTime", utcDate);
                                for (var reservation in reserved_bookings) {
                                    if (reserved_bookings[reservation].updated_at != utcDate) {
                                        current_bookings.push(reserved_bookings[reservation]);
                                    } else {
                                       console.log("match! My booking");
                                    }
                                    console.log(reserved_bookings[reservation]);
                                }
                            } else { // no reservation time is set, meaning the user running this website did not recently just make a reservation
                                for (var reservation in reserved_bookings) {
                                    current_bookings.push(reserved_bookings[reservation]);
                                }
                            }

                            console.log(current_bookings);
                            current_bookings = current_bookings.filter(function(booking) {
                               minutesSinceBooked = (nowDate - Date.parse(booking.created_at))/60000;
                               isExpiredReservation = (minutesSinceBooked > 15) && (booking.id == null);
                               return !isExpiredReservation;
                            });
                            console.log("updated! current_bookings", current_bookings);

                            localStorage.setItem("bookings_array", JSON.stringify(current_bookings));

                            bookingMatrix = createBookingMatrix(current_bookings, currentFormattedDate, no_courts);
                            localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
                            console.log("reservation_update!");

                          } else {
                          }
                          activeTab.click();
                        };
                      }

                      // enable the clear time button
                      // fetch booking data for a particular sports centre.
                      var sportsCentreId = document.querySelector("#weBallWidget").getAttribute("data-sportsCentreId");
                      //document.cookie = `widget_centre_id=${sportsCentreId}`;
                      var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/check_availability`, "GET");
                      //request.responseType = "json";
                      request.responseType = "json";
                      //request.timeout = 2000;
                      request.onload = function(e) {
                          var response = request.response;
                          var nowFormattedDate = now.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                          replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

                          //console.log(response); // get response["prices"]
                          // store the peak hour times in a div above book-now for reference.
                          var peak_hour_holder = mainClockCard.find("#peak-hour-holder");
                          //console.log("peakHours", response["peak_hours"]);
                          peak_hour_holder.attr("data-peak-hours", JSON.stringify(response["peak_hours"]));
                          // store the prices in a div for reference in the widget sinces its easier.
                          console.log("logoURL", response["logo_url"]);
                          if (response["logoURL"] != false) {
                            mainClockCard.find("#bw-brand").attr("src", response["logo_url"]);
                          }
                          console.log("sports centre title", response["sports_centre_title"])
                          //var real_price_holder = mainClockCard.find("#real-price-holder");
                          //real_price_holder.attr("data-prices", JSON.stringify(response["prices"]));
                          console.log("This is the plan type", response["plan_type"]);
                          var plan_type = response["plan_type"];
                          if (plan_type == 0) { // free plan
                              mainClockCard.find("#timeHolder").toggle();
                              mainClockCard.find("#bookNowButton").toggle();
                              mainClockCard.find("#clearButton").toggle();
                              repeatCard.height(mainClockCard.outerHeight());
                              repeatCard.css("margin-top", `-${mainClockCard.outerHeight()}px`);
                          }
                          // copy and insert more image icons in the activity selection bar depending on the number of activities in prices.
                          //var jsonPrices = JSON.parse(response["prices"]);
                          var cloneIcon;
                          var cloneSrc;
                          var activitySelector = mainClockCard.find("#activitySelector");
                          var jsonPrices = response["prices"];
                          console.log("Activity prices", response["prices"]);
                          for (var activity in jsonPrices) {
                            // insert an image icon
                              cloneIcon = activitySelector.find("img.activityIcon").eq(0).clone();
                              cloneIcon.attr("src", `https://weball.com.au/${activity}.png`);
                              cloneIcon.removeClass("bw-none");
                              cloneIcon.attr("data-activity", activity);
                              //cloneIcon.attr("data-prices", jsonPrices[activity]);
                              cloneIcon.appendTo(activitySelector);
                          }

                          // add click listener on icons
                          var activityHolder;
                          var activityType;
                          activitySelector.on("click", "img.activityIcon", function(){
                              activityHolder = activitySelector.find("#activityHolder");
                              activityType = $(this).attr("data-activity");
                              $(this).siblings().each( function() {
                                  $(this).removeClass("selectedIcon");
                              });
                              $(this).addClass("selectedIcon");
                              activityHolder.text(activityType);
                              console.log("jsonPrices", jsonPrices[activityType]);
                              mainClockCard.find("#real-price-holder").attr("data-prices", JSON.stringify(jsonPrices[activityType]));
                          });
                          activitySelector.find("img[data-activity='basketball']").click();

                          numberOfCourts = response["number_of_courts"];
                          localStorage.setItem("numberOfCourts", numberOfCourts);
                          localStorage.setItem("bookings_array", response["json_bookings"]);

                          // store the opening hours in local storage too.
                          //console.log(response);
                          localStorage.setItem("opening_hours", response["opening_hours"]);

                          // attach opening hours limits on inputs.
                          var currentDayAbbr = document.querySelector("#dateHolder").value.substr(0,3);
                          //console.log("abbr", currentDayAbbr);
                          var hoursToday = JSON.parse(response["opening_hours"])[currentDayAbbr];
                          //console.log("hoursToday", hoursToday);

                          startTimeInput.setAttribute("min", convertAMPMToString(hoursToday["openingHour"]));
                          startTimeInput.setAttribute("max", convertAMPMToString(hoursToday["closingHour"]));
                          //console.log("hoursToday openingHour", hoursToday["openingHour"]);

                          endTimeInput.setAttribute("min", convertAMPMToString(hoursToday["openingHour"]));
                          endTimeInput.setAttribute("max", convertAMPMToString(hoursToday["closingHour"]));

                          // retrieve the opening and closing hour for the selected date
                          // generate the bookings availability for todays date when page first loads.
                          bookings_array = JSON.parse(response["json_bookings"]);
                          bookingMatrix = createBookingMatrix(bookings_array, nowFormattedDate, numberOfCourts);
                          //var bookingSchedule;
                          //console.log("matrix", bookingMatrix);
                          // set up the half court tab - am and pm buttons
                          //console.log("halfCourt", bookingSchedule);
                          localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
                          // create a continuous connection with the localhost
                          bookings_live_update(sportsCentreId);

                          if (now.getHours() < 12) {
                               canvas.attr('data-ampm', 'AM');
                          } else {
                               canvas.attr('data-ampm', 'PM');
                          };

                          halfCourtTab.addEventListener( "click", function() {
                            //drawClock(ctx, radius);
                            //console.log("halfCourt", bookingSchedule);
                            bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
                            mainClockCard.find("#tabHolder").attr("data-courtType", "halfCourt");
                            bookingSchedule = check_availability("halfCourt", bookingMatrix);
                            localStorage.setItem("currentBookings", JSON.stringify(bookingSchedule));

                            if (canvas.attr('data-ampm') == 'AM') {
                                drawBookedTimes(ctx, radius, now, bookingSchedule, 'AM');
                            } else {
                                drawBookedTimes(ctx, radius, now, bookingSchedule, 'PM');
                            };
                            //canvas[0].addEventListener("click", function(event) {
                              //drawClock(ctx, radius);
                              //canvas.off("click", "**");
                              mainClockCard.attr("data-buttonsAttached", "false");
                              attachButtonFunctions(event, bookingSchedule, now);
                            //});

                            fullCourtTab.classList.remove("active");
                            halfCourtTab.classList.add("active");
                          });
                           //addListeners(ctx, radius, now, bookingSchedule) );
                          //halfCourtTab.click();

                          // set up the full court tab - am and pm buttons
                          // right now, booking schedule only returns the array hash for half court availability.
                          fullCourtTab.addEventListener( "click", function() {
                            //
                            bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
                            mainClockCard.find("#tabHolder").attr("data-courtType", "fullCourt");
                            //console.log(mainClockCard.find("#tabHolder")[0]);
                            bookingSchedule = check_availability("fullCourt", bookingMatrix);
                            localStorage.setItem("currentBookings", JSON.stringify(bookingSchedule));

                            if (canvas.attr('data-ampm') == 'AM') {
                                drawBookedTimes(ctx, radius, now, bookingSchedule, 'AM');
                            } else {
                                drawBookedTimes(ctx, radius, now, bookingSchedule, 'PM');
                            };
                            //canvas[0].addEventListener("click", function(event) {
                              //canvas.off("click", "**");
                              mainClockCard.attr("data-buttonsAttached", "false");
                              attachButtonFunctions(event, bookingSchedule, now);
                            //});

                            halfCourtTab.classList.remove("active");
                            fullCourtTab.classList.add("active");
                          });

                          halfCourtTab.click();
                      }
                      request.send();

                      clearTimeButton.addEventListener("click", function(event) {

                        var currentDateString = document.querySelector("#dateHolder").value;
                        var currentDate = new Date(currentDateString);
                        //console.log(dateString);
                        var formattedCurrentDate = currentDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                        replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

                        startTimeInput.setAttribute("data-counter", "");
                        startTimeInput.setAttribute("data-interval", "");
                        startTimeInput.value = "";
                        endTimeInput.value = "";
                        startTimeInput.style.borderColor = "initial";
                        endTimeInput.style.borderColor = "initial";

                        //bookingMatrix = createBookingMatrix(bookings_array, stringFormattedDate, numberOfCourts);

                        var currentTab = document.querySelector("#tabHolder .active").id.replace("Tab", "");
                        //bookingSchedule = check_availability(currentTab, bookingMatrix);
                        //console.log(bookingSchedule);
                        var bookingSchedule = JSON.parse(localStorage.getItem("currentBookings"));
                        //console.log(bookingSchedule2);
                        //drawClock(ctx, radius);
                        if (canvas.attr('data-ampm') == 'AM') {
                          drawBookedTimes(ctx, radius, formattedCurrentDate, bookingSchedule, 'AM');
                        } else {
                          drawBookedTimes(ctx, radius, formattedCurrentDate, bookingSchedule, 'PM');
                        };

                      });
  //------------------------------------ end datepicker.js  --------------------//

  //------------------------------------ start repeatCard.js  --------------------//

                      $('#BookingWidget').on("click", ".days-and-weeks button", function() {
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

                      $('#BookingWidget').on("click", ".addAndMinus .minus-button", function() {
                        number = parseInt($(this).next().text());
                        var isFrequencyRow = $(this).closest(".form-row").is("#frequencyRow");
                        var minNumber = isFrequencyRow ? 0 : 1;
                        if (number > minNumber) {
                          number -= 1;
                          $(this).next().text(number);
                          input = $(this).closest(".form-row").find("input");
                          //console.log(input);
                          inputArray = input.attr("placeholder").split(" ");
                          //console.log(inputArray);
                          if (number == 1) {
                            if (isFrequencyRow) {
                                inputString = `${inputArray[0]} ${inputArray[inputArray.length - 1]}`;
                            } else {
                              inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}`;
                            }
                          } else {
                            inputString = `${inputArray[0]} ${number} ${inputArray[inputArray.length - 1]}s`;
                          }

                          if (number == minNumber) {
                            inputString = "";
                          }

                          input.val(inputString);
                        }
                        //console.log(number);
                      });

                      $('#BookingWidget').on("click", ".addAndMinus .plus-button", function() {
                        number = parseInt($(this).prev().text());
                        if (number < 52) {
                          number += 1;
                          $(this).prev().text(number);
                          input = $(this).closest(".form-row").find("input");

                          inputArray = input.attr("placeholder").split(" ");
                          console.log(inputArray);
                          if (number == 1) {
                            if ($(this).closest(".form-row").is("#frequencyRow")) {
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

                      $('#BookingWidget .repeat').one("click", function() {
                        repeatCard.height(mainClockCard.outerHeight());
                        repeatCard.css("margin-top", `-${mainClockCard.outerHeight()}px`);
                        repeatCard.css("transition", "all 1s");
                      });

                      $('#BookingWidget').on("click", ".repeat", function() {
                        $("#repeatBookingCard").css("margin-left", "0%");
                      });

                      $('#BookingWidget').on("click", ".back-arrow-booking", function() {
                        $(this).closest(".card").css("margin-left", "100%");
                      });

                      repeatCard.on("click", "#frequencyRow button", function() {
                          uncheckAvailability();
                      });
                      //------------------------------------ end repeatCard.js  --------------------//


                      //------------------------------------ start paymentModal.js  --------------------//


                      var modal_body = $('#payment-confirmation');
                      var reviewDetailModal = $('#secondModalCard');
                      var bw = $("#BookingWidget");

                      var timeHolder = bw.find("#timeHolder");
                      var timeInputs = timeHolder.find("input");
                      timeHolder.on("input", "input",  function() {
                          $(this).css("border-color", "initial");
                      });
                      timeHolder.on("change", "input",  function() {
                          if (repeatCard.attr("data-regularBooking") == "true") { // all details for regular booking entered
                              repeatCard.attr("data-availabilityChecked", "false");
                          }
                      });

                      var dateHolder = bw.find("#dateHolder");
                      bw.on("change", "#dateHolder", function() {
                            if ($(this).val() != "") {
                                $(this).css("border-color", "initial");
                            }
                      });

                      bw.on("click", "#bookNowButton", function(e) {
                        // set height of hidden modal to same as first modal

                        var rightNow = new Date();

                        if (dateHolder.val() == "") {
                            dateHolder.css("border-color", "red");
                            return false;
                        }

                        var dateChosen = new Date(dateHolder.val());
                        var nowHHSS = (rightNow < dateChosen) ? "00:00" : rightNow.toLocaleTimeString().substr(0,5);
                        // if current time is less than chosen date, remove constraint
                        // if greater or equal, dateChosen must be today so add constraint.
                        var maxBookings = bw.find("#maxBookingsWarning").attr("data-maxBookings");
                        var bookingsRequested = bw.find(".number-of-bookings").text();

                        var firstInput = timeInputs.eq(0);
                        var secondInput = timeInputs.eq(1);
                        var firstInputValue = firstInput.val();
                        var secondInputValue = secondInput.val();

                        // check if both or one time inputs are empty and highlight red.
                        var inputError = false;

                        if (  ( firstInputValue == '') || ( parseInt(firstInputValue.substr(-2)) % 30 != 0 ) || (firstInputValue < firstInput.attr("min")) ||
                              (firstInputValue < nowHHSS) || (firstInputValue > firstInput.attr("max"))  ) {

                              firstInput.css("border-color", "red");
                              inputError = true;
                        }
                        if (  ( secondInputValue == '') || ( parseInt(secondInputValue.substr(-2)) % 30 != 0 ) ||
                              (secondInputValue < secondInput.attr("min")) || (secondInputValue < nowHHSS) ||
                              (secondInputValue > secondInput.attr("max")) || (firstInputValue >= secondInputValue)  ) {

                              secondInput.css("border-color", "red");
                              inputError = true;
                        }

                        if (inputError) {
                            return false;
                        }
                         // check first input value is out of range or is before the current time
                         // check second input value is out of range or is before the current time or is below the first input value
                        if (parseInt(bookingsRequested) <= parseInt(maxBookings)) {
                              if ((repeatCard.attr("data-availabilityChecked") == "false") & (repeatCard.attr("data-regularBooking") == "true")) {
                                  alert("Check Availability before making a regular booking.");
                                  return false;
                              }
                              fillInPaymentModal();

                              var dateSelected = new Date(bw.find("#dateHolder").val());//.val().substr(0,3) // abbr

                              var total_cost = calculateTotalPrice(dateSelected);
                              console.log("Total Cost", total_cost)
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
                              for (var counter in jsonArray) {
                                subJsonArray = jsonArray[counter];
                                clone = pricesHeader.clone();
                                clone.removeClass("prices-header");
                                //console.log(subJsonArray["time"]);
                                newTypeString = subJsonArray["type"].replace("_", " ");
                                clone.find(".bw-time").text(subJsonArray["time"]);
                                clone.find(".bw-rate").text(`${newTypeString} ($${subJsonArray["rate"]}/hr)`);
                                clone.find(".bw-hours").text(`${subJsonArray["duration"]}`);
                                clone.find(".bw-hours").addClass("bw-text-center");
                                clone.find(".bw-cost").text(`$${subJsonArray["cost"]}`);
                                //clone.find(".cost").addClass("cost-price");
                                //total += parseFloat(subJsonArray["cost"]);
                                // enter details from durations in payment modal
                                $("<hr class='my-0 bw-margin0 bw-negRem'>").appendTo(pricesHeader.parent());
                                clone.appendTo(pricesHeader.parent());
                              }
                              var total = 0;
                              var singleFloatPrice;
                              var arraySingleDatePrices = modal_body.find("p.datePriceHolder").slice(1);
                              arraySingleDatePrices.each( function() {
                                  singleFloatPrice = parseFloat($(this).text().slice(1));
                                  total += singleFloatPrice;
                              });

                              modal_body.find("#single-booking-price").text(`$${(total/bookings_count).toFixed(2)}`);
                              //firstModal.find("#subtotal-booking-number").text(no_of_bookings);
                              if (parseInt(bookings_count) == 1) {
                                var remove_plural = modal_body.find("#subtotal-booking-text").text().replace("bookings", "booking");
                                modal_body.find("#subtotal-booking-text").text(remove_plural);
                              }
                              console.log(total, bookings_count, "subtotal amount");
                              modal_body.find("#subtotal").text(`$${total.toFixed(2)}`);
                              //total *= bookings_count;
                              //console.log(parseFloat(total));
                              //console.log(parseFloat(modal_body.find("#discount").text().substr(2)));
                              subtotal = total - parseFloat(modal_body.find("#discount").text().substr(2));
                              $("#totalAmount").text(`$${subtotal.toFixed(2)}`);

                              var heightModal = modal_body.find("#firstModalCard").outerHeight();
                              //modal_body.find("#bw-bookingSummary").css("max-height", heightModal);
                              var modalFooterHeight = reviewDetailModal.find("#bw-secondModalFooter").outerHeight() +
                              reviewDetailModal.find("#bw-secondModalHeader").outerHeight();
                              // for the second slide-in modal
                              reviewDetailModal.find("#bw-secondModalBody").css("height", heightModal - modalFooterHeight);
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
                                  new_text = $(this).text().split(", ")[1];
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
                                  courtId = $(this).attr("data-courtId");
                                  startCourtTime = $(this).attr("data-startTime");
                                  endCourtTime = $(this).attr("data-endTime");
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
                              $("#firstModalCard").on("click", "#polipayInfo", function() {
                                    $("#polipayFooter").toggle();
                              });

                              $("#firstModalCard").on("click", "#reservationInfo", function() {
                                    $("#reservationFooter").toggle();
                              });
                              //console.log(paramsText);
                              var sportsCentreId = document.querySelector("#weBallWidget").getAttribute("data-sportsCentreId");
                              modal_body.on("click", "#bw-reservation", function() {
                                var freeCourtIdsReview = checkAvailability(daysInBetween, startTime, endTime);
                                console.log(freeCourtIdsReview, bookings_count);
                                if (freeCourtIdsReview.length < parseInt(bookings_count)) {
                                    alert("Your preferred booking time is no longer available. Please try again.");
                                    return false;
                                }
                                var reservationTime = Date.parse(new Date());
                                var reservationTimeParams = { reservation_time: reservationTime };
                                var myIdentityText = addParams( "myIdentity", reservationTimeParams );
                                localStorage.setItem("reservationTime", reservationTime);
                                //var request = makeCORSRequest(`http://localhost:3000/api/v1/sports_centres/114/bookings/reserve`, "POST");
                                var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/reserve`, "POST");
                                //*****var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/initiate`, "POST");
                                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                // store reservation time so you identify the bookings the customer personally makes.
                                request.send(`${paramsOrderText}&${paramsBookingText}&${myIdentityText}`);
                                request.onload = function(e) {
                                  var response = request.response;
                                  //var redirect_url = response["redirect_url"];
                                  var parsedResponse = JSON.parse(response);
                                  console.log("parsed reservation response", parsedResponse);
                                  if (parsedResponse.success) {
                                    console.log("Success");
                                      $("#firstModalCard #bw-reservationPreFooter").addClass("bw-none");
                                      $("#firstModalCard #bw-polipayPreFooter").removeClass("bw-none");
                                  }
                                  //*****var redirect_url = parsedResponse["redirect_url"];
                                  //window.location.href = redirect_url;
                                  //*****window.location.replace(redirect_url);
                                }
                              })

                              modal_body.on("click", "#polipay", function() {
                                var freeCourtIdsReview = checkAvailability(daysInBetween, startTime, endTime);
                                console.log(freeCourtIdsReview, bookings_count);
                                var nowPayTime = Date.now(); // current time in milliseconds
                                var clickedReservationTime = parseInt(localStorage.getItem("reservationTime"));
                                var tooLong = (((nowPayTime - clickedReservationTime)/60000) > 2);
                                if (freeCourtIdsReview.length < parseInt(bookings_count)) {
                                    alert("Your preferred booking time is no longer available. Please select another time to book.");
                                    $("#modalClose").trigger("click");
                                    return false;
                                }

                                if (tooLong) {
                                    console.log("Difference in times clicked", ((nowPayTime-clickedReservationTime)/60000));
                                    alert("Time (2 minutes) taken to proceed to the next step has elapsed. Try again.");
                                    $("#modalClose").trigger("click");
                                    return false;
                                }
                                //var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/reserve`, "POST");
                                var request = makeCORSRequest(`https://weball.com.au/api/v1/sports_centres/${sportsCentreId}/bookings/initiate`, "POST");
                                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                                request.onload = function(e) {
                                  var response = request.response;
                                  //var redirect_url = response["redirect_url"];
                                  console.log(response);
                                  var parsedResponse = JSON.parse(response);
                                  var redirect_url = parsedResponse["redirect_url"];
                                  window.location.href = redirect_url;
                                  window.location.replace(redirect_url);
                                }
                                request.send(`${paramsOrderText}&${paramsBookingText}`);
                              })
                          } else {
                              // ((parseInt(bookingsRequested) <= parseInt(maxBookings)) &&
                              // all cases under else deals with regular bookings since all single bookings will have equal.
                              if (repeatCard.attr("data-availabilityChecked") == "false") {
                                  alert("Check Availability before making a regular booking.");
                              } else { // availability checked; therefore must be due to requested bookings exceeding the number available.
                                  alert("Not enough spaces available.");
                              }
                              e.stopPropagation();
                          }
                      });

                      modal_body.on("click", "#modalClose", function() {
                        modal_body.find("#bw-polipayPreFooter").addClass("bw-none");
                        modal_body.find("#bw-reservationPreFooter").removeClass("bw-none");
                        modal_body[0].style.display='none';
                        var reservationTimeNumber = parseInt(localStorage.getItem("reservationTime"));
                        $.post(`https://weball.com.au/pub/${sportsCentreId}`, JSON.stringify({
                          event: "live_reservation_remove",
                          reservationTime: reservationTimeNumber,
                        }));
                      })

                      modal_body.on("click", ".back-arrow", function() {
                        reviewDetailModal.css("margin-left", "100%");
                      });

                      modal_body.on("click", ".trigger-detail-modal", function() {
                        modal_body.find("#polipayFooter").css("display", "none");
                        reviewDetailModal.css("margin-left", "0%");
                      });
                      // fill in payment details except for the cost
                      /* function showPolipayInfo() {

                          $("#firstModalCard #polipayFooter").removeClass("bw-non

                      function hidePolipayInfo() {
                          $("#firstModalCard #polipayFooter").addClass("bw-none");
                      } */

                      function decodeUrlData(urlData) {
                        var jsonHolder = {};
                        var subJsonHolder;
                        decodedData = decodedData.split("&");
                        for (var i in decodedData) {
                             subJsonHolder = decodedData[i].split("=");
                             jsonHolder[subJsonHolder[0]] = subJsonHolder[1];
                        }
                        // note all values are treated as string values regardless;
                        return jsonHolder;
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

                      /* make a Cors request
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
                      } */

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

                      function calculateTotalPrice(bookingDatesSelected) {
                        var peak_hours_text = bw.find("#peak-hour-holder").attr("data-peak-hours");
                        var daySelected = bookingDatesSelected.toLocaleDateString("en-au", {weekday: "short"}); // abbr
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

                      /*
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
                      } */

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

                        //var intervalBetweenBookings = parseInt($("#repeatBookingCard .frequency-in-days").text());

                        // assign half court or half court to item in modal
                        if ($('#halfCourtTab').hasClass("active")) {
                          courtType = "halfCourt"; // set item to half-court
                          court_type_holder.text("Half Court");
                        }
                        if ($('#fullCourtTab').hasClass("active")) {
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
                        //var repeat_card = $("#repeat-card");
                        // get number of bookings
                        var number_of_bookings = parseInt(bw.find(".number-of-bookings").text());
                        modal_body.attr("data-number-of-bookings", number_of_bookings);
                        // also enter the number of bookings in subtotal.

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
                        if (bookingCourtIds == false) {
                            alert("Booking is invalid");
                            return false
                        } else { // no overlap
                            modal_body[0].style.display='block';
                        }
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
                          modal_body.find("#subtotal-booking-text").text(`Subtotal (${number_of_bookings} bookings)`);

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
                            $("<hr class='my-0 bw-margin0 bw-negRem'>").appendTo(courtIdBody);
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
                          var allPriceHolder = [];
                          var peakIndicatorHolder = [];
                          var containsPeakTimes;
                          var singleBookingPrice;
                          var casualBookingPrice;
                          while (i < number_of_bookings) {
                            //console.log(intervalDateObject, "intervalDateObject");
                            singleBookingPrice = calculateTotalPrice(intervalDateObject);
                            //console.log(singleBookingPrice, "single booking price");
                            dateTextHolder = intervalDateObject.toLocaleDateString('en-GB', { weekday: 'long', day:'numeric', month: 'long', year:'numeric'});
                            //alert(dateTextHolder);
                            // calculate individual price.
                            allDateHolder.push(dateTextHolder);
                            allPriceHolder.push(`$${singleBookingPrice["Total"].toFixed(2)}`);

                            containsPeakTimes = (singleBookingPrice["peak_hour"].length != 0);
                            console.log(containsPeakTimes, "isPeakTime");
                            peakIndicatorHolder.push(`${containsPeakTimes}`);
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
                            copiedDateHolder.find("p.singleDateHolder").text(allDateHolder[j]); // insert the calculated Date
                            copiedDateHolder.find("p.datePriceHolder").text(allPriceHolder[j]); // insert the calculated Date
                            if (peakIndicatorHolder[j] == "true") {
                              copiedDateHolder.addClass("bg-aliceBlue");
                            } //console.log(peakIndicatorHolder[j], typeof(peakIndicatorHolder[j]), "peakness");
                            booking_dates_modal.append(copiedDateHolder);
                            booking_dates_modal.append(copiedDivider);
                            j++;
                          }

                        } else if (number_of_bookings == 1){
                          // nothing
                          modal_body.find("#subtotal-booking-text").text(`Subtotal (${number_of_bookings} booking)`);
                          booking_end_row.addClass("bw-none");
                          calendarDivider.addClass("bw-none");
                          singleReview.removeClass("bw-none");
                          booking_dates_modal.empty();
                          dateTextHolder = startDateObject.toLocaleDateString('en-GB', { weekday: 'long', day:'numeric', month: 'long', year:'numeric'});
                          copiedDateHolder = dateHolder.clone();
                          copiedDivider = divider.clone();
                          copiedDivider.removeClass("bw-none");
                          copiedDateHolder.removeClass("bw-none");

                          casualBookingPrice = calculateTotalPrice(startDateObject);
                          casualBookingPriceTotal = casualBookingPrice["Total"];
                          copiedDateHolder.find("p.singleDateHolder").text(dateTextHolder); // insert the calculated Date
                          copiedDateHolder.find("p.datePriceHolder").text(`$${casualBookingPriceTotal.toFixed(2)}`);
                          if (casualBookingPrice["peak_hour"].length != 0) {
                            copiedDateHolder.addClass("bg-aliceBlue");
                          }
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
                        var validBooking;
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
                            validBooking = getLargestSubArray(courtTimeDifference);
                            if (validBooking != false) {
                                courtFreePeriods.push(validBooking);
                            } else {
                                return false;
                            }
                        //return courtFreeIds;
                        /*console.log("Times that still need filling", timesToBeFilled);
                        console.log("id of the best matching court", courtFreeIds);
                        console.log("Times that still need a court to accomodate", setBooking);
                        *///console.log("HashSets", hashSets);
                      } while(timesToBeFilled != 0);
                        console.log("court free periods", courtFreePeriods)
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
                        var validBooking;
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
                            //console.log("HashSets", hashSets);
                            //console.log("Times to be filled", timesToBeFilled);
                            //console.log("hash sets", hashSets);
                            //console.log("times to be filled", timesToBeFilled);
                            courtFreeIds.push(hashSets[timesToBeFilled][1]); // store the courtId of the court that is free for most of the booking
                            newSetBooking = hashSets[timesToBeFilled][0]; // get the set which will contain the times which still need a courtId for.
                            courtTimeDifference = [...setBooking].filter(x => !newSetBooking.has(x)); // array
                            setBooking = newSetBooking;

                        //} while (intersection.size != 0);
                            validBooking = getLargestSubArray(courtTimeDifference);
                            if (validBooking != false) {
                                courtFreePeriods.push(validBooking);
                            } else {
                                return false;
                            }
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
                      /*
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
                      } */

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
                        //console.log(longestSubBooking);
                        if (longestSubBooking.length >= 1) {
                          var startSubBooking = convertToAMPM(convertTimeIntoString(longestSubBooking[0]));
                          var endSubBooking = convertToAMPM(convertTimeIntoString(longestSubBooking[longestSubBooking.length - 1] + 0.5));
                          finalString = `${startSubBooking}-${endSubBooking}`
                          return finalString
                        } else {
                          //alert("Booking not valid");
                          return false;
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

                      function uncheckAvailability() {
                          var maxBookingsHolder = repeatCard.find("#maxBookingsWarning");
                          maxBookingsHolder.text("");
                          maxBookingsHolder.attr("data-arrayOfFreeCourtIds", "");
                          maxBookingsHolder.attr("data-maxBookings", "1");
                          repeatCard.attr("data-availabilityChecked", "false");
                      }

                      function checkAvailability(daysInterval, startTime, endTime) {
                          console.log("logging the args", daysInterval, startTime, endTime);
                          var allBookings = JSON.parse(localStorage.getItem("bookings_array"));
                          //console.log(allBookings);

                          var date = bw.find("#dateHolder").val();

                          var courtType = bw.find("#tabHolder").attr("data-courtType"); // set courtType later on click
                          var numberOfCourts = parseInt(localStorage.getItem("numberOfCourts"));
                          var arrayOfFreeCourtIds = [];

                          //console.log(allBookings);
                          var arrayOfArrays = extract_relevant_days(allBookings, date, daysInterval, startTime, endTime);
                          // after extracting the relevant days; let us filter the bookings so that only bookings matching the relevant dates remain.
                          var courtIdFree = null;
                          for (var bookingsOfOneSelectedDate in arrayOfArrays) {
                            //if (arrayOfArrays[bookingsOfOneSelectedDate].length != 0) { an array containing all the bookings in one day, which matches a regular booking day
                              courtIdFree = checkDayAvailability(arrayOfArrays[bookingsOfOneSelectedDate], startTime, endTime, numberOfCourts) // return boolean depending on whether a court is free on that particular day
                              // add courtType later
                              console.log("selected days", courtIdFree);
                              if (courtIdFree == null) {
                                break
                              } else {
                                arrayOfFreeCourtIds.push(courtIdFree);
                              }
                          }
                          console.log("free Court Ids", arrayOfFreeCourtIds);
                          return arrayOfFreeCourtIds;
                      }

                      // remove all the repeat booking details
                      // slide back to the first main card.
                      repeatCard.on("click", "#returnToSingleButton", function() {
                          //repeatCard.attr("data-availabilityChecked", "false");
                          repeatCard.find("#frequencyButtons button").removeClass("btn-selected");

                          repeatCard.find("#frequencyBottomRow .frequency-in-days").text("0");
                          repeatCard.find("#endDateBottomRow .number-of-bookings").text("1");
                          repeatCard.find("#frequencyRate").val("");
                          repeatCard.find("#endDate").val("");
                          repeatCard.css("margin-left", "100%");

                          uncheckAvailability();
                          repeatCard.attr("data-regularBooking", "false");
                      });

                      bw.on("click", "#checkAvailabilityButton", function() {
                        // call functions to check 10 bookings ahead of time.
                          //var timeInputsAgain = timeHolder.find("input");
                          var startTime = bw.find("input#startTime").val();
                          var endTime = bw.find("input#endTime").val();
                          var dateValue = bw.find("#dateHolder").val();

                          var bookingNumber = parseInt(bw.find(".frequency-in-days").text());
                          var bookingRealNumber = parseInt(bw.find("#endDateBottomRow .number-of-bookings").text());
                          if ((startTime == "") || (endTime == "") || (bookingNumber < 1) || (bookingRealNumber < 2) || (dateValue == "")) {
                              bw.find("#maxBookingsWarning").text("Incomplete Details");
                          } else {
                              var bookingInput = bw.find("#frequencyRate").attr("data-frequency-type");
                              var interval_in_days = (bookingInput == "Days") ? bookingNumber : (bookingNumber * 7); // get interval in days
                              var freeCourtIds = checkAvailability(interval_in_days, startTime, endTime);
                              var maxNoBookings = freeCourtIds.length; // max-bookings, count the number of extra bookings ahead and include the current/first booking
                              var maxContainer = bw.find("#maxBookingsWarning");
                              maxContainer.text(`Max. ${maxNoBookings} bookings available`);
                              maxContainer.parent().removeClass("bw-none");
                              maxContainer.attr("data-maxBookings", maxNoBookings);
                              maxContainer.attr("data-arrayOfFreeCourtIds", JSON.stringify(freeCourtIds));

                              repeatCard.attr("data-availabilityChecked", "true");
                              repeatCard.attr("data-regularBooking", "true");
                          }
                      });

                      // add on click listener later.

                      function checkDayAvailability(arrayOfHash, startTime, endTime, numberOfCourts) {
                      //  console.log("start", startTime);
                      //  console.log("end", endTime);
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
                              //console.log("hash", hashSetTime, arrayOfHash[hashBooking]);
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

                      function extract_relevant_days(bookings, date, interval_in_days, startTime, endTime) {
                          var counter = 0;
                          var regularDate = new Date(date);
                          var stringDate;
                          var arrayOfDates = [];
                          var arrayOfArrays = [];
                          var weekdayShort;
                          var dayClosingHour;
                          var openingHours = JSON.parse(localStorage.getItem("opening_hours"));
                          // check all dates for a regular booking up to ten bookings ahead
                          while (counter < 10) {
                            arrayOfDates = [];
                            stringDate = regularDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
                            replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
                            //console.log("missing link stringDate", stringDate);
                            weekdayShort = regularDate.toLocaleString('en-au', {weekday: 'short'});
                            //console.log(stringDate);
                            dayClosingHour = convertAMPMToString(openingHours[weekdayShort]["closingHour"]);

                            if ((startTime > dayClosingHour) || (endTime > dayClosingHour)) {
                               break;
                            }
                            // iterate through all bookings and add those matching one day to a subarray
                            for (var jsonBooking in bookings) {
                                if (bookings[jsonBooking]["date"] == stringDate) {
                                    arrayOfDates.push(bookings[jsonBooking]);
                                }
                            }
                            arrayOfArrays.push(arrayOfDates); // add to larger array if found
                            //arrayOfDates.push(stringDate);
                            regularDate.setDate(regularDate.getDate() + parseInt(interval_in_days));
                            counter++;
                          }
                          // returns array of Arrays aka (where all days that have bookings on the same as the regular booking appear).
                          return arrayOfArrays;
                      }

                      //------------------------------------ end paymentModal.js  --------------------//


    };
});
