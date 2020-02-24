$(document).ready( function () {

  var owner_name = document.querySelector(".contact-name");
  var owner_email = document.querySelector(".contact-email");
  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  var companyName = document.querySelector("p.companyName");
  var ownerName = document.querySelector(".contact-name");
  var ownerEmail = document.querySelector(".contact-email");

  var currentCard = 0;
  showCard(currentCard);
  $('.card').eq(0).find('button.previous').eq(0).css('display', 'none');
  $('.card').eq(-1).find('button.next').css('display', 'none');
  $('.card').eq(-1).find('button[type="submit"]').text('Submit');


  $('body').on('click', 'button.next', function() {
    // if current card is a contact card that requires both owner and executive details, do not move to next card.
    var outerCard = this.closest(".card");
    if (outerCard.matches('.contact.owner')) {
      // do not move to next card
      //alert("next disabled!");
      fillInCard(this.closest(".card"), "director"); // using the same card, switch from owner to executive form.
      outerCard.classList.remove('owner');
      outerCard.classList.add('director');
    } else {
      nextPrev(1);
    }
  });
  $('body').on('click', 'button.previous', function() {
    var outerCard = this.closest(".card");
    var contact_details = document.querySelectorAll(".new-contact-details");
    var counter = 1;
    var holder;
    if (outerCard.matches('.contact.director')) {
      // do not move to next card
      //alert("next disabled!");
      fillInCard(this.closest(".card"), "owner"); // using the same card, switch from owner to executive form.
      outerCard.classList.remove('director');
      outerCard.classList.add('owner');

    } else {
      nextPrev(-1);
    }
  });


  function showCard(n) {
    var cards = $('.card');
    cards.eq(n).show();
  }

  function nextPrev(n) {
    if (n == 1 && !is_valid()) {
      return false;
    } /*
    if (n == 1 && (currentCard == 2)) {
      saveOpeningHours();
    } */
    var cards = $('.card');

    cards.eq(currentCard).css('display', 'none');
    currentCard += n;
    //console.log(currentCard);
    if (cards.eq(currentCard).hasClass("contact")) {
      var inputs = document.querySelectorAll("input.rep-checkbox");
      //alert("found!" + currentCard);
      checkCheckboxes(inputs);
    }
    if (currentCard == 3) {
      cards.eq(currentCard).addClass('owner');
    }
    if (currentCard >= cards.length) {
      //alert($('form#new_sports_centre'));
      //$('form#new_sports_centre').submit();
      console.log(currentCard, "too many cards");
      return false;
    }
    showCard(currentCard);
    // check if card shown contains the element for displaying owners; if yes, then fill the element with the owners info.

    // prevent computer from re-adding same entries when clicking back and then returning to summary
    if (document.querySelectorAll('.card')[currentCard].classList.contains("summary") &&
    (document.querySelectorAll(".new-contact-summary").length != document.querySelectorAll(".new-contact-details").length - 1)) {
       var contactsClone;
       var final_add_contact = document.querySelector(".final-add-contact");
       var summaryCard = final_add_contact.parentNode;
       var hr;
       companyName.innerHTML = document.querySelector("input#title").value;
       $(".new-contact-details").each( function(index) {
         if (index >= 1) {
            contactsClone = this.cloneNode(true);
            //console.log(contactsClone);
            contactsClone.classList.remove("d-none");
            summaryCard.insertBefore(contactsClone, final_add_contact);
            contactsClone.classList.remove("new-contact-details");
            contactsClone.setAttribute("data-contact-email", this.querySelector(".contact-email").innerText);
            contactsClone.classList.add("new-contact-summary");
            contactsClone.classList.add("bg-white");
            contactsClone.classList.add("py-2");
            // add an update button
            var newEl = document.createElement('div');
            newEl.innerHTML = '<button type="button" class="btn bg-white border button-style">Update</button>'
            contactsClone.querySelector(".remove-contact").replaceWith(newEl);
            // update contact with info about whether the contact is rep, owner or director
            contactsClone.querySelector(".contact-email").innerHTML = contactsClone.getAttribute("data-contact-type");

            hr = document.createElement('hr');
            hr.classList.add("my-0");
            summaryCard.insertBefore(hr, final_add_contact);
         }
       });
    }
    // if the card is the last one, then set the company name and contacts for summary.
  }

  // check all mandatory fields have been filled in
  function is_valid() {
    var valid = true;
    $('.card').eq(currentCard).find('input.mandatory').each( function() {
      if ($(this).val() == "") {
        $(this).addClass('is-invalid');
        valid = false;
      }
    });

    return valid;
  }

  function checkCheckboxes(inputs) {
    var repContact = document.querySelector('.rep-contact');
    if (document.querySelector('.rep-contact')) {
      if ((inputs[0].checked && inputs[1].checked) == true) {
        repContact.setAttribute("data-contact-type", "Account Representative, Owner, Director");
      } else if ((inputs[0].checked || inputs[1].checked) == false) {
        repContact.setAttribute("data-contact-type", "Account Representative");
      } else {
        if (inputs[0].checked == true) {
          repContact.setAttribute("data-contact-type", "Account Representative, Owner");
        } else if (inputs[1].checked == true) {
          repContact.setAttribute("data-contact-type", "Account Representative, Director");
        } else {
          //
        }
      }
    }
  }

  // refactor later possibly
  function saveOpeningHours() {
    var finalJson = "";
    var jsonString = "";
    var counter = 0;
    var arr = [];
    $(".times").each( function(index) {
      if ($(this).text().trim().length > 0) {
          var splitArray = $(this).text().substring(5).split("-");
          var dayID = $(this).attr("id");
          var openingHour = splitArray[0];
          var closingHour = splitArray[1];
          jsonString  = `\"${dayID}\":{ \"openingHour\":\"${openingHour}\", \"closingHour\":\"${closingHour}\"}`;
          arr.push(jsonString);
          counter++;
      }
    });
    finalJson = `{${arr.join(", ")}}`;
    //var hours_json = JSON.parse(finalJson);
    //var string_hours_json = JSON.stringify(hours_json);
    $('#sports_centre_opening_hours').val(finalJson);
    console.log(finalJson);
  }

  $('.custom-file-input').on("change", function() {
    $(this.files).each( function() {
        console.log(this.name);
    });
  });

  // for checkbox if owner or director; as well as if more than one
  $("body").on("click", ".rep-checkbox", function() {
    var first_owner = document.querySelector(".new-contact-details");
    var detailsClone = first_owner.cloneNode(true);
    if (this.checked == true && (document.querySelectorAll('.new-contact-details').length == 1)) {
      this.parentElement.nextElementSibling.classList.remove("d-none");
      var buttonRow = document.querySelector('.add-contact').parentNode;
      var cardBodyNode = buttonRow.parentNode;
      var hr = document.createElement('hr');
      detailsClone.classList.remove('d-none');
      cardBodyNode.insertBefore(detailsClone, buttonRow);
      cardBodyNode.insertBefore(hr, buttonRow);

      detailsClone.querySelector('.contact-name').innerHTML = document.querySelector("#sports_centre_representative_name").value;
      detailsClone.querySelector('.contact-email').innerHTML = document.querySelector("#sports_centre_representative_email").value;
      detailsClone.classList.add("rep-contact");

    } else {
      //detailsClone.setAttribute("data-contact-type", "Account Representative");
      //console.log(this.next());
      this.parentElement.nextElementSibling.classList.remove("d-none");
      //alert("blah -neither");
    }
  });

  var owner_card = document.querySelector(".card.contact .card-body");
  var add_contact_card = document.querySelector(".card-body.new-contact");
  $("body").on("click", ".add-contact", function() {
    owner_card.classList.add("d-none");
    add_contact_card.classList.remove("d-none");
    var heading = add_contact_card.querySelector('.new-contact-heading');
    var subheading = add_contact_card.querySelector('.new-contact-subheading');
    if (this.getAttribute("data-form") == "director") {
        heading.children[0].innerHTML = "Add a director";
        heading.children[1].innerHTML = "It’s required to add any individual who is on the governing board of the company."
        subheading.children[0].innerHTML = "Director Information";
    } else if (this.getAttribute("data-form") == "owner") {
        heading.children[0].innerHTML = "Add an owner";
        heading.children[1].innerHTML = "It’s required to add any individual who owns 25% or more of the company."
        subheading.children[0].innerHTML = "Owner Information";
    }
    //parentCardNode.insertBefore(detailsClone, ownerButtonNode);
    //parentCardNode.insertBefore(hrTag, ownerButtonNode);
  });

  // cancel and return to the list of owners
  $("body").on("click", ".return-previous-card", function() {
    add_contact_card.classList.add("d-none");
    owner_card.classList.remove("d-none");
  });

  // confirm addition of new owner details
  $("body").on("click", ".confirm-new-contact", function() {

    // always refresh so clone element is new.
    var details = document.querySelector(".new-contact-details");
    var detailsClone = details.cloneNode(true);
    detailsClone.classList.remove('d-none');

    //detailsClone.setAttribute("data-form", "");

    var ownerButtonNode = document.querySelector('button.add-contact').parentNode;
    var parentCardNode = ownerButtonNode.parentNode;
    var hrTag = document.createElement('hr');

    var new_owner_name = document.querySelector(".new-contact-name").value;
    var new_owner_email = document.querySelector(".new-contact-email").value;
    add_contact_card.classList.add("d-none");
    owner_card.classList.remove("d-none");

    parentCardNode.insertBefore(detailsClone, ownerButtonNode);
    parentCardNode.insertBefore(hrTag, ownerButtonNode);

    detailsClone.querySelector('.contact-name').innerHTML = new_owner_name;
    detailsClone.querySelector('.contact-email').innerHTML = new_owner_email;
    //console.log(parentCardNode.parentNode);
    if (parentCardNode.parentNode.classList.contains("owner")) {
      detailsClone.setAttribute("data-contact-type", "Owner");
      //alert("owner");
    } else if (parentCardNode.parentNode.classList.contains("director")) {
      detailsClone.setAttribute("data-contact-type", "Director");
      //alert("director");
    } else {
      // do nothing
    }
  });

  // remove parent when remove link clicked.
  $("body").on("click", ".remove-contact", function() {
      var details_to_be_removed = this.closest('.new-contact-details')
      var hr_below = details_to_be_removed.nextElementSibling
      details_to_be_removed.remove();
      hr_below.remove();
  });

  function fillInCard(card, contactType) {
    var contact_heading = card.querySelector('.contact-heading');
    var contact_sub_heading = card.querySelector('.contact-sub-heading');
    var companyName = document.querySelector("input#autocomplete").value.split(",")[0];
    var add_contact_button = card.querySelector('button.add-contact');
    var owner_list = $(".new-contact-details");

    if (contactType == "director") {

        contact_heading.children[0].innerHTML = "Business Management";
        contact_heading.children[1].innerHTML = "Due to regulations, we’re required to collect information about a company’s directors.";


        contact_sub_heading.children[0].innerHTML = "Please list all individuals who are members of the governing board of " + companyName;

        add_contact_button.children[1].innerHTML = "Add another director";
        add_contact_button.setAttribute("data-form", "director");

        owner_list.each( function(index) {
        // hide the existing owner details if they exist.
          //$(this).next().addClass('d-none');
          if (index >= 1) {
            //console.log(holder);
            if (this.classList.contains("d-none")) {
              this.classList.remove("d-none");
              if ($(this).next().is('hr')) {
                $(this).next().removeClass("d-none");
              }
              //alert(counter, "removed");
            } else {
              this.classList.add("d-none");
              if ($(this).next().is('hr')) {
                $(this).next().addClass("d-none");
              }
              //alert(counter);
            }
          }
        });
    } else if (contactType == "owner") {
        contact_heading.children[0].innerHTML = "Business Ownership";
        contact_heading.children[1].innerHTML = "Due to regulatory guidelines, companies need to list everyone who owns a large portion of the business.";

        contact_sub_heading.children[0].innerHTML = "Add any individual who owns 25% or more of" + companyName;
        add_contact_button.children[1].innerHTML = "Add another owner";
        add_contact_button.setAttribute("data-form", "owner");
        owner_list.each( function(index) {
          //console.log(contact_details);
          if (index >= 1) {
            //console.log(holder);
            if (this.classList.contains("d-none")) {
              this.classList.remove("d-none");
              if ($(this).next().is('hr')) {
                $(this).next().removeClass("d-none");
              }
              //alert(counter, "removed");
            } else {
              this.classList.add("d-none");
              if ($(this).next().is('hr')) {
                $(this).next().addClass("d-none");
              }
              //alert(counter);
            }
          }
          //$(this).removeClass('d-none');
        });
    }

  }

});
