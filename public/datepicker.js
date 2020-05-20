//set the width and height of the canvas to match the parent
var mainClockCard = BookingWidget.$("#BookingWidget #clockHolderCard");
var repeatCard = BookingWidget.$("#BookingWidget #repeatBookingCard");
var canvas = mainClockCard.find("#canvas");


var mainCardWidth = mainClockCard.width();
var mainCardHeight = mainClockCard.outerHeight();
console.log("height", mainCardHeight);

canvas.width(mainCardWidth);
canvas.height(mainCardWidth);
repeatCard.height(mainCardHeight);
repeatCard.css("margin-top", `-${mainCardHeight}px`);

// format the datepicker and display the date selected
var now = new Date();
//now.setHours(now.getHours() - 8);
var dateString;
var lastIndex;
// context and radius
var ctx = canvas[0].getContext("2d");
var radius = canvas.height() / 2;
ctx.translate(radius, (radius * 0.9));
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

console.log("Circle Width", circleWidth);
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

// fetch booking data for a particular sports centre.
var sportsCentreId = document.querySelector("#weBallWidget").getAttribute("data-sportsCentreId");
// assign the src url of the sportsCentre logo.
mainClockCard.find("#bw-brand").attr("src", `https://weball.com.au/system/sports_centre_logo_${sportsCentreId}`);
    //alert("hey!");
var chosenIconCourtsAllowed;

