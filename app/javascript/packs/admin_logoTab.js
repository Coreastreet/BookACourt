// this tab is all for all functions and click listeners concerning the html loaded when the logo tab is clicked on the admin dashboard.

$(document).on('turbolinks:load', function () {

  $("#editLogoBody").on("click", "#showPdInfoModal", function() {
      $("#pdInfoModal").show();
  })

  $("#editLogoBody").on("click", "#closePdInfoModal", function() {
      $("#pdInfoModal").hide();
  })




});
