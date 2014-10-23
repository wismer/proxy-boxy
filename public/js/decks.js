require(["./app"], function(){
  require(["jquery", "card", "deck", "d3"], function($, Card, Deck, d3){
    var collection = {};

    var request = function(id, url, type) {
      $.ajax({
        url: url,
        method: "GET",
        dataType: 'json',
        success: function(data, err, xhr) {
          collection[id][type] = data;
        }
      })
    }

    var createCircles = function(cardData, filter) {
      d3.selectAll("svg").remove();
      var color = d3.scale.category20();
      var radius = Math.min(400, 400) / 2;


      function remapToArray(data) {

        var tally = _.map(data, function(val, key){
          return { text: key + " - " + val.count, count: val.count, paint: val.paint };
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

        var svg = d3.select("#vizualizer div." + section).append("svg")
          .attr("height", 400)
          .attr("width", 800)

        var arcs = svg.selectAll("." + elemClass).data(pieChart(data)).enter()
          .append("g")
          .attr("class", elemClass)
          .attr("transform", "translate(600,200)")

        var legend = svg.selectAll('.legend').data(data).enter()
          .append('g')
          .attr('class', 'legend')

        legend.append('rect')
          .attr('height', 30)
          .attr('width', 30)
          .attr('y', function(d, i){ return i * 35 })
          .attr('x', 900)
          .style('fill', function(d) { return d3.rgb(d.paint) })
          .style('stroke', 'black')
          .transition()
          .delay(500)
          .attr('x', 440)


        legend.append('text')
          .attr('x', 700)
          .transition()
          .delay(500)
          .attr('x', 480)
          .attr('y', function(d,i){ return (i * 35) + 22 })
          .attr('dx', "1.0em")
          .style('text-anchor', 'left')
          .text(function(d){ return d.text.toUpperCase(); })

        arcs.transition().delay(500).attr("transform", "translate(200,200)")

        arcs.append("path")
          .attr("d", arc)
          .style("fill", function(d){ return d3.rgb(d.data.paint); })
          .style('stroke', 'black')

      }

      renderCircle(filter + "-pie", filter, cardData[filter]);
    };

    $("#viz div").mouseenter(function(e){
      var deckID = $(this).parent("div").attr("deck");
      var expansion = $(this).parent("div").attr("exp");
      var cards = {};
      var filter = $(this).attr('class')
      var data;

      if (!collection[deckID]) {
        collection[deckID] = {};
        request(deckID, "http://mtgjson.com/json/" + expansion + ".json", "cards")
        request(deckID, "/deck-info/" + deckID, "deck")
      } else if (collection[deckID]['cards'] && collection[deckID]['deck']) {
        _.each(collection[deckID]['cards'].cards, function(card){
          var id = card.multiverseid
          var deck = collection[deckID]['deck'][id]
          if (deck) {
            cards[id] = {card: new Card(card), count: deck }
          }
        })

        var deck = new Deck({cards: cards});
        data = deck.breakdown(d3.scale.category20());
      } else {
        $(this).css("background-color", "yellow")
      }

      if (data) {
        createCircles(data, filter);
      }
    })

  })
})
