define(["jquery", "underscore"], function($, _){
  var Player = Backbone.Model.extend({
    draw: function(n) {
      n = n || 7;
      var hand = this.get('hand');
      for (var i = 0; i < n; i ++) {
        hand.push(this.library.shift())
      }
    },

    discard: function(rule) {
      var hand = this.get("hand");

      if (rule) {
        
      }
    }
  }

  var PlayerView = Backbone.Model.extend({
    el: 'div',
    attributes: { id: this.model.get('name') },

    events: {
      "click .card-opt": "deploy"
    },

    deploy: function() {
      // this.$el.
    }
  })
})