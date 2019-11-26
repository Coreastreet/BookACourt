document.addEventListener('DOMContentLoaded', function(){
    // your code goes here
   if (document.querySelector("canvas") != null) {
        document.querySelectorAll(".card-columns div.card");
        $('body').on('click', ".card-columns div.card", function(e) {
            var sports_centre_id = $(this).data('id');
          //$('.mapCol').addClass("d-none");
        //$('.detailCol').removeClass("d-none");
            $.ajax({
               type: "GET",
               url: `/sports_centres/${sports_centre_id}`,
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

        $('[data-provide="datepicker"]').datepicker({
           format: "DD, d MM yyyy",
           todayHighlight: true,
           autoclose: true,
           clearBtn: true,
           startDate: now.toLocaleDateString(),
           maxViewMode: "years"
        });
    }
    //var calendarButton = document.querySelector("");


}, false);
