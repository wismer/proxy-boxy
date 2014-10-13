define(["underscore-min", "./backbone-min", "jquery"], function(_, Backbone, $){
  var Deck = Backbone.Model.extend({
    moveCard: function(origin, destination, cid) {
      var originSet = this.get(origin)
      var destSet = this.get(destination)
      // debugger
      var card = originSet[cid].pop();

      if (originSet[cid].length === 0) {
        delete originSet[cid]
      }

      if (destSet[cid]) {
        destSet[cid].push(card)
      } else {
        destSet[cid] = [card]
      }
    },

    save: function() {
      var that = this;
      Backbone.sync("create", that, {url: "/decks"})
    },

    formatCards: function() {
      var cards = _.map(this.get("cards"), function(pack, cid) {
        return { card_count: pack.length, multiverseid: cid }
      });

      this.set({cards: cards})
    },

    collateCards: function(category) {
      var player = this.get("player")
      var sideboard = this.get("sideboard")



      function sort(cards, category) {
        var items = {};

        var setKey = function(subcat) {
          if (!items[subcat]) { items[subcat] = {} }
        }

        var sorter = function(subset, cid) {
          var card = subset[0];
          var key = card.subCategory(category)
          setKey(key)
          items[key][cid] = subset
        }

        _.each(cards, sorter);
        return items;
      }
    }
  })

  return Deck;
})
