document.addEventListener('DOMContentLoaded', function(){

  if ($(".book_now").length > 0) {
    const payButton = document.querySelector(".book-now");
    var court_type = document.querySelector(".court-types > a.active").getAttribute("data-courtType");

    // for the time being
    // assume that guests only will book one session as a casual
    // possibly require signup for repeat bookings
    var player_type = "casual";

    // allow the admin to customise their prices by
    // choosing which times during the week and which date periods will have discounted rates.
    // for now assume the time rate is "off-peak"
    var time_type = "off_peak";

    //payButton.setAttribute('style', 'display: none;');
    if (window.PaymentRequest) {
      let request = initPaymentRequest();
      //payButton.setAttribute('style', 'display: inline;');
      payButton.addEventListener('click', function() {
        onBuyClicked(request);
        request = initPaymentRequest();
      });
    } else {
      console.log('This browser does not support web payments');
    }

      // build and return a paymentRequest Object that contains order details and customer info.

      function initPaymentRequest() {
        let networks = ['amex', 'diners', 'discover', 'jcb', 'mastercard', 'unionpay',
            'visa', 'mir'];
        let types = ['debit', 'credit', 'prepaid'];
        let supportedInstruments = [{
          supportedMethods: 'basic-card',
          data: {supportedNetworks: networks, supportedTypes: types},
        }];

        let details = {
          total: {label: 'Donation', amount: {currency: 'USD', value: '55.00'}},
          displayItems: [
            {
              label: 'Original donation amount',
              amount: {currency: 'USD', value: '65.00'},
            },
            {
              label: 'Friends and family discount',
              amount: {currency: 'USD', value: '-10.00'},
            },
          ],
        };

        let options = {
          requestPayerName: true,
          requestPayerPhone: true,
          requestPayerEmail: true,
        };

        return new PaymentRequest(supportedInstruments, details, options);
      }

      // display the paymentRequest object.
      function onBuyClicked(request) {
        request.show().then(function(paymentResponse) {
          sendPaymentToServer(paymentResponse);
        })
        .catch(function(err) {
          console.log(err);
        });
      }

      //
      function sendPaymentToServer(paymentResponse) {

          window.setTimeout(function() {
            paymentResponse.complete('success')
                .then(function() {
                  //document.getElementById('result').innerHTML =
                      //paymentToJsonString(paymentResponse);
                      console.log(paymentResponse);
                })
                .catch(function(err) {
                  console.log(err);
                });
          }, 2000);
        }
    }
});
