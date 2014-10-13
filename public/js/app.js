requirejs.config({
  baseUrl: "js/lib",
  paths: {
    app: "../app",
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min",
    d3: "http://d3js.org/d3.v3.min",
    underscore: "../lib/underscore-min",
    backbone: "../lib/backbone-min",
    draft: "../draft"
  }
})

//
//
// requirejs(['deck', 'jquery', 'd3', 'underscore'], function(deck, $, d3, _, backbone){
//
// });
