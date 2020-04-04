document.addEventListener("turbolinks:load", function () {

  $('form').on('keypress', e => {
      if (e.keyCode == 13) {
          return false;
      }
  });

  $("#registerCentre").on("submit", function() {
      // build the new data
      var arr = [];
      $(".new-contact-details:not(.rep-contact):not(.original)").each( function() {
            var name = $(this).find(".contact-name").text();
            var email = $(this).find(".contact-email").text();
            var type = $(this).attr("data-contact-type");
            var newContact = (type == "Director") ? { name: name, email: email, isDirector: true } :  { name: name, email: email, isOwner: true }
            arr.push(newContact);
      });
      var input = $("<input>")
           .attr("type", "hidden")
           .attr("name", "arrayContacts").val(JSON.stringify(arr));
      $(this).append(input);
      return true;
  });

  var owner_name = document.querySelector(".contact-name");
  var owner_email = document.querySelector(".contact-email");
  // var script = document.createElement('script');script.src = "https://code.jquery.com/jquery-3.4.1.min.js";document.getElementsByTagName('head')[0].appendChild(script);
  var companyName = document.querySelector("p.companyName");
  var ownerName = document.querySelector(".contact-name");
  var ownerEmail = document.querySelector(".contact-email");

  var currentCard = 0;
  showCard(currentCard);

  // delete this part later
  $('.card').eq(0).find('button.previous').eq(0).css('display', 'none');
  $('.card').eq(-1).find('button.next').css('display', 'none');
  $('.card').eq(-1).find('button[type="submit"]').text('Submit');
/*
  $("#autocomplete").val("Morris Iemma Indoor Sports Centre");
  $("#sports_centre_email").val("hi_justin@hotmail.com");
  $("#sports_centre_password").val("Soba3724");
  $("#sports_centre_password_confirmation").val("Soba3724");

  $("#street_address").val("50 Belmore Road North");
  $("#locality").val("Riverwood");
  $("#administrative_area_level_1").val("NSW");
  $("#postal_code").val("2210");
  $("#sports_centre_URL").val("www.cbcity.nsw.gov.au");
  $("#sports_centre_phone").val("91530441");
  $("#sports_centre_ABN").val("51824753556");

  $("#sports_centre_representative_name").val("Justin Ye");
  $("#sports_centre_representative_address_street_address").val("50 Corea street");
  $("#sports_centre_representative_address_suburb").val("Sylvania");
  $("#sports_centre_representative_address_state").val("NSW");
  $("#sports_centre_representative_address_postcode").val("2210");
  $("#sports_centre_representative_email").val("hi_justin@hotmail.com");
  $("#sports_centre_representative_title").val("CEO");
  $("#sports_centre_representative_phone").val("0437578502");
*/
//  $('body').on("click", "a#register", function() {
//      $("form fieldset.card:first").css("display", "block");
//  })
  $("body").on("input", "fieldset input.mandatory.is-invalid", function() {
      $(this).removeClass("is-invalid");
  });

  $("body").on("input", "fieldset input[type=email]", function() {
      if (ValidateEmail($(this).val())) {
         $(this).removeClass("is-invalid");
      } else {
         $(this).addClass("is-invalid");
      }
  });

  function ValidateEmail(mail) {
      var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      return reg.test(mail);
  }

  $("body").on("input", "fieldset input[type=password].passwdTop", function() {
      if ($(this).val().length < 8) {
        $(this).addClass("is-invalid");
      } else {
        $(this).addClass("is-valid");
      }
  });

  $("body").on("input", "fieldset input[type=password].passwdConfirm", function() {
      //console.log("hey");
      if ($(this).val() != $(this).closest("fieldset").find("input[type=password].passwdTop").val()) {
        $(this).addClass("is-invalid");
      } else {
        $(this).removeClass("is-invalid");
        $(this).addClass("is-valid");
      }
  });
  // check url is valid
  $("body").on("input", "fieldset input[type=url]", function() {
      //console.log("hey");
      var urlPattern = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
      if (urlPattern.test($(this).val())) {
        $(this).removeClass("is-invalid");
      } else {
        $(this).addClass("is-invalid");
      }
  });

  $("body").on("input", "fieldset #administrative_area_level_1, fieldset #sports_centre_representative_address_state", function() {
      //console.log("hey");
      var arrayOfStates = [];
      var card = $(this).closest("fieldset");
      $.map( card.find("#states").children(), function(item) {
          arrayOfStates.push(item.value);
      })
      if (arrayOfStates.includes($(this).val())) {
        $(this).removeClass("is-invalid");
      } else {
        $(this).addClass("is-invalid");
      };

  });

  $("body").on("input", "fieldset #postal_code, fieldset #sports_centre_representative_address_postcode", function() {
      if ($(this).val().length < 4) {
          $(this).addClass("is-invalid");
      }
  });

  $("body").on("change", "fieldset input[type=tel], fieldset #sports_centre_ABN", function() {
      if ( /\s/.test($(this).val()) || /\-/.test($(this).val()) ) { // contains any whitespace
          var newVal = $(this).val().replace(/\s+/g, '').replace(/\-/g, "");
          $(this).val(newVal);
      }
      if (isNaN(Number($(this).val()))) {
        $(this).addClass("is-invalid");
      } else {
        $(this).removeClass("is-invalid");
      }
  });

  $("body").on("click", "#courtSelection button", function() {
      $(this).siblings().removeClass("selected-button");
      $(this).addClass("selected-button");
      $(this).parent().removeClass("is-invalid");
      $(this).parent().next().hide();
      var index = $(this).index();
      $("#hiddenCourtsNo input")[index].checked = true;
  });

  $('body').on('click', 'button.next', function(e) {
    // if current card is a contact card that requires both owner and executive details, do not move to next card.
    var outerCard = $(this).closest(".card");
    var contactCard = $("fieldset.contact");
    var directorChecked = contactCard.attr("data-director-form");
    var ownerChecked = contactCard.attr("data-owner-form");
    if (currentCard == 1) {
      var buttons = $("#courtSelection");
      if (buttons.find("button.selected-button").length == 0) { // if a button, indicating number of courts, is not selected
          buttons.addClass("is-invalid");
          buttons.next().show();
      }
    }
    if (outerCard.has(".is-invalid").length > 0) {
        var emptyInputs = outerCard.find("input");
        emptyInputs.each( function() {
          if ($(this).val().length == 0) {
            $(this).addClass("is-invalid");
          };
        });
        e.preventDefault();
        return false;
    }
    if (currentCard == 2) {
      var companyName = document.querySelector("input#autocomplete").value.split(",")[0];
      $("fieldset span.companyName").text(companyName);
      //var checkedContacts = $("fieldset#repCard input[type=checkbox]:checked");

      if (  directorChecked == "false" && ownerChecked == "false" ) { // no second card checkboxes selected i.e. owners and directors
        // so skip directly to the Post detail page.
        nextPrev(2);
      } else if ((directorChecked == "true") && (ownerChecked == "true")) {
           if ($("#inlineRadio1").is(":checked") && $("#inlineRadio3").is(":checked")) { // double yes
                nextPrev(2);
           } else {
                nextPrev(1);
           }
      } else {
          if ((directorChecked == "false") && (ownerChecked == "true")) {
              //nextPrev(2);
              if ($("#inlineRadio1").is(":checked")) {
                //console.log("skip 2");
                  nextPrev(2);
              } else {
                  nextPrev(1);
              }
          } else if ((directorChecked == "true") && (ownerChecked == "false"))  {
              //console.log("what!");
              //var contactCard = $("fieldset.contact");
              if ($("#inlineRadio3").is(":checked")) {
                  console.log("skip 2");
                  nextPrev(2);
              } else {
                nextPrev(1);
              }
              fillInCard(contactCard[0], "director"); // using the same card, switch from owner to executive form.
              contactCard.removeClass('owner');
              //console.log(contactCard.hasClass("owner"));
              contactCard.addClass('director');

          } else {};
      }//if ( directorChecked == "true" && ownerChecked == "true" ) {
    } else if (outerCard.is('.contact.owner')) {
      if (outerCard.attr("data-director-form") == "true") {
      // do not move to next card
      //alert("next disabled!");
          //alert("what!");
          fillInCard(this.closest(".card"), "director"); // using the same card, switch from owner to executive form.
          outerCard.removeClass('owner');
          outerCard.addClass('director');
      } else {
          nextPrev(1);
      }
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
      if (outerCard.getAttribute("data-owner-form") == "true") {
          fillInCard(outerCard, "owner"); // using the same card, switch from owner to executive form.
          outerCard.classList.remove('director');
          outerCard.classList.add('owner');
      } else {
          nextPrev(-1);
      }

    } else if (outerCard.matches(".summary")) {
      var contactCard = $("fieldset.contact");
      if ((contactCard.attr("data-owner-form") == "true") && (contactCard.attr("data-director-form") == "true")) {
        if ($("#inlineRadio1").is(":checked") && $("#inlineRadio3").is(":checked")) {
          nextPrev(-2);
        } else if ($("#inlineRadio1").is(":checked") && ($("#inlineRadio3").is(":checked") != "false")) {
          nextPrev(-1);
        } else if ($("#inlineRadio3").is(":checked") && ($("#inlineRadio1").is(":checked") != "false")) {
          nextPrev(-1);
        } else {
          nextPrev(-1);
        }
      } else if ((contactCard.attr("data-owner-form") == "false") && (contactCard.attr("data-director-form") == "false")) {
          nextPrev(-2);
      } else {
        if (contactCard.attr("data-owner-form") == "true" && $("#inlineRadio1").is(":checked")) {
            nextPrev(-2);
        } else if (contactCard.attr("data-director-form") == "true" && $("#inlineRadio3").is(":checked")) {
            nextPrev(-2);
        } else {
            console.log("one back");
            nextPrev(-1);
        }
      }
    } else {
      nextPrev(-1);
    }
  });


  function showCard(n) {
    var cards = $('.card');
    cards.eq(n).show();
  }

  function nextPrev(n) {
    if ((n == 1 || n == 2) && !is_valid()) {
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
    /*if (document.querySelectorAll('.card')[currentCard].classList.contains("summary") &&
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
    } */
    // if the card is the last one, then set the company name and contacts for summary.
  }

  $("body").on("click", "fieldset#repCard .radioHolder", function() {
      $(this).find("input[type=radio]").removeClass("is-invalid");
  });

  // check all mandatory fields have been filled in
  function is_valid() {
    var valid = true;
    $('.card').eq(currentCard).find('input.mandatory').each( function() {
      if ($(this).val() == "") {
        $(this).addClass('is-invalid');
        valid = false;
      }
    });
    if (currentCard == 2) {
        $("fieldset#repCard").find('input[type=checkbox]:checked').each( function() {
          //console.log($(this));
          var radioHolder = $(this).parent().next();
          //console.log(radioHolder);
          if (radioHolder.find("input[type=radio]:checked").length == 0) {
            radioHolder.find("input").addClass('is-invalid');
            valid = false;
          };
        });
    };
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
          jsonString  = `'${dayID}':{ 'openingHour':'${openingHour}', 'closingHour':'${closingHour}'}`;
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
    var all_owners = $(".new-contact-details");
    var detailsClone = all_owners[0].cloneNode(true);
    var type = ($(this).attr("id") == "defaultCheck1") ? "owner" : "director";
    var repCard = $("fieldset.card.contact");
    if (this.checked == true) {
      $("fieldset.card.contact").attr(`data-${type}-form`, "true");
      this.parentElement.nextElementSibling.classList.remove("d-none");
      if (document.querySelectorAll('.new-contact-details').length == 1) {
          if ($(this).attr("id") == "defaultCheck2") {
              fillInCard(repCard[0], "director");
              repCard.removeClass("owner");
              repCard.addClass("director");
          } else {
              fillInCard(repCard[0], "owner");
              repCard.removeClass("director");
              repCard.addClass("owner");
          }
          var buttonRow = document.querySelector('.add-contact').parentNode;
          var cardBodyNode = buttonRow.parentNode;
          var hr = document.createElement('hr');
          detailsClone.classList.remove('d-none');
          cardBodyNode.insertBefore(detailsClone, buttonRow);
          cardBodyNode.insertBefore(hr, buttonRow);

          detailsClone.querySelector('.contact-name').innerHTML = document.querySelector("#sports_centre_representative_name").value;
          detailsClone.querySelector('.contact-email').innerHTML = document.querySelector("#sports_centre_representative_email").value;
          detailsClone.classList.add("rep-contact");
      }
    } else { // remove the created representative.
      //detailsClone.setAttribute("data-contact-type", "Account Representative");
      //console.log(this.next());
      repCard.attr(`data-${type}-form`, "false");
      if ($(this).attr("id") == "defaultCheck2") {
          fillInCard(repCard[0], "owner");
          repCard.removeClass("director");
          repCard.addClass("owner");
      } else {
          fillInCard(repCard[0], "director");
          repCard.removeClass("owner");
          repCard.addClass("director");
      }
      if (all_owners.length > 1 && ($(this).closest("fieldset").find("input[type=checkbox]:checked").length == 0)) {
          console.log("removed");
          var last_owner = all_owners.last();
          last_owner.next().remove();
          last_owner.remove();
      }
      this.parentElement.nextElementSibling.classList.add("d-none");

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
  $("body").on("click", "#addNewContact", function() {

    var card = $(this).closest("fieldset.card.contact");
    var contactType = card.hasClass("owner") ? $("#contactIsOwner").prop("checked", true) : $("#contactIsDirector").prop("checked", true);
    // always refresh so clone element is new.
    var details = document.querySelector(".new-contact-details");
    var detailsClone = details.cloneNode(true);
    detailsClone.classList.remove('d-none');
    detailsClone.classList.remove('original');
    //detailsClone.setAttribute("data-form", "");

    var ownerButtonNode = document.querySelector('button.add-contact').parentNode;
    var parentCardNode = ownerButtonNode.parentNode;
    var hrTag = document.createElement('hr');

    var new_owner_name = document.querySelector(".new-contact-name").value;
    var new_owner_email = document.querySelector(".new-contact-email").value;
    add_contact_card.classList.add("d-none");
    owner_card.classList.remove("d-none");
    $("input.new-contact-name").val("");
    $("input.new-contact-email").val("");

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
      $("#contactIsDirector").prop("checked", false);
      $("#contactIsOwner").prop("checked", false);
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
          if (index > 1) {
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

        contact_sub_heading.children[0].innerHTML = "Add any individual who owns 25% or more of " + companyName;
        add_contact_button.children[1].innerHTML = "Add another owner";
        add_contact_button.setAttribute("data-form", "owner");
        owner_list.each( function(index) {
          //console.log(contact_details);
          if (index > 1) {
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
