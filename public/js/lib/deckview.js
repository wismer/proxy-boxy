define(["underscore", "backbone"], function(_, Backbone){
  var DeckView = Backbone.View.extend({
    el: "div",
    events: {
      "click .library-opt": "libraryAction"
    },

    libraryAction: function() {
      var opt = $(this).attr('opt');

      if (opt === "viewAll") {
        
      }
    }
  })
})