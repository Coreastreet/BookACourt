// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("jquery")
require("jquery-ui")
require("moment/moment.js")
require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("bootstrap-datepicker/dist/js/bootstrap-datepicker.js")
require("packs/autocomplete")
require("packs/select_table")
require("packs/multiform")
require("packs/dashboard")
require("packs/userDashboard")
require("packs/clock")
require("packs/map")
require("packs/payment")
require("packs/prices")
require("packs/manage_peak_hours")
require("packs/manage_bookings")
require("packs/select_courts_table")
require("packs/onBoardingBusinessDetails")
//require("packs/shortcut")
require("mousetrap")
//require("packs/mailer")
//import('bootstrap-email');
//require("leaflet-geosearch")
import "bootstrap"
import "./custom"
import "./styles"

document.addEventListener("turbolinks:load", () => {
  $('[data-toggle="tooltip"]').tooltip()
})
// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
