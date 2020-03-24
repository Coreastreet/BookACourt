var BookingWidget = (function(window, undefined) {
    var BookingWidget = {};

    function loadScript(url, callback) {
      var script = document.createElement("script");
      script.async = true;
      script.src = url;

      var entry = document.getElementsByTagName("script")[0];
      entry.parentNode.insertBefore(script, entry);

      script.onload = script.onreadystatechange = function() {
        var rdyState = script.readyState;

        if (!rdyState || /complete|loaded/.test(script.steadyState)) {
          callback();

          script.onload = null;
          script.onreadystatechange = null;
        }
      }
    }
    function loadStylesheet(url) {
      var link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = url;

      var entry = document.getElementsByTagName('script')[0];
      entry.parentNode.insertBefore(link, entry);
    }


    loadStylesheet("https://weball.com.au/outerSize.css");
    loadStylesheet("https://www.w3schools.com/w3css/4/w3.css");
    loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker3.standalone.min.css");
    loadScript("https://weball.com.au/jquery.js", function() {
        (function($) {
          loadScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/js/bootstrap-datepicker.js", function() {
              loadScript("https://unpkg.com/@popperjs/core@2", function() {
                    loadScript("https://weball.com.au/catalog.js",function() {

                function getSportsCentreParams() {

                    var target = $('[data-sportsCentreId]')[0];
                    var targetId = target.getAttribute("data-sportsCentreId");
                    //target.removeAttribute("data-sportsCentreId");

                    if (targetId) {
                      return {id: targetId, location: target};
                    }
                    return null;} // getting the params of the product/sports centre
                function getSportsCentreData(params, callback) {
                    callback(BookingWidget.sportsCentre[params.id], params.location);
                }
                function drawClockWidget(sportsCentreData, anchorTag) {
                    //var centre = JSON.parse(sportsCentreData);
                    /*console.log();
                    var html = "<div id='BookingWidget'>" +
                               `  <h3>${sportsCentreData.name}</h3>` +
                               `  <p>${sportsCentreData.price}</p>` +
                               "</div>"; */
                    var div = document.createElement("div");
                    div.innerHTML = BookingWidget.html;
                    anchorTag.parentNode.insertBefore(div, anchorTag);
                }

                var sportsCentreParams = getSportsCentreParams();  // sports centre id and date params

                getSportsCentreData(sportsCentreParams, function(data, tag) {
                    if (sportsCentreParams) {
                      //alert(data);
                      //console.log(tag);
                      drawClockWidget(data, tag); // data regarding sports centre and anchor tag.
                    } else {
                      alert("No anchor div tag found!");
                    }
                });
                  //var greeting = BookingWidget.$("#p1").text();
                  //alert(greeting);
                loadScript("https://weball.com.au/datepicker.js", function(){
                  //alert("date format loaded!");
                });

                loadScript("https://weball.com.au/repeatCard.js", function(){
                  //alert("date format loaded!");
                });

                loadScript("https://weball.com.au/paymentModal.js", function(){
                  //alert("date format loaded!");
                });
            });
              }):
          });
        })(jQuery);
    });
    loadScript("https://kit.fontawesome.com/b7ac405f9f.js", function() {});

    return BookingWidget;
})(window);
