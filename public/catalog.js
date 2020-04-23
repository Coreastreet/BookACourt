//document.addEventListener('DOMContentLoaded', function(){
BookingWidget.sportsCentre = (function() {

    return {
        40: { name: "Morris Iemma Sports Centre", price: "30.00" },
        1337: { name: 'E90', company: 'Mikon', price: '599.99' },
        1338: { name: 'FabPix 30', company: 'Mikon', price: '139.99' },
        8871: { name: 'SuperShot', company: 'Kanon', price: '178.99' },
        8872: { name: 'SuperShot', company: 'Kanon', price: '219.99' }
    };
})();

BookingWidget.html = (function() {

    var html;
    html = '<div id="BookingWidget">' +
              '<div id="clockHolderCard" data-buttonsAttached="false">' +
              '<div class="input-group date" data-provide="datepicker" id="bw-calendar">' +
              '<input type="text" data-date="" id="dateHolder">' +
              '<div class="input-group-addon" id="dateButton">' +
              '<span class="input-group-text" id="basic-addon2"><i class="fa fa-calendar"></i></span>' +
              '</div>' +
              '</div>' +
              '<div class="card-body py-1">' +
              '<nav>' +
              '<div id="activitySelector" class="">' +
              '<div id="activityHolder">Basketball</div>' +
              '<img class="activityIcon bw-none" width="1rem" data-activity="" data-prices="" src="https://weball.com.au/basketball.png"></img>' +
              '</div>' +
              '</nav>' +
              '<nav>' +
              '<div class="nav nav-tabs court-types" data-courtType = "" id="tabHolder">' +
              '<div class="tab" id="halfCourtTab">' +
              '<a>Half Court</a>' +
              '</div>' +
              '<div class="tab" id="fullCourtTab">' +
              '<a>Full Court</a>' +
              '</div>' +
              '</div>' +
              '</nav>' +
              '<canvas id="canvas" width="270" height="270" data-ampm="" style="background-color:lightgrey">' +
              '</canvas>' +
              '<div class="input-group" id="timeHolder">' +
              '<input type="time" class="form-control startTime" id="startTime" data-counter="" data-interval="" step="1800" required/>' +
              '<input type="time" class="form-control endTime"  id="endTime" data-counter="" data-interval="" step="1800" required/>' +
              '<div class="input-group-append" id="timeButton">' +
              '<span class="input-group-text" id=""><i class="fa fa-clock-o"></i></span>' +
              '</div>' +
              '<div class="bw-none" data-peak-hour = "" id="peak-hour-holder">' +
              '</div>' +
              '<div class="bw-none" data-prices = "" id="real-price-holder">' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="card-footer pt-0">' +
              '<div class="row mt-2 mx-0" id="buttomRow">' +
              '<button type="button" class="btn btn-primary btn-sm col-6 repeat" id="repeatButton">Repeat booking</button>' +
              '<button type="button" class="btn btn-secondary btn-block btn-sm col-6 clearTime" id="clearButton">Clear Time</button>' +
              '</div>' +
              '<button type="button" id="bookNowButton" class="btn btn-success btn-block book-now mt-2 below-clock" data-toggle="modal" data-target="#bw-payment-confirmation">' +
              'Book now</button>' +
              '</div>' +
              '</div>' +
              '<div class="card repeat-card-body border-bottom-0 slideHolderModal w-100" id="repeatBookingCard" data-availabilityChecked="true" data-regularBooking="false">' +
              '<div class="card-body py-1" id="miniContainer">' +
              '<div class= "form-row mt-2" id="repeatHeader">' +
              '<i class="fas fa-arrow-left back-arrow hover-grey mr-2 p-2 align-self-center back-arrow-booking rounded" id="repeatArrow"></i>' +
              '<p class="bold heading mb-2" id="repeatTitle">Regular Booking</p>' +
              '</div>' +
              '<div class="form-row white-box rounded" id="startRow">' +
              '<label class="col-4 text-left font-weight-normal" id="startLabel">Start Date</label>' +
              '<input class="col-auto form-control" id="startDate" placeHolder = "Wednesday, 18 December"></input>' +
              '</div>' +
              '<div class="form-row white-box rounded mt-2" id="frequencyRow">' +
              '<div class="d-flex col-4" id="frequencyHeader">' +
              '<label class="text-left font-weight-normal mb-2" id="frequencyLabel">Frequency</label>' +
              '<div class="days-and-weeks" id="frequencyButtons" role="group">' +
              '<button type="button" class="daysWeeks blackText" data-frequency-type="Days" id="daysButton">Days</button>' +
              '<button type="button" class="daysWeeks blackText" data-frequency-type="Weeks" id="weeksButton">Weeks</button>' +
              '</div>' +
              '</div>' +
              '<div id="frequencyBottomRow">' +
              '<input class="col-7 form-control" placeHolder = "Every Week" data-frequency-type="Weeks" id="frequencyRate"></input>' +
              '<div class="addAndMinus">' +
              '<button type="button" class="rounded-circle minus-button blackText"><i class="fas fa-minus fa-xs"></i></button>' +
              '<div class="frequency-in-days number" data-counter="" data-interval="">0</div>' +
              '<button type="button" class="rounded-circle plus-button blackText"><i class="fas fa-plus fa-xs"></i></button>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="form-row white-box rounded mt-2" id="endRow">' +
              '<label class="col-4 text-left font-weight-normal" id="endLabel">End Date</label>' +
              '<div id="endDateBottomRow">' +
              '<input class="col-7 form-control" placeHolder = "After 1 booking" id="endDate"></input>' +
              '<div class="addAndMinus">' +
              '<button type="button" class="rounded-circle minus-button"><i class="fas fa-minus fa-xs"></i></button>' +
              '<div class="number-of-bookings number" data-counter="" data-interval="">1</div>' +
              '<button type="button" class="rounded-circle plus-button"><i class="fas fa-plus fa-xs"></i></button>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="mt-2 form-row white-box rounded bw-none" id="maxBookingRow">' +
              '<label id="maxBookingsWarning" data-maxBookings = "1" data-arrayOfFreeCourtIds = "" class="text-danger mx-1"></label>' +
              '</div>' +
              '<button type="button" class="below-clock" id="checkAvailabilityButton">Check Availability</button>' +
              '<button type="button" class="below-clock mt-2 bg-secondary" id="returnToSingleButton">Return to single booking</button>' +
              '</div>' +
              '</div>' +
              '</div>' +
              // seperation between the top (the clock date and timepicker) vs below (the payment modal))
              '<div class="w3-modal" id="payment-confirmation" role="dialog" data-court-type="" data-booking-interval="" ' +
              'data-booking-startTime="" data-booking-endTime="" data-number-of-bookings="" ' +
              'data-booking-rate="" data-booking-type="" data-activity-type="">' +
              '<div class="w3-modal-content" id="modal-dialog">' +
              '<div class="wrapper" id="bw-bookingSummary">' +
              '<div id="firstModalCard">' +
              '<div class="w3-container">' +
              '<div class="modal-header">' +
              '<span class="w3-button w3-display-topright modalClose bw-margin0" id="modalClose">&times;</span>' +
              '<h6 class="modal-title bw-padding1">Review Bookings</h6>' +
              '</div>' +
              '<div class="container-fluid mt-3 booking-row-start bw-marginTop1 paymentGrid">' +
              //'<div class="row px-0">' +
              '<div class="col-3 pr-0 startCalendarDate">' +
              //'<div class="row mx-0 pt-2 border-dark border">' +
              //'<div class="col-12 d-flex justify-content-center">' +
              '<h6 class="monthHolder">March</h6>' +
              '<hr class="my-0 modalHR">' +
              //'</div>' +
              //'</div>' +
              //'<div class="row mx-0 border border-dark border-top-0">' +
              //'<div class="col-12 d-flex justify-content-center">' +
              '<h2 class="mt-2 dayHolder">30</h2>' +
              //'</div>' +
              //'</div>' +
              '</div>' +
              //'<div class="col-9">' +
              '<div class="row booking-time">' +
              '<div class="col-12 d-flex justify-content-between">' +
              '<div class="font-weight-light slateGrey"><span id="weekday">Wednesday, </span>' +
              '<span class="bookingPeriod">11:30AM-2PM</span></div>' +
              '</div>' +
              '</div>' +
              '<div class="row mt-1 booking-order">' +
              '<div class="col-12 d-flex justify-content-between court-type itemRow">' +
              '<h5 class="font-weight-bold bw-item"><span id="activityType">BasketBall</span><span class="courtType bw-item">Half-Court</span></h5>' +
              '<h5 class="mb-0 bw-price" id="single-booking-price"></h5>' +
              '</div>' +
              '</div>' +
              '<div class="row booking-location">' +
              '<div class="col-12 d-flex" id="locationRow">' +
              '<div><i class="fas fa-map-marker-alt"></i></div>' +
              '<div class="font-weight-light ml-2 bw-pl1">Morris Iemma Indoor Sports Centre</div>' +
              '</div>' +
              '</div>' +
              '<div class="reviewSingleBooking trigger-detail-modal paddingHover">' +
              '<div>Review this booking</div>' +
              '<div><i class="fas fa-caret-right"></i></div>' +
              '</div>' +
              '</div>' +
              //'</div>' +
              //'</div>' +
              //'<div class="row px-0 reviewSingleBooking">' +
              //'<div class="col-3 pr-0">' +
              //'<div class="row mx-0">' +
              //'</div>' +
              //'</div>' +
              //'<div class="col-9">' +
              //'<div class="row booking-time">' +

              //'</div>' +
              //'</div>' +
              //'</div>' +
              //'</div>' +
              '<div class="row mx-0 range-divider bw-none">' +
              '<div class="col-3 pr-0 downCaret">' +
              '<div class="d-flex justify-content-center mt-2"><i class="fas fa-angle-down fa-lg" aria-hidden="true"></i></div>' +
              '</div>' +
              '</div>' +
              '<div class="container-fluid mt-1 booking-row-end bw-none paymentGrid">' +
              //'<div class="row px-0">' +
              '<div class="col-3 pr-0 endCalendarDate">' +
              //'<div class="row mx-0 pt-2 border-dark border">' +
              //'<div class="col-12 d-flex justify-content-center">' +
              '<h6 class="monthHolder">June</h6>' +
              '<hr class="my-0 modalHR">' +
              //'</div>' +
              //'</div>' +
              //'<div class="row mx-0 border border-dark border-top-0">' +
              //'<div class="col-12 d-flex justify-content-center">' +
              '<h2 class="dayHolder mt-2">22</h2>' +
              '</div>' +
              //'</div>' +
              //'</div>' +
              //'<div class="col-9">' +
              '<div class="row">' +
              '<div class="col-12 d-flex justify-content-between">' +
              '<div class="font-light-weight slateGrey frequencyHolder">Every 2 weeks</div>' +
              '</div>' +
              '</div>' +
              '<div class="row">' +
              '<div class="col-12 d-flex justify-content-between booking-type itemRow">' +
              '<h5 class="bw-item">Regular Booking</h5>' +
              '<div class="bw-align">' +
              '<i class="fas fa-sm fa-times d-inline-block"></i>' +
              '<h5 class="d-inline-block booking-number bw-price bw-pl1">10</h5>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="row reviewAllBookings paddingHover trigger-detail-modal">' +
              //'<div class="col-12 d-flex justify-content-between caret py-2">' +
              '<div>Review all bookings</div>' +
              '<div><i class="fas fa-caret-right"></i></div>' +
              //'</div>' +
              //'</div>' +
              '</div>' +
              '</div>' +
              '</div>' +
              //'</div>' +
              '<div class="modal-body p-0">' +
              '<div class="container-fluid whiteSmokeBG pt-2 pb-4 w3-container bw-whitesmoke">' +
              '<div class="paymentGrid">' +
              '<div class="bw-flex bw-emailInput bw-marginTop1">' +
              '<p class="bw-marginTop1">Email Receipt to:</p>' +
              '<input type="email" class="form-control col-7 bw-emailLine" placeholder="john-citizen@hotmail.com" value="hi_justin@hotmail.com">' +
              '</div>' +
              '<div class="bw-flex bw-subtotal bw-marginTop1">' +
              '<p class="mb-1 bw-margin0" id="subtotal-booking-text">Subtotal (<span id="subtotal-booking-number">10</span> bookings)</p>' +
              '<p class="mb-1 text-right bw-margin0" id="subtotal">$100.00</p>' +
              '</div>' +
              '<div class="col-8 bw-discount bw-flex">' +
              '<p class="mb-1 bw-margin0">Discount</p>' +
              '<p class="mb-1 text-right bw-margin0" id="discount">-$0.00</p>' +
              '</div>' +
              '<div class="col-8 bw-orderTotal bw-flex">' +
              '<h5 class="font-weight-bold mb-0">Order Total</h5>' +
              '<h5 class="font-weight-bold mb-0 text-right" id="totalAmount">$90.00</h5>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<div class="modal-footer bw-footer bw-marginTop1 bw-paddingBottom1">' +
              '<img src="https://weball.com.au/polipayLogo.png" class=""></img>' +
              '<i class="fas fa-info-circle fa-2x" id="polipayInfo"></i>' +
              '<button type="button" class="btn btn-primary bw-button bw-blue" id="polipay" data-dismiss="modal">Pay with POLi</button>' +
              '<button type="button" class="btn btn-default bw-button bw-white" data-dismiss="modal" id="paymentCancel">Close</button>' +
              '</div>' +
              '</div>' +
              '<div class="modal-footer bw-footer bw-paddingMargin bw-paddingBottom1" id="polipayFooter">' +
              '<span>POLi is a secure payment system that allows you to pay directly from your bank account.' +
              '</br><span id="bw-poliLinks"><a href="ttp://www.polipayments.com/buy" target="_blank">Learn more</a>' +
              '<a id="bw-banks" href="https://transaction.apac.paywithpoli.com/POLiFISupported.aspx?merchantcode=&apos;S6104689&apos;" target="_blank">Available banks</a>' +
              '</span>' +
              '</span>' +
              '</div>' +
              '</div>' +
              '<div id="secondModalCard">' +
              '<div class="modal-content slideHolderModal position-relative mt-0 w3-container" id="allDatesModal">' +
              '<div class="bw-justFlex bw-alignCenter bw-datesHeader bw-margin0">' +
              '<i class="fas fa-arrow-left back-arrow back-arrow-booking hover-grey mr-2 my-1 p-2 align-self-center rounded"></i>' +
              '<h6 class="modal-title align-self-center bw-pl1">Dates</h6>' +
              '<span class="w3-button w3-display-topright modalClose" id="modalClose">&times;</span>' +
              '</div>' +
              '<div class="modal-body px-0 overflow-auto pb-0 h-75">' +
              '<div class="row mx-3">' +
              '<p class="font-weight-light bw-margin0 bw-padding1 bw-largeFont">Court ID:</p>' +
              '</div>' +
              '<hr class="my-0 bw-margin0 bw-negRem">' +
              '<div class="container-fluid" id="courtIdBody" data-regularBookingCourtIds="[]">' +
              '<div class="row justify-content-between bw-padding-vert px-3 bw-none templateCourtRow" data-courtId="" data-startTime="" data-endTime="">' +
              '<p class="my-2 bw-margin0 bw-textCenter">Court 5: 1PM - 3:30PM (Holder)</p>' +
              '</div>' +
              '<hr class="my-0 bw-margin0 bw-negRem">' +
              '</div>' +
              '<div class="row px-3 mx-0" id="prices-title">' +
              '<p class="font-weight-light mt-3 bw-margin0 bw-padding1 bw-largeFont">Prices: (per booking)</p>' +
              '</div>' +
              '<hr class="my-0 bw-margin0 bw-negRem">' +
              '<div class="container-fluid prices-container">' +
              '<div class="prices-header bw-justFlex bw-padding-vert">' +
              '<div class="bw-time">' +
              '<p class="mb-0 bw-margin0">Time:</p>' +
              '</div>' +
              '<div class="bw-rate">' +
              '<p class="text-capitalize mb-0 bw-margin0">Rate:</p>' +
              '</div>' +
              '<div class="bw-hours">' +
              '<p class="mb-0 bw-margin0">Hours:</p>' +
              '</div>' +
              '<div class="bw-cost">' +
              '<p class="mb-0 bw-margin0">Cost:</p>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '<hr class="bw-margin0 bw-negRem">' +
              '<div class="" id="dates-title">' +
              '<p class="font-weight-light mt-3 bw-margin0 bw-padding1 bw-largeFont">Dates:</p>' +
              '</div>' +
              '<hr class="bw-margin0 bw-negRem">' +
              '<div class="templateDateRow bw-padding-horizontal bw-none">' +
              '<p class="my-2 bw-margin0 bw-padding-vert bw-textCenter singleDateHolder">Saturday, 3 March 2019</p>' +
              '<p class="bw-margin0 bw-padding-vert bw-containsPeakTimes"></p>' +
              '<p class="datePriceHolder bw-margin0 bw-padding-vert"></p>' +
              '</div>' +
              '<hr class="my-0 bw-margin0 bw-negRem bw-none">' +
              '<div class="container-fluid booking-dates">' +
              '</div>' +
              '<div class="bw-legendRow">' +
              '<div class="bw-peakLegend"></div>' +
              '<div class="">Peak Times</div>' +
              '</div>' +
              '</div>' +
              '<div class="modal-footer bw-footer bw-marginTop1 bw-marginBR1">' +
              '<button type="button" class="btn btn-default bw-button bw-white bw-marginNone" data-dismiss="modal">Close</button>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>' +
              '</div>'

    return html;

})();
