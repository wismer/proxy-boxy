define(["./backbone-min", "jquery"], function(Backbone, $){
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
    },

    breakdown: function() {
      var cards = this.get("cards")
      var categories = {
        color: {
          white: 0,
          red: 0,
          green: 0,
          blue: 0,
          artifact: 0,
          black: 0,
          multi: 0,
          land: 0
        },

        type: {
          instant: 0,
          land: 0,
          sorcery: 0,
          enchantment: 0,
          creature: 0,
          artifactCreature: 0,
          artifact: 0
        },

        cost: [0,0,0,0,0,0,0,0,0,0,0,0]
      };

      function byColor (inDeck, cid) {
        var cardColor = inDeck.card.getColor();
        categories.color[cardColor.toLowerCase()] += inDeck.count
      }

      function byType (inDeck, cid) {
        var type = inDeck.card.getType();
        categories.type[type.toLowerCase()] += inDeck.count
      }

      function byCost (inDeck, cid) {
        var cmc = inDeck.card.get("cmc")

        if (cmc) {
          categories.cost[cmc] += inDeck.count
        }
      }

      _.each(cards, function(inDeck, cid){
        byColor(inDeck, cid)
        byCost(inDeck, cid)
        byType(inDeck, cid)
      })

      debugger

      return categories;
    }
  })

  return Deck;
})
