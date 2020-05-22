// manage_peak_hours.js

document.addEventListener('DOMContentLoaded', function(){

  //var admin_menu_buttons = document.querySelectorAll(".admin_menu");
  //alert("working");
  if (document.querySelector("#manage_peak_hours")) {
   var sports_centre_id = $('.sports_centre_holder').data("sports-centre-id");
   // console.log(sports_centre_id);
   $('body').on("click", ".manage_peak_hours", function() {

     //var counter = 0;
     // alert("clicked!");
     //$('.table td').remove();
     $(".peak-times").removeClass("d-none");
     $(".court-times").addClass("d-none");
     // change courts table to a days table
     $(".courts-table").removeClass("courts-table").addClass("days-table")
     var length = $(".table tr")[0].children.length - 1;
     var copyLength;
     var counter;

     // remove the existing columns for displaying bookings for courts.
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

      //console.log(arrayDataTime);

      // get days of week
      var myDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
      var myShortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      // add the new seven columns to allow selection of peak hour
      var counter2;
      //var numberDays = 7;
      console.log(arrayDataTime);
      $('.table tr').each(function(index) {
           //if (index == 0) {
             // remove top row
           counter2 = 0;
           if (index == 0) {

             while (counter2 < 7) {
               $(this).append(`<th scope="col" class="equalTH">${myDays[counter2]}</th>`)
               counter2++;
             }

           } else {

             while (counter2 < 7) {
               $(this).append(`<td class="peakSelector" data-time="${arrayDataTime[index-1]}" data-day="${myShortDays[counter2]}">&nbsp;</td>`);
               counter2++;
             }
           }
       });

       //console.log($("td.peakSelector"));

       // set the widths
       $('th.equalTH').each(function(index){
         $(this).width($("td.peakSelector").first().width());
       });


       $("#opening_hours").prop("id", "peak_hours").text("Peak hours;");
       $(".peak_hour_buttons").removeClass("d-none").addClass("d-flex");

      });

      $('body').on("click", ".confirm", function() {
          var peak_hours = savePeakHours();
          //console.log(peak_hours);
          $.ajax({
             type: "POST",
             url: `${sports_centre_id}/peak_hours`,
             data: {
               peak_hours: peak_hours
                // info: info, // < note use of 'this' here
                //sports_centre_id: $(this).data('id');
             },
             success: function(result) {
                // set default date to today
                //var month = now.toLocaleDateString("en-us", { month: 'long' });
                //var wDay = now.toLocaleDateString("en-us", { weekday: 'long' });
                //var todayDate = `${wDay}, ${now.getDate()} ${month} ${now.getFullYear()}`;
                //console.log(todayDate);
                //document.querySelector("input.form-control").value = todayDate;
                alert("New Peak Hours Saved!")
             },
             error: function(result) {
                 alert();
             }
           });
      });

      function savePeakHours() {
        var finalJson = "";
        var jsonString = "";
        var counter = 0;
        var arr = [];
        $(".times").each( function(index) {
          if ($(this).text().trim().length > 0) {
              var splitArray = $(this).text().substring(5).split("-");
              var dayID = $(this).attr("id");
              var startingPeakHour = splitArray[0];
              var closingPeakHour = splitArray[1];
              jsonString  = `\"${dayID}\":{ \"startingPeakHour\":\"${startingPeakHour}\", \"closingPeakHour\":\"${closingPeakHour}\"}`;
              arr.push(jsonString);
              counter++;
          }
        });
        finalJson = `{${arr.join(", ")}}`;
        //var hours_json = JSON.parse(finalJson);
        //var string_hours_json = JSON.stringify(hours_json);
        //$('#sports_centre_opening_hours').val(finalJson);
        return finalJson;
      }

      window.addEventListener('resize', function() {
        $(".moreEqualTH").css("min-width", $("th[scope='row']")[0].offsetWidth);
        //console.log();
        $('th.equalTH').each(function(index){
          $(this).css("max-width", $("td.peakSelector").first().width());
          $(this).css("word-wrap", "break-word");
        });
      });

    }
});
