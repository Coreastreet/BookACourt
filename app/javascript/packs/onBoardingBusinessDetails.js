$(document).ready( function () {

  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
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
          tax_id: document.querySelector('form.business-registration input#sports_centre_ABN').value,// get ABN from business
        },
        business_profile: {
          mcc: 7999, // Miscellaneous Recreation Services
          url: document.querySelector('form.business-registration input#sports_centre_URL').value, // get business website address
        },
        tos_shown_and_accepted: true,
      })

      var contacts = document.querySelectorAll(".new-contacts-summary");
      //var contactCounter = 0;
      //if (contactCounter < contacts.length()) {
      //var first_contact = document.querySelector(".new-contact-summary");
      var name = document.querySelector("input#sports_centre_representative_name").value;
      var last_name = name.split(" ").pop();
      var first_name = name.replace(` ${last_name}`, "");
      const personResult = await stripe.createToken('person', {
        person: {
          first_name: first_name,
          last_name: last_name,
          email: document.querySelector("input#sports_centre_representative_email").value,
          //document.querySelector(".new-contact-summary").getAttribute("data-contact-email"),
          address: {
            line1: document.querySelector("input#sports_centre_representative_address_street_address").value,
            city: document.querySelector("input#sports_centre_representative_address_suburb").value,
            state: document.querySelector("input#sports_centre_representative_address_state").value,
            postal_code: document.querySelector("input#sports_centre_representative_address_postcode").value,
          },
        },
      });
      //}

      if (accountResult.token && personResult.token) {
        document.querySelector('#token-account').value = accountResult.token.id;
        document.querySelector('#token-person').value = personResult.token.id;
        alert(accountResult.token.id)
        alert(personResult.token.id);
        myForm.submit();
      }
    }

});
