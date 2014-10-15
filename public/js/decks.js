require(["./app"], function(){
  require(["jquery", "card", "deck", "d3"], function($, Card, Deck, d3){
    var request = function(url) {
      var result;
      $.ajax({
        url: url,
        async: false,
        method: "GET",
        dataType: 'json',
        success: function(data, err, xhr) {
          result = data;
        }
      })

      return result;
    }

    $("table button").click(function(e){
      var expansion = $(this).attr("exp")
      var cardInfo = request("/deck-info/" + $(this).val())
      var deckInfo = request("http://mtgjson.com/json/" + expansion + ".json")
      var cards = {};
      _.each(deckInfo.cards, function(card){
        var id = card.multiverseid
        if (cardInfo[id]) {
          cards[id] = {
            card: new Card(card),
            count: cardInfo[id]
          }
        }
      })
      var deck = new Deck({cards: cards})
      var data = deck.breakdown();

    })
  })
})
