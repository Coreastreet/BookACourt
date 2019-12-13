$(document).ready( function () {

  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  const stripe = Stripe('pk_test_N75DfmVdVk3b8FE5JMbkrgfY00sngv9GrB');
  const myForm = document.querySelector('form.business-registration');

  if (myForm != null) {
    myForm.addEventListener('submit', handleForm);
  }

  async function handleForm(event) {
      event.preventDefault();

      //var addressLine =  + ", "
      //+
      const accountResult = await stripe.createToken('account', {
        business_type: 'company',
        company: {
          name: document.querySelector("form.business-registration input#title").value,
          phone: document.querySelector("form.business-registration input#sports_centre_phone").value,
          address: {
            line1: document.querySelector('form.business-registration input#street_address').value.trim(),
            city: document.querySelector('form.business-registration input#locality').value,
            //document.querySelector('.inp-company-city').value,
            state: document.querySelector('form.business-registration input#administrative_area_level_1').value,
            postal_code: document.querySelector('form.business-registration input#postal_code').value,
          },
          tax_id: document.querySelector('form.business-registration input#postal_code').value,// get ABN from business
        },
        business_profile: {
          mcc: 7999, // Miscellaneous Recreation Services
          url: document.querySelector('form.business-registration input#postal_code').value, // get business website address
        },
        tos_shown_and_accepted: true,
      });

      const personResult = await stripe.createToken('person', {
        person: {
          first_name: document.querySelector('.inp-person-first-name').value,
          last_name: document.querySelector('.inp-person-last-name').value,
          address: {
            line1: document.querySelector('.inp-person-street-address1').value,
            city: document.querySelector('.inp-person-city').value,
            state: document.querySelector('.inp-person-state').value,
            postal_code: document.querySelector('.inp-person-zip').value,
          },
        },
      });

      if (accountResult.token && personResult.token) {
        document.querySelector('#token-account').value = accountResult.token.id;
        document.querySelector('#token-person').value = personResult.token.id;
        myForm.submit();
      }
    }

});
