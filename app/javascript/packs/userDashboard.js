document.addEventListener('DOMContentLoaded', function(){
      //$('#datepicker').datepicker();
      var now = new Date();
      $('[data-provide="datepicker"]').datepicker({
          format: "DD, d MM yyyy",
          todayHighlight: true,
          autoclose: true,
          clearBtn: true,
          startDate: now.toLocaleDateString(),
          maxViewMode: "years"
      }).on('changeDate', function(e) {
          //$('#my_hidden_input').val(
          //alert($('#datepicker').datepicker('getFormattedDate'));
          var newDate = e.date;
          $('#my_hidden_input').val(newDate);
          var dateSplitArray = newDate.toLocaleDateString().split('/');
          var dateFormatted = `${dateSplitArray[2]}-${dateSplitArray[1]}-${dateSplitArray[0]}`;
          document.querySelector('.dateHolder').setAttribute("data-date", dateFormatted);
          var sports_centre_id = document.querySelector(".slideHolder").dataset.centre;
          //$(".dateHolder").data("date", date);
          // $('#datepicker').datepicker("setDate", info);
          //alert(finalDate);
          $.ajax({
             type: "GET",
             url: `/sports_centres/${sports_centre_id}/${dateFormatted}`,
             data: {
               //date: JSON.stringify(dateFormatted);
                // info: info, // < note use of 'this' here
             },
             success: function(result) {
                 alert('ok, change date working!');
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

      $("#homeBody").on("click", "button.tooltipTarget", function() {
        $(this).find(".tooltiptext").css("visibility", "visible").delay(1000).fadeOut();
        $(this).find(".tooltiptext").css("display", "block");
        var id = $(this).attr("data-target");
        var copiedTextInput = document.getElementById(`${id}`);
        console.log(copiedTextInput);
        copiedTextInput.select();
        copiedTextInput.setSelectionRange(0, 99999);
        document.execCommand("copy");
        copiedTextInput.blur();
        //alert(copiedTextInput.value);
      });

      //var clockHolderHeight = $('#clockHolder').height();
      //$('#detailHolder').height(clockHolderHeight);

});
