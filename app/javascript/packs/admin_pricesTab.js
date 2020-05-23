
$(document).on('turbolinks:load', function () {

  $("#setPricesForm").on("click", ".arrowContainerRight", function() {
      var widthActivityHolder = $("#activityCardHolder").width();
      var numberOfFullCards = Math.floor(widthActivityHolder/152);
      var widthToScroll = numberOfFullCards * 152;
      $('#activityCardHolder').animate( { scrollLeft: `+=${widthToScroll}` }, 1000);
      console.log("scrollRight");
  })

  $("#setPricesForm").on("click", ".arrowContainerLeft", function() {
      var widthActivityHolder = $("#activityCardHolder").width();
      var numberOfFullCards = Math.floor(widthActivityHolder/152);
      var widthToScroll = numberOfFullCards * 152;
      $('#activityCardHolder').animate( { scrollLeft: `-=${widthToScroll}` }, 1000);
      console.log("scrollLeft");
  })




});
