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

    var createCircles = function(cardData, selector) {
      var color = d3.scale.category20();
      var radius = Math.min(400, 400) / 2;


      function remapToArray(data) {

        var tally = _.map(data, function(val, key){
          return { text: key, count: val.count, paint: val.paint };
        });
        return _.filter(tally, function(val){
          return val.count > 0;
        })
      }

      function renderCircle(section, elemClass, cards) {
        var data = remapToArray(cards);

        // formats the object data into a d3.js friendly format (array of objs)

        var arc = d3.svg.arc().innerRadius(radius - 150).outerRadius(radius)
        var pieChart = d3.layout.pie()
          .sort(null)
          .value(function(d){ return d.count; });

        var svg = d3.select("#viz " + section).append("svg")
          .attr("height", 400)
          .attr("width", 400)

        var arcs = svg.selectAll("." + elemClass).data(pieChart(data)).enter()
          .append("g")
          .attr("class", elemClass)
          .attr("transform", "translate(200,200)");

        arcs.append("path")
          .attr("d", arc)
          .style("fill", function(d){ return d3.rgb(d.data.paint); })

        arcs.append("text")
          .attr("transform", function(d){ return "translate(" + arc.centroid(d) + ")"; })
          .attr("dy", "1.0em")
          .style("text-anchor", "middle")
          .text(function(d){ return d.data.text; })

      }

      renderCircle("div.costs", "costs", cardData.costs);
      renderCircle("div.types", "types", cardData.types);
      renderCircle("div.colors", "colors", cardData.colors);
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
      var data = deck.breakdown(d3.scale.category20());
      createCircles(data)
    })
  })
})
