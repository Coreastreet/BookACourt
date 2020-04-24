
var bw = BookingWidget.$('#BookingWidget');
var mainClockCard = BookingWidget.$("#BookingWidget #clockHolderCard");
var repeatCard = BookingWidget.$("#BookingWidget #repeatBookingCard");

bw.on("click", ".days-and-weeks button", function() {
  //var frequency_options = BookingWidget.$(this).find("button");
  var input = BookingWidget.$(this).closest(".form-row").find("input");
  var inputString = input.val();
  BookingWidget.$(this).addClass("btn-selected");
  BookingWidget.$(this).siblings().not(BookingWidget.$(this)).removeClass("btn-selected");
  if (BookingWidget.$(this).attr("data-frequency-type") == "Days") {
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

bw.on("click", ".addAndMinus .minus-button", function() {
  number = parseInt(BookingWidget.$(this).next().text());
  if (number > 0) {
    number -= 1;
    BookingWidget.$(this).next().text(number);
    input = BookingWidget.$(this).closest(".form-row").find("input");
    //console.log(input);
    inputArray = input.attr("placeholder").split(" ");
    //console.log(inputArray);
    if (number == 1) {
      if (BookingWidget.$(this).closest(".form-row").hasClass("frequency")) {
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

bw.on("click", ".addAndMinus .plus-button", function() {
  number = parseInt(BookingWidget.$(this).prev().text());
  if (number < 52) {
    number += 1;
    BookingWidget.$(this).prev().text(number);
    input = BookingWidget.$(this).closest(".form-row").find("input");

    inputArray = input.attr("placeholder").split(" ");
    console.log(inputArray);
    if (number == 1) {
      if (BookingWidget.$(this).closest(".form-row").hasClass("frequency")) {
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

bw.on("click", ".repeat", function() {
  repeatCard.height(mainClockCard.outerHeight());
  repeatCard.css("margin-top", `-${mainClockCard.outerHeight()}px`);
  repeatCard.css("margin-left", "0%");
});

bw.on("click", ".back-arrow-booking", function() {
  BookingWidget.$(this).closest(".card").css("margin-left", "100%");
});

var repeatCard = bw.find("#repeatBookingCard");

repeatCard.on("click", "#frequencyRow button", function() {
    uncheckAvailability();
});

function uncheckAvailability() {
    var maxBookingsHolder = repeatCard.find("#maxBookingsWarning");
    maxBookingsHolder.text("");
    maxBookingsHolder.attr("data-arrayOfFreeCourtIds", "");
    maxBookingsHolder.attr("data-maxBookings", "1");
    repeatCard.attr("data-availabilityChecked", "false");
}
