$.noConflict();
$(document).ready( function () {
      $('#datepicker').datepicker();
      var today = new Date();
      $('#datepicker').datepicker("setDate", today);
      $('#datepicker').on('changeDate', function(e) {
          //$('#my_hidden_input').val(
          $('#my_hidden_input').val(
              $('#datepicker').datepicker('getFormattedDate')
          );
          // $('#datepicker').datepicker("setDate", info);
          // console.log(info);
          $.ajax({
             type: "GET",
             url: "/sports_centres/19/date/13",
             data: {
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
                 // alert('ok');
             },
             error: function(result) {
                 alert('error');
             }
           });
      });
      $( "td.active.day"  ).trigger( "click" );

      $('body').on('click', '[data-toggle="dropdown"]', function() {
        $('.dropdown-toggle').dropdown()
      });
});
