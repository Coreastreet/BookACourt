document.addEventListener('DOMContentLoaded', function(){

    var BookingWidget  = (function(window, undefined) {
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

        function getSportsCentreId() {
            var scripts = document.getElementsByTagName('script');
            var id;

            for (var i = 0; i < scripts.length; i++) {


                id= scripts[i].getAttribute('data-sports-centre-id');
                if (id) {
                  return id;
                }
            }

            return null;
        } // getting the params of the product/sports centre
        function getSportsCentreData(params, callback) {
            var id = params.id;
            alert(id);
            //callback(BookingWidget.sportsCentre[id]);
        }
        function drawClockWidget() {}

        //loadScript("https://99dce927.ngrok.io/packs/js/catalog.js", function() {});
        loadScript("https://www.weball.com.au/jquery.js",function() {
            var BookingWidget = BookingWidget || {};
            BookingWidget.$ = BookingWidget.jQuery = jQuery.noConflict(true);
            var sportsCentreId = getSportsCentreId();  // sports centre id and date params
            getSportsCentreData(sportsCentreId, function(data) {
                alert(data);
                drawClockWidget();
            });

            //var greeting = BookingWidget.$("#p1").text();
            //alert(greeting);
        });

        return BookingWidget;
    })(window);
});
