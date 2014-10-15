define(["./underscore-min", "./backbone-min", "jquery"], function(_, Backbone, $){
  var Card = Backbone.Model.extend({
    initialize: function(card) {
      card: card
      this.cid = card.multiverseid
      this.link = "http://mtgimage.com/multiverseid/" + this.cid + ".jpg"
      this.text = this.formatText(card.text);
      this.manaCost = "COST: " + this.formatText(card.manaCost);
    },

    isBasicLand: function() {
      return this.get("rarity") === "Basic Land"
    },

    getType: function() {
      var types = this.get("types")
      return types.length > 1 ? types.join("") : types[0]
    },

    getColor: function() {
      var colors = this.get("colors");
      if (colors) {
        return colors.length > 1 ? "multi" : colors[0].toLowerCase();
      } else if (this.isArtifact()) {
        return "artifact";
      } else {
        return "land";
      }
    },

    getCost: function() {
      var cost = this.get("cmc")

      if (cost) {
        return cost
      } else {
        return "Land"
      }
    },

    subCategory: function(category) {
      if (category === "types") {
        return this.getType()
      } else if (category === "cmc") {
        return this.getCost()
      } else {
        return this.getColor()
      }
    },

    removeLink: function(section) {
      $("#" + section + " a[multiverse=" + this.get("multiverseid") +"]").remove()
    },

    formatText: function(text) {
      function src(sym) {
        return "<img src='/img/magic/" + sym + ".gif'" + " height=15 width=15>";
      }

      function convert(match) {
        if (match === "{T}" || match === "{Q}") {
          return "<span>" + src(match[1]) + "</span>";
        } else {
          return "<span>" + src(match[1]) + "</span>";
        }
      }

      if (text) {
        text = text.replace(/\{(.+?)\}/g, convert)
      }

      return text;
    },

    tag: function(n, section) {
      var link = $("<a>", {
        href: this.link,
        cid: this.cid,
        class: section,
        text: n + "x " + this.get("name")
      })

      return $("<div>").append(link).html();
    },

    hasFrequency: function(freq) {
      return this.get("rarity").toLowerCase() === freq;
    },

    isArtifact: function() {
      return this.has("cmc") && (!this.has("colors"))
    }
  })

  return Card;
})
