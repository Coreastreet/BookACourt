$.noConflict();
$(document).ready( function () {
      $('#datepicker').datepicker();
      var today = new Date();
      $('#datepicker').datepicker("setDate", today);
      $('#datepicker').on('changeDate', function(e) {
          //$('#my_hidden_input').val(
          //alert($('#datepicker').datepicker('getFormattedDate'));
          $('#my_hidden_input').val(
              $('#datepicker').datepicker('getFormattedDate')
          );
          // $('#datepicker').datepicker("setDate", info);
          $.ajax({
             type: "GET",
             url: "19/date/13",
             data: {
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
                 //alert('ok, what the hell');
             },
             error: function(result) {
                 alert('error');
             }
           });
      });
      $( "td.active.day"  ).trigger( "click" );
      // alert("Hey!");
      $('body').on('click', '[data-toggle="dropdown"]', function() {
        $('.dropdown-toggle').dropdown()
      });

      //$('.courts-table tbody').width($('.courts-table thead').width());
});
/*

*/
