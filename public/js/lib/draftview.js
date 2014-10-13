define(["backbone-min"], function(Backbone){
  var DraftView = Backbone.View.extend({

    el: "#draft-board",

    events: {
      "mouseenter a": "renderImage",
      "mouseleave a": "collapseImage",
      "click a": "moveCard",
      "change #set-filter": "render"
    },

    collapseImage: function(e) {
      $("#card-detail").remove();
    },

    moveCard: function(e) {
      e.preventDefault();
      var cid = e.currentTarget.getAttribute("cid");
      var side = e.currentTarget.className;
      if (side === "sideboard") {
        this.model.moveCard(side, "player", cid)
      } else {
        this.model.moveCard(side, "sideboard", cid)
      }

      this.render();
    },

    template: _.template([
      "<div id=<%= section %>>",
        "<% _.each(cards, function(val, key){ %>",
          "<%= subcategoryTemplate({subcat: key}) %>",
          "<% _.each(val, function(pack, cid){ %>",
            "<% var card = pack[0]; %>",
            "<li><%= card.tag(pack.length, section) %></li>",
          "<% }) %>",
        "<% }) %>", "</div>"].join("\n")),

    subcategoryTemplate: _.template("<h1><%= subcat %></h1>"),

    renderImage: function(e) {
      e.preventDefault();
      var cid = e.currentTarget.getAttribute("cid");
      var section = e.currentTarget.className;
      var card = this.model.get(section)[cid][0]
      var data = {
        img: card.link,
        cost: card.manaCost,
        text: card.text,
        pos: e.pageX
      }

      var html = _.template($(".loadme").html(), data)
      this.$el.append(_.template(html, data))
    },

    render: function() {
      var category = $("#set-filter option:selected").val();
      function collector(cards) {
        var items = {};

        function sorter(subset, cid) {
          var card = subset[0];
          var subcat = card.subCategory(category)
          if (!items[subcat]) { items[subcat] = {} }
          items[subcat][cid] = subset
        }

        _.each(cards, sorter);
        return items;
      }

      var player = {
        cards: collector(this.model.get("player")),
        section: "player"
      }

      var sideboard = {
        cards: collector(this.model.get("sideboard")),
        section: "sideboard"
      }

      var view = this;
      var html = "";

      function applyTemplate(side) {
        var list = view.template({
          cards: side.cards,
          section: side.section,
          subcategoryTemplate: view.subcategoryTemplate
        })

        html += list;
        // view.$el.html(list)
      }
      _.each([sideboard, player], applyTemplate)
      this.$el.children("#board").html(html);
      return this;
    }
  })

  return DraftView;
})
