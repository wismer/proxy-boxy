define(["jquery", "draftview"], function($, DraftView){

  var Drafter = function() {
    this.stats = {
      "white": 0,
      "black": 0,
      "red": 0,
      "blue": 0,
      "green": 0,
      "multi": 0,
      "land": 0,
      "artifact": 0
    }
  }

  Drafter.prototype = {
    buildAttributes: function(name, expansion) {
      var cards = this.deck.get("player");
      var self = this;
      function categorize(pack, cid) {
        var card = pack[0];
        var color = card.getColor();

        self.stats[color] += pack.length;
      }

      _.each(cards, categorize)

      self.stats.name = name
      self.stats.expansion = expansion

      return { deck: self.stats }
    },

    randomizeBooster: function(cards, booster) {
      function addBasicLands () {
        var lands = []
        var basic = _.filter(cards, function(card){
          return card.isBasicLand()
        })

        _.each(_.uniq(basic), function(card){
          for (i = 0; i < 20; i++) { lands.push(card) }
        })

        return lands
      }

      function isNormal(freq) {
        return freq === "uncommon" || freq === "rare" || freq === "common";
      }

      booster = _.filter(_.flatten(booster), function(freq){
        return isNormal(freq)
      })

      var n = booster.length === 15 ? 6 : 10
      var draftedCards = [];

      for (var i = 0; i < n; i++) {
        var random = _.map(booster, function(b){
          while (typeof b === "string") {
            var card = _.sample(cards)
            if (card.hasFrequency(b)) {
              return card;
            }
          }
        })
        draftedCards.push(random)
      }

      function toObj(obj) {
        cards = _.flatten(draftedCards).concat(addBasicLands())
        _.each(cards, function(card){
          if (obj[card.cid]) {
            obj[card.cid].push(card)
          } else {
            obj[card.cid] = [card]
          }
        })
        return obj;
      };

      return toObj({});
    },

    request: function(req, selector) {
      function renderList(sets) {
        if (selector) {
          var list = _.map(sets, function(set){
            return "<option code='" + set.code + "'>" + set.name + "</option>"
          }).join("\n")
          selector.html(list)
        }
      }

      var url;

      if (req.isInternal) {
        url = "/decks/" + req.deckID + ".json"
        $.ajaxSetup({data: req.cardData })
      } else {
        url = "http://mtgjson.com/json/" + req.mtgjsonID + ".json"
      }

      $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        async: false,
        success: function(data, status, xhr) {
          if (data) { req.jsonData = data }
        }
      })

      renderList(req.jsonData)
      return req;
    },

    renderLists: function() {

    },

    mergeCards: function(cardData) {
      var cards = {};

      function add(n, card) {
        var count = []
        for(i = 0; i < n; i++) {
          count.push(card);
        }

        return count;
      }

      _.each(cardData, function(d){
        var card = deck.cards[d.multiverseid]
        cards[card.cid] = add(d.card_count, card)
      })

      return cards;
    },

    textRenderer: function(text) {

    },

    renderCard: function(elem) {
      var side = elem.attr('class')
      var cards = this.deck.get(side);
      var card = cards[elem.attr('cid')][0]
      $("div.card-img").append("<img src=" + card.link + " width=240 height=320>")
      $("#card-detail div.card-text p.cost").html(card.manaCost)
      $("#card-detail div.card-text p.text").append(card.text)
    },

    swapCard: function(cid, section) {
      var sideboard = this.deck.get("sideboard")
      var player = this.deck.get("player")

      function moveCard(cardset, card) {
        if (cardset[cid]) {
          cardset[cid].push(card)
        } else {
          cardset[cid] = [card]
        }
      }

      function removeCard(origin, destination) {
        var card = origin[cid].pop();
        if (origin[cid].length === 0) {
          delete origin[cid]
        }

        moveCard(destination, card)
      }

      if (section === "player") {
        removeCard(player, sideboard)
      } else {
        removeCard(sideboard, player)
      }

      this.render();
    },

    beginDraft: function() {
      var deck = this.deck;
      this.view = new DraftView({model: deck});
      this.view.render(this.collector);
    },

    imgLink: function(id) {

      // var card = _.find(this.draft.get("cards"), function(c){ return id === c.id })
      // return
    }
  }

  Drafter.prototype.setView = function() {
    var view = this.view = new DraftView({model: this.deck})
    var drafter = this;
  }


  return new Drafter();
})
