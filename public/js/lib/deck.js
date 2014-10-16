define(["./backbone-min", "jquery"], function(Backbone, $){
  var Deck = Backbone.Model.extend({
    moveCard: function(origin, destination, cid) {
      var originSet = this.get(origin)
      var destSet = this.get(destination)
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
    },

    breakdown: function(painter) {
      var cards = this.get("cards");
      var set = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      var costs = {};

      for(var i = 0; i < 13; i++) {
        costs[i] = { count: 0, text: i, paint: painter(i) }
      }

      costs.land = { count: 0, text: "Land", paint: "gray" };

      var categories = {
        colors: {
          white: { count: 0, paint: "#F3F5BF" },
          red: { count: 0, paint: "#820000" },
          green: { count: 0, paint: "#2B794D" },
          blue: { count: 0, paint: "#93C7F9" },
          artifact: { count: 0, paint: "#675A52" },
          black: { count: 0, paint: "#414141" },
          multi: { count: 0, paint: "#FFD2A7" },
          land: { count: 0, paint: "#AAAAAA" }
        },

        types: {
          instant: { count: 0, paint: "#F3F5BF" },
          land: { count: 0, paint: "#2B794D" },
          sorcery: { count: 0, paint: "#414141" },
          enchantment: { count: 0, paint: "#93C7F9" },
          creature: { count: 0, paint: "#AAAAAA" },
          artifactCreature: { count: 0, paint: "#675A52" },
          artifact: { count: 0, paint: "#FF73FD" }
        },

        costs: costs
      };

      function filter(inDeck, cid) {
        var card = inDeck.card;

        _.each(categories, function(val, key, list){
          var subtype = card.subCategory(key).toString().toLowerCase();

          if (subtype) {
            list[key][subtype].count += inDeck.count
          }
        })
      }

      _.each(cards, filter)
      return categories;
    }
  })

  return Deck;
})
