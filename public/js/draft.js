require(["./app"], function(){
  require(["deck", "card", "drafter", "jquery"], function(Deck, Card, drafter, $){
    _.templateSettings = {
      interpolate:  /\{\{(.+?)\}\}/g
    };

    drafter.request({isInternal: false, mtgjsonID: "SetList"}, $("#set-list"))

    $("#set-list").on("change", function(){
      var code = $(this).children("option:selected").attr("code")
      var expansion = drafter.request({mtgjsonID: code})

      var cards = _.map(expansion.jsonData.cards, function(card){
        return new Card(card);
      })

      var draft = drafter.randomizeBooster(cards, expansion.jsonData.booster)

      // drafter.sideboard = new Deck({name: "sideboard", cards: draft})
      // drafter.player = new Deck({name: "player", cards: {}})

      drafter.deck = new Deck({ cards: cards,
                                name: expansion.name,
                                code: code,
                                sideboard: draft,
                                player: {} });
      drafter.beginDraft();
      $("#save-set").on("submit", function(e){
        // e.preventDefault();
        var name = $(this).children("input").val();
        var draft = new Deck({
          deck: {
            name: name,
            expansion: expansion.name
          }
        })

        var cards = _.map(drafter.deck.get("player"), function(pack, cid) {
          return { card_count: pack.length, multiverseid: cid }
        });

        draft.set({cards: cards})
        draft.save({url: "/deck/new"})
      })
    })


  })
})
