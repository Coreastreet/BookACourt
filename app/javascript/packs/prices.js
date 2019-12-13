document.addEventListener('DOMContentLoaded', function(){

  if ($(".book-now").length > 0) {
    var casualButton = document.querySelector(".casual");
    var regularButton = document.querySelector(".regular");
    var priceHolder;

    $('body').on("click", ".casual", function() {
      setToggledPrices("casual")
    });
    $('body').on("click", ".regular", function() {
      setToggledPrices("regular")
    });

    function setToggledPrices(user_type) {
      var counter = 0;
      var prices = document.querySelectorAll(".priceHolder");
      var dataString = `data-${user_type}-price`;
      //if button.classList.contains("casual")
      //console.log(prices);
      while (counter < prices.length) {
        priceHolder = prices[counter].getAttribute(dataString);
        prices[counter].innerHTML = priceHolder;
        counter++;
      }
    }
  }
});
