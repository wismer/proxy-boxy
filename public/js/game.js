require(["./app"], function(){
  require(["underscore", "backbone", "game", "jquery"], function(_, Backbone, Game, $){
    var decks = {};
    var initializeCards = function() {

      $.getJSON("/deck-info/1.json", function(data){
        decks[1] = data;
      })

      $.getJSON("http://mtgjson.com/json/ICE.json", function(data){
        decks["ICE"] = data;
      })
    }

    initializeCards();

    $("button").click(function(e){
      if (decks["ICE"] && decks[1]) {
        debugger
      }
    })
  })
})
