document.addEventListener('DOMContentLoaded', function(){
    // your code goes here
   if (document.querySelector("canvas") != null) {
        //document.querySelectorAll(".card-columns div.card");
        $('body').on('click', ".card-columns div.card", function(e) {
            var sports_centre_id = $(this).data('id');
            $('.slideHolder').addClass('show');
            $('.slideHolder').attr("data-centre", sports_centre_id);
            //document.querySelector('.slideHolder').setAttribute("data-centre", sports_centre_id);
            //console.log(sports_centre_id);
            var dateSplitArray = now.toLocaleDateString().split('/');
            var dateFormatted = `${dateSplitArray[2]}-${dateSplitArray[1]}-${dateSplitArray[0]}`;
            //console.log(dateFormatted);
          //$('.mapCol').addClass("d-none");
        //$('.detailCol').removeClass("d-none");
           $.ajax({
               type: "GET",
               url: `/sports_centres/${sports_centre_id}/${dateFormatted}`,
               data: {
                  // info: info, // < note use of 'this' here
                  //sports_centre_id: $(this).data('id');
               },
               success: function(result) {
                  // set default date to today
                  var month = now.toLocaleDateString("en-us", { month: 'long' });
                  var wDay = now.toLocaleDateString("en-us", { weekday: 'long' });
                  var todayDate = `${wDay}, ${now.getDate()} ${month} ${now.getFullYear()}`;
                  //console.log(todayDate);
                  document.querySelector("input.form-control").value = todayDate;
                  //alert()
               },
               error: function(result) {
                   alert();
               }
             });
        });

        var canvas = document.querySelector("canvas");
        var button = document.querySelector(".below-clock");
        canvas.height = button.clientWidth;
        canvas.width = button.clientWidth;

        var ctx = canvas.getContext("2d");
        var radius = canvas.height / 2;
        ctx.translate(radius, radius*0.9);

        var now = new Date();

        var dateString;
        var lastIndex;

        // set initial date of regular booking
        dateString = now.toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long'});
        //lastIndex = dateString.lastIndexOf(" ");
        $(".startDate").val(dateString);
        console.log(dateString);

        $('[data-provide="datepicker"]').datepicker({
           format: "DD, d MM yyyy",
           todayHighlight: true,
           autoclose: true,
           clearBtn: true,
           startDate: now.toLocaleDateString(),
           maxViewMode: "years"
        }).on('changeDate', function(e) {
           //$(".startDate").val(($(this).datepicker('getFormattedDate')));
           dateString = $(this).datepicker('getFormattedDate');
           lastIndex = dateString.lastIndexOf(" ");
           dateString = dateString.substring(0, lastIndex);
           $(".startDate").val(dateString);
        });
    }
    //var calendarButton = document.querySelector("");

}, false);
