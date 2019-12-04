document.addEventListener('DOMContentLoaded', function(){

  $('body').on("click", ".manage_bookings", function() {

    //var counter = 0;
    // alert("clicked!");
    //$('.table td').remove();
    $(".peak_hour_buttons").removeClass("d-flex").addClass("d-none");
    $(".court-times").removeClass("d-none");
    $(".peak-times").addClass("d-none");
    // change courts table to a days table
    $(".days-table").removeClass("days-table").addClass("courts-table")

    var length = $(".table tr")[0].children.length - 1;
    var copyLength;
    var counter;

    // remove the existing columns for displaying peaks hour selection
    $('.table tr').each(function(index) {
         copyLength = length;
         counter = 1;
         //if (index == 0) {
           // remove top row
         while (copyLength >= counter) {
           $(this).children()[copyLength].remove();
           copyLength--;
         }
     });

     // get day times
     var arrayDataTime = [];
     $("th sup").each(function() {
         arrayDataTime.push($(this).text());
     });
     // restore the columns of the bookings
     var counter2;
     var numberOfCourts = $('.sports_centre_holder').data("number-of-courts");
     //var numberDays = 7;
     $('.table tr').each(function(index) {
          //if (index == 0) {
            // remove top row
          counter2 = 0;
          if (index == 0) {

            while (counter2 < numberOfCourts) {
              $(this).append(`<th scope="col" class="equalTH">Court no.${counter2+1}</th>`)
              counter2++;
            }

          } else {

            while (counter2 < numberOfCourts) {
              $(this).append(`<td data-time="${arrayDataTime[index-1]}" data-court="${counter2+1}">&nbsp;</td>`);
              counter2++;
            }
          }
      });



   });

});
