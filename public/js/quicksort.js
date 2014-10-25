require(["./app"], function(){
  require(["d3", "underscore"], function(d3, _){
    var svg = d3.select('#content').append('svg').attr('height', 900).attr('width', 1200)
    var height = 900;
    var width = 1200;
    var timer = 1000;
    var numbers = [5,21,14,1,3,6,22,27,12,17,11,13,4];
    var offset = 0;
    var bars = svg.selectAll('.bars')
      .data(numbers).enter().append('g')
      .attr('class', 'bars')
      .attr('transform', 'translate(0,-50)')

    bars.append('rect')
      .attr('y', function(d,i){ return height - (d * 15) })
      .attr('x', function(d,i){ return i * 60; })
      .attr('height', function(d,i){ return d * 15 })
      .attr('width', function(d,i){ return 50; })
      .style('fill', 'blue')

    bars.append('text')
      .attr('y', function(d,i){ return height + 25 })
      .attr('x', function(d,i){ return (i * 60) + 25 })
      .text(function(d){ return d; })
      .style('text-anchor', 'middle')

    function move(pivot, n, array, i) {
      function selectBar(num) {
        return d3.selectAll('g.bars').filter(function(d,i){
          return d === num
        })
      }

      function selectBarByX(x) {
        return d3.selectAll('g.bars').filter(function(d,i){
          return d3.select(this).select('rect').attr('x') === x.toString();
        })
      }

      function highlight(bar) {
        bar.select('rect').style('fill', 'red').transition().delay(500)
          .style('fill', 'blue')
      }

      function locX(num) {
        var bar = selectBar(num);

        if (bar.size() > 0) {
          return parseInt(bar.select('rect').attr('x'))
        } else {
          return false;
        }
      }

      function notEvaluated(num) {
        return _.some(array, function(n){ return n === num });
      }

      function change(min, max, activePivot) {
        // if (offset === 120) debugger
        var behindPivot = _.some(array, function(n){
          return n === selectBarByX(activePivot.x + 60).datum();
        })

        if (!behindPivot) {

        }

        while (max >= min) {

          // debugger
          var bar = selectBarByX(max);

          if (bar) {
            if (max <= min) {
              bar.select('rect').transition().attr('x', 720)
                .style('fill', 'blue');

              bar.select('text').transition().attr('x', 745);
            } else {
              bar.select('rect').transition().attr('x', max - 60)
                .style('fill', 'blue');

              bar.select('text').transition().attr('x', max - 35);
            }
          }

          max -= 60;
        }
      }

      var active = {
        pivot: { bar: selectBar(pivot), x: locX(pivot) },
        currentBar: { bar: selectBar(n), x: locX(n) },
        offset: offset
      }

      highlight(active.pivot.bar);
      highlight(active.currentBar.bar);
      console.log(pivot, n)
      if (pivot < n) {
        change(offset, 720, active.pivot);
      } else {
        offset += 60;
      }
    }

    function step(pivot, n, array, i) {
      setTimeout(move, timer += 1000, pivot, n, array, i)
    }

    function quicksort(array, timer, original) {

      if (array.length <= 1) {
        return array;
      }

      var pivot = array.pop();
      var lesser = [];
      var greater = [];

      for (var i = 0; i < array.length; i++) {
        step(pivot, array[i], array, i)
        if (pivot < array[i]) {
          greater.push(array[i])
        } else {
          lesser.push(array[i])
        }
      }

      var leftSorted = quicksort(lesser, timer, original);
      var rightSorted = quicksort(greater, timer, original);
      return leftSorted.concat([pivot]).concat(rightSorted);
    }

    console.log(quicksort(numbers))
  })
})
