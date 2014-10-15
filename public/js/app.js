requirejs.config({
  baseUrl: "js/lib",
  paths: {
    app: "../app",
    underscore: "../lib/underscore-min",
    backbone: "../lib/backbone-min",
    jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min",
    d3: "http://d3js.org/d3.v3.min",
    draft: "../draft",
    decks: "../decks"
  }
})

//
//
// requirejs(['deck', 'jquery', 'd3', 'underscore'], function(deck, $, d3, _, backbone){
//
// });
