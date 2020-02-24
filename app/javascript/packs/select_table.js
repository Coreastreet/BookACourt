$(document).ready( function () {
  //var $td = document.getElementsByTagName("td");
  /* l = td.length;
  for (i = 0; i < l; i++) {
    td[i].classList.add("table-active");
  }; */
  //var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  //console.log($('td'));
  /* $(document).on("click", ".days-table td", function() {
    // only if add or remove bookings button is selected
    //if ($("#addRemoveBookings").hasClass("bg-black")) {
      if ($(this).hasClass("table-active")) {
        disableSelection($(this));
      } else {
        enableSelection($(this));
      }

  });
  //td.addClass('table-active');

  function enableSelection(selectedCell) {
    selectedCell.addClass('table-active');
    var holder = selectedCell;
    var day = selectedCell.data('day');
    var column = ("td[data-day=" + day + "]");
    var counter = 0;
    var opening_index = 0;
    $(column).each( function(index) {
      if ($(column).eq(index).hasClass( "table-active" )) {
        counter++;

        var end_index = $(column).index(holder);
        var start_index = index + 1;

        // save the starting time
        if (counter == 1) {
          opening_index = index.valueOf();
        }
        // code for logging the opening_times
        var starting_time = $(column).eq(opening_index).data('time');
        //console.log(opening_index);
        var ending_time = $(column).eq(end_index+1).data('time');
        var dayHolder = '#' + day;
        //console.log(dayHolder);
        $(dayHolder).text( day + ": " + starting_time + "-" + ending_time);

        while (end_index > start_index) {
          $(column).eq(start_index).addClass("table-active");
          start_index++;
        }
      }
    });
  }

  function disableSelection(selectedCell) {
      var holder = selectedCell;
      var day = selectedCell.data('day');
      var column = ("[data-day=" + day + "]");
      var selectedColumn = ('.table-active' + column);
      var selectedColumnFirstIndex = $(column).index($(selectedColumn).eq(0));
      var selectedColumnLastIndex = $(column).index($(selectedColumn).eq(-1));
      var holderIndex = $(column).index(selectedCell);
      var difference1 = Math.abs(holderIndex - selectedColumnFirstIndex);
      var difference2 = Math.abs(selectedColumnLastIndex - holderIndex);
      var difference = (difference1 > difference2) ? difference2 : difference1;
      var counter = 0;
      while (difference > 0) {
        // if selectedCell is closer to the end time
        if (difference1 > difference2) {
          $(column).eq(selectedColumnLastIndex - counter).removeClass('table-active');
        } else { // if selectedCell is closer to the start time
          $(column).eq(selectedColumnFirstIndex + counter).removeClass('table-active');
        }
        counter++;
        difference--;
      }
      var new_column = (".table-active" + column);
      // code for logging the closing_times
      var starting_time = $(new_column).eq(0).data('time');
      var last_cell = $(new_column).eq(-1);
      var position_of_last_cell = $(column).index(last_cell);
      var ending_time = $(column).eq(position_of_last_cell + 1).data('time');
      var dayHolder = '#' + day;
      //console.log($(dayHolder));
      $(dayHolder).text( day + ": " + starting_time + "-" + ending_time);
    //selectedCell.removeClass('table-active');
  }; */
});
