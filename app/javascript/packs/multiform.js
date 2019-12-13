$(document).ready( function () {

  var owner_name = document.querySelector(".owner-name");
  var owner_email = document.querySelector(".owner-email");
  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  var companyName = document.querySelector("span.companyName");
  var ownerName = document.querySelector(".owner-name");
  var ownerEmail = document.querySelector(".owner-email");

  var currentCard = 0;
  showCard(currentCard);
  $('.card').eq(0).find('button.previous').eq(0).css('display', 'none');
  $('.card').eq(-1).find('button.next').css('display', 'none');
  $('.card').eq(-1).find('button[type="submit"]').text('Submit');

  $('body').on('click', 'button.next', function() {
    // if current card is a contact card that requires both owner and executive details, do not move to next card.
    if (this.closest(".card").matches('.contact')) {
      // do not move to next card
      //alert("next disabled!");
      fillInExecutiveCard(this.closest(".card")); // using the same card, switch from owner to executive form.
    } else {
      nextPrev(1);
    }
  });
  $('body').on('click', 'button.previous', function() {
      nextPrev(-1);
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
    if (currentCard >= cards.length) {
      //alert($('form#new_sports_centre'));
      //$('form#new_sports_centre').submit();
      console.log(currentCard, "too many cards");
      return false;
    }
    showCard(currentCard);
    // check if card shown contains the element for displaying owners; if yes, then fill the element with the owners info.
    if (document.querySelectorAll('.card')[currentCard].contains(companyName)) {
       companyName.innerHTML = document.querySelector("input#title").value;
    }
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
    if (this.checked == true) {
      this.parentElement.nextElementSibling.classList.remove("d-none");
      if (this.value == "owner" && (document.querySelectorAll('.new-contact-details').length == 1)) {
        // auto enter the rep details into the owners card
        //console.log();
        var first_owner = document.querySelector(".new-contact-details");
        var detailsClone = first_owner.cloneNode(true);
        detailsClone.classList.remove('d-none');
        var buttonRow = document.querySelector('.add-contact').parentNode;
        var cardBodyNode = buttonRow.parentNode;
        cardBodyNode.insertBefore(detailsClone, buttonRow);

        var hr = document.createElement('hr');
        cardBodyNode.insertBefore(hr, buttonRow);

        detailsClone.querySelector('.owner-name').innerHTML = document.querySelector("#sports_centre_representative_name").value;
        detailsClone.querySelector('.owner-email').innerHTML = document.querySelector("#sports_centre_representative_email").value;
      } else { // if director only selected
        var hrS = document.querySelectorAll("hr.new-class-details");
        //hrS[hrS.length - 1].remove();
      }
    } else {
      //console.log(this.next());
      this.parentElement.nextElementSibling.classList.add("d-none");
    }
  });

  var owner_card = document.querySelector(".card.contact .card-body");
  var add_contact_card = document.querySelector(".card-body.new-contact");
  $("body").on("click", ".add-contact", function() {
    owner_card.classList.add("d-none");
    add_contact_card.classList.remove("d-none");
    if (this.getAttribute("data-form") == "executive") {
        var heading = add_contact_card.querySelector('.new-contact-heading');
        var subheading = add_contact_card.querySelector('.new-contact-subheading');
        heading.children[0].innerHTML = "Add a director";
        heading.children[1].innerHTML = "It’s required to add any individual who is on the governing board of the company."
        subheading.children[0].innerHTML = "Director Information";
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
    var ownerButtonNode = document.querySelector('button.add-contact').parentNode;
    var parentCardNode = ownerButtonNode.parentNode;
    var hrTag = document.createElement('hr');

    var new_owner_name = document.querySelector(".new-owner-name").value;
    var new_owner_email = document.querySelector(".new-owner-email").value;
    add_contact_card.classList.add("d-none");
    owner_card.classList.remove("d-none");

    parentCardNode.insertBefore(detailsClone, ownerButtonNode);
    parentCardNode.insertBefore(hrTag, ownerButtonNode);

    detailsClone.querySelector('.owner-name').innerHTML = new_owner_name;
    detailsClone.querySelector('.owner-email').innerHTML = new_owner_email;
  });

  // remove parent when remove link clicked.
  $("body").on("click", ".remove-contact", function() {
      var details_to_be_removed = this.closest('.new-contact-details')
      var hr_below = details_to_be_removed.nextElementSibling
      details_to_be_removed.remove();
      hr_below.remove();
  });

  function fillInExecutiveCard(card) {
    var contact_heading = card.querySelector('.contact-heading');
    contact_heading.children[0].innerHTML = "Business Management";
    contact_heading.children[1].innerHTML = "Due to regulations, we’re required to collect information about a company’s directors.";

    var contact_sub_heading = card.querySelector('.contact-sub-heading');

    var companyName = document.querySelector("input#title").value;
    contact_sub_heading.children[0].innerHTML = "Please list all individuals who are members of the governing board of " + companyName;

    var add_contact_button = card.querySelector('button.add-contact');
    add_contact_button.children[1].innerHTML = "Add another director";
    add_contact_button.setAttribute("data-form", "executive");

    // hide the existing owner details if they exist.
    var owner_list = $(".new-contact-details");
    owner_list.each( function() {
      $(this).next().addClass('d-none');
      $(this).addClass('d-none');
    });

  }

});
