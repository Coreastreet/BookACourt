const { environment } = require('@rails/webpacker')
const erb = require('./loaders/erb')

const webpack = require("webpack");
environment.plugins.prepend( "Provide",
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    jquery: "jquery",
    'window.jQuery': 'jquery',
    moment: 'moment',
    Popper: ["popper.js", "default"],
  })
)

environment.loaders.prepend('erb', erb)
module.exports = environment;