BookingWidget.$('[data-provide="datepicker"]').datepicker({
   format: "DD, d MM yyyy",
   todayHighlight: true,
   autoclose: true,
   //clearBtn: true,
   startDate: now.toLocaleDateString(),
   maxViewMode: "years"
}).on('changeDate', function(e) {
    //$(".startDate").val(($(this).datepicker('getFormattedDate')));
   uncheckAvailability();
   var fullDateString = BookingWidget.$(this).datepicker('getFormattedDate');
   if (fullDateString == "") {
     console.log("empty date!");
     return false;
   }
   //console.log(dateString);
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

   bookings_array = JSON.parse(localStorage.getItem("bookings_array"));

   //console.log(stringFormattedDate);
   chosenIconCourtsAllowed = mainClockCard.find("#activitySelector img.selectedIcon").attr("data-courtsAllowed");
   bookingMatrix = createBookingMatrix(bookings_array, stringFormattedDate, numberOfCourts, chosenIconCourtsAllowed);
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
     console.log("full court", bookingSchedule);
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

function uncheckAvailability() {
    var maxBookingsHolder = repeatCard.find("#maxBookingsWarning");
    maxBookingsHolder.text("");
    maxBookingsHolder.attr("data-arrayOfFreeCourtIds", "");
    maxBookingsHolder.attr("data-maxBookings", "1");
    repeatCard.attr("data-availabilityChecked", "false");
}

// begin adding the drawClock functions.
function drawClock(ctx, radius) {

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
  console.log(circles);
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
  console.log("point", point);
  console.log("circle", circle);
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}
// section for drawBottomButtons without addHitRegion -- end

function drawFace(ctx, radius) {
  //var grad;
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
function createBookingMatrix(bookedArray, date, numberOfCourts, selectedIconCourts) {
  // cut down the array of bookings to contain only those bookings that match the selected date.
  // no distinction made between fullCourt and halfCourt bookings
  //var bookingsByDate = bookedArray.filter(booking => booking.date == date);
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
  // account for allCourt courtType bookings by adding the same times to all the rest of the courts.
  var bookingsByAllCourt = bookingsByDate.filter(function(booking) {return booking.courtType == "allCourt"});
  var allCourtBooking;
  var allCourtCounter;
  var allCourtTimes;
  var firstActivityIconCourts = mainClockCard.find("#activitySelector img.activityIcon:not(.bw-none)").first().attr("data-courtsAllowed").split(",");
  for (var index2 in bookingsByAllCourt) {
    allCourtCounter = 1;
    allCourtBooking = bookingsByAllCourt[index2];
    allCourtTimes = calculateTimes(allCourtBooking);
    while (allCourtCounter < firstActivityIconCourts.length) { // from 2 to equal to the number of courts.
      outerArray[allCourtCounter] = outerArray[allCourtCounter].concat(allCourtTimes);
      allCourtCounter++;
    }
  }

  console.log("This is the outerArray", outerArray);
  var arrayBooked = outerArray;
  //localStorage.setItem("BookingsMatrix", JSON.stringify(arrayBooked));
  // first we will filter the bookedArray by the current sport chosen.
   // array of integers

  // remove the subarrays that don't match the court numbers
  var selectedIconCourtsArray;
  var courtFacilityAllowed;
  if (typeof selectedIconCourts !== "undefined") {
    selectedIconCourtsArray = selectedIconCourts.split(",").map(Number);
    arrayBooked = outerArray.filter(function(courtFacility) {
        courtFacilityAllowed = selectedIconCourtsArray.includes(outerArray.indexOf(courtFacility)+1); // plus one to account for the zero index counter.
        console.log("check", courtFacilityAllowed);
        return courtFacilityAllowed;
    });
    console.log("by selection", selectedIconCourts, arrayBooked);
  }

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
      /* if ((length % 2) != 0) { // if the number of courts is odd and has an extra half court
        fullCourtArray.push(outerBookingsArray[length - 1]);
      } */
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
  console.log("open", openingHour);
  console.log("close", closingHour);
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

      var boundingRect = canvas2.getBoundingClientRect();
      var pos = getMousePos(canvas2, e);
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

function bookings_live_update(sports_centre_id) {
  var source = new EventSource(`https://weball.com.au/sub/${sports_centre_id}`);
  var updated_bookings_array;
  var clean_bookings_array;
  var no_courts;
  var currentDate;
  var currentFormattedDate;
  var activeTab;
  var decodedData;

  var activeIconCourtsAllowed;

  source.onopen = function() {
     activeTab = document.querySelector("#tabHolder .tab.active");
     console.log('connection to stream has been opened');

     no_courts = localStorage.getItem("numberOfCourts");
     currentDate = new Date(document.querySelector("#dateHolder").value);
     currentFormattedDate = currentDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
     replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

     clean_bookings_array = JSON.parse(localStorage.getItem("bookings_array"));

     activeIconCourtsAllowed = mainClockCard.find("#activitySelector img.selectedIcon").attr("data-courtsAllowed");

     bookingMatrix = createBookingMatrix(clean_bookings_array, currentFormattedDate, no_courts, activeIconCourtsAllowed);
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
    activeIconCourtsAllowed = mainClockCard.find("#activitySelector img.selectedIcon").attr("data-courtsAllowed");
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
      bookingMatrix = createBookingMatrix(JSON.parse(updated_bookings_array), currentFormattedDate, no_courts, activeIconCourtsAllowed);
      localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
      console.log("updated EventSource");

   } else if (decodedData.event == "live_reservation_remove") {
      console.log("live_remove");
       utcDate = new Date(decodedData.reservationTime).toISOString();
       current_bookings = current_bookings.filter( function(booking) {
           return booking.updated_at != utcDate;
       });
       //console.log(    "removed reservation!", current_bookings);
       localStorage.setItem("bookings_array", JSON.stringify(current_bookings));
       bookingMatrix = createBookingMatrix(current_bookings, currentFormattedDate, no_courts, activeIconCourtsAllowed);
       localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
      //currentDate = new Date(document.querySelector("#dateHolder").value);
    } else if (decodedData.event == "live_reservation_update") {
          console.log("reservation_update!");
          nowDate = new Date();
          reserved_bookings = (decodedData.bookings === Array) ? decodedData.bookings : JSON.parse(decodedData.bookings);
          // check if the user just clicked on the reserve button, if so do not add this reservation to the bookings array
          reservationTimeLocalSecs = JSON.parse(localStorage.getItem("reservationTime"));
          if (reservationTimeLocalSecs != null) {
              utcDate = new Date(parseInt(reservationTimeLocalSecs)).toISOString();
              // filter out the old bookings.
              //console.log("reservationTime", utcDate);
              for (var reservation in reserved_bookings) {
                  if (reserved_bookings[reservation].updated_at != utcDate) {
                      current_bookings.push(reserved_bookings[reservation]);
                  }
              }
          } else { // no reservation time is set, meaning the user running this website did not recently just make a reservation
              for (var reservation in reserved_bookings) {
                  current_bookings.push(reserved_bookings[reservation]);
              }
          }
          current_bookings = current_bookings.filter(function(booking) {
             minutesSinceBooked = (nowDate - Date.parse(booking.created_at))/60000;
             isExpiredReservation = (minutesSinceBooked > 15) && (booking.id == null);
             return !isExpiredReservation;
          });
          //console.log("updated! current_bookings", current_bookings);

          localStorage.setItem("bookings_array", JSON.stringify(current_bookings));

          bookingMatrix = createBookingMatrix(current_bookings, currentFormattedDate, no_courts, activeIconCourtsAllowed);
          localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
    } else {
    }
    activeTab.click();
    }
}

// enable the clear time button
// sportsCentreId moved to top
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
    peak_hour_holder.attr("data-peak-hours", JSON.stringify(response["peak_hours"]));
    // display a logo if logo is set otherwise defer to the sports centre title.

    if (response["logo_attached"] == false) { // the sports centre has not uploaded a logo
      mainClockCard.find("#bw-brand").addClass("bw-none");
      mainClockCard.find("#bw-brandRow .bw-sportsCentreTitle").text(response["sports_centre_title"])
      mainClockCard.find("#bw-brandRow .bw-sportsCentreTitle").removeClass("bw-none");
    }
    // store the prices in a div for reference in the widget sinces its easier.
    //var real_price_holder = mainClockCard.find("#real-price-holder");
    //real_price_holder.attr("data-prices", JSON.stringify(response["prices"]));
    var plan_type = response["plan_type"];
    if (plan_type == 0) { // free plan
        //mainClockCard.find("#timeHolder").toggle();
        mainClockCard.find("#bookNowButton").toggle();
        mainClockCard.find("#clearButton").toggle();
        repeatCard.find("#returnToSingleButton").toggle();
        repeatCard.find("#checkAvailabilityButton").addClass("mb-3");
        //repeatCard.height(mainClockCard.outerHeight());
        //repeatCard.css("margin-top", `-${mainClockCard.outerHeight()}px`);
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
        if (activity != "event") {
            cloneIcon = activitySelector.find("img.activityIcon").eq(0).clone();
            cloneIcon.attr("src", `https://weball.com.au/sport_icons/${activity}.png`);
            cloneIcon.removeClass("bw-none");
            cloneIcon.on("error", function() { BookingWidget.$(this).hide(); });
            cloneIcon.attr("data-activity", activity);
            //cloneIcon.attr("data-prices", jsonPrices[activity]);
            cloneIcon.insertAfter(activitySelector.find("#activityHolder"));
        }
    }

    var jsonCourtsAllowed = response["courtsAllowed"];
    for (var courtIcon in jsonCourtsAllowed) {
        activitySelector.find(`img[data-activity='${courtIcon}']`).attr("data-courtsAllowed", jsonCourtsAllowed[courtIcon]);
    }

    numberOfCourts = response["number_of_courts"];
    bookings_array = JSON.parse(response["json_bookings"]);

    // add click listener on icons
    var activityHolder;
    var activityType;
    var iconCourtsAllowed;
    var nowTime;
    var newFormattedDate;
    var spaceActivity;
    activitySelector.on("click", "img.activityIcon", function(){
        nowTime = new Date(mainClockCard.find("#dateHolder").val());
        newFormattedDate = nowTime.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'}).
        replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

        activityHolder = activitySelector.find("#activityHolder");
        activityType = BookingWidget.$(this).attr("data-activity");
        //spaceActivity = BookingWidget.$(this).attr("data-spaceActivity");
        spaceActivity = activityType.replace(/_/g, " ");


        BookingWidget.$(this).siblings().each( function() {
            BookingWidget.$(this).removeClass("selectedIcon");
            if (BookingWidget.$(this).hasClass("activityIcon")) {
                BookingWidget.$(this).addClass("bw-none");
            }
        });
        BookingWidget.$(this).addClass("selectedIcon");
        activityHolder.text(spaceActivity);
        console.log("jsonPrices", jsonPrices[activityType]);
        mainClockCard.find("#real-price-holder").attr("data-prices", JSON.stringify(jsonPrices[activityType]));

        // on click get the data courtsAllowed info and store the matrix in localStorage
        iconCourtsAllowed = BookingWidget.$(this).attr("data-courtsAllowed");
        console.log("newDate", newFormattedDate);
        bookingMatrix = createBookingMatrix(bookings_array, newFormattedDate, numberOfCourts, iconCourtsAllowed);
        localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));
        mainClockCard.find("#tabHolder div.active").click();
    });
    activitySelector.find(".activityIcon:not(.bw-none)").first().click();

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
    bookingMatrix = createBookingMatrix(bookings_array, nowFormattedDate, numberOfCourts);
    //var bookingSchedule;
    //console.log("matrix", bookingMatrix);
    // set up the half court tab - am and pm buttons
    //console.log("halfCourt", bookingSchedule);
    //localStorage.setItem("BookingsMatrix", JSON.stringify(bookingMatrix));

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

      bookingMatrix = JSON.parse(localStorage.getItem("BookingsMatrix"));
      mainClockCard.find("#tabHolder").attr("data-courtType", "fullCourt");
      //console.log(mainClockCard.find("#tabHolder")[0]);
      bookingSchedule = check_availability("fullCourt", bookingMatrix);
      console.log("full court", bookingSchedule);
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

var activityIcons;
var selectedIcon;
mainClockCard.on("click", "#nextIcon", function() {
    activityIcons = mainClockCard.find(".activityIcon:not(:first)");
    selectedIcon = mainClockCard.find(".selectedIcon");
    if (activityIcons.index(selectedIcon) == activityIcons.length - 1) {
        activityIcons.first().removeClass("bw-none").click();
    } else {
        selectedIcon.next().removeClass("bw-none").click()
        mainClockCard.find("#prevIcon").removeClass("bw-none");
        mainClockCard.find("#activityHolder").removeClass("max-preLeftArrow").addClass("max-postLeftArrow");
    }
});

mainClockCard.on("click", "#prevIcon", function() {
    activityIcons = mainClockCard.find(".activityIcon:not(:first)");
    selectedIcon = mainClockCard.find(".selectedIcon");
    if (activityIcons.index(selectedIcon) == 0) {
        activityIcons.last().removeClass("bw-none").click();
    } else {
        selectedIcon.prev().removeClass("bw-none").click()
    }
});
