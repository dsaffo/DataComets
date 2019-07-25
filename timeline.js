const Timeline = (function (dispatch, data, dimensions) {

  let chartComps = [];

  let navStates = {
    0: 'Manual Mode',
    1: 'Altitude Control Mode',
    2: 'Position Control Mode',
    3: 'Auto Mission Mode',
    4: 'Auto Loiter Mode',
    5: 'Auto Return To Launch Mode',
    6: 'RC Recover Mode',
    7: 'Auto Return To Ground Station On Data Link Loss',
    8: 'Auto Land On Engine Failure',
    9: 'Auto Land On GPS Failure',
    10: 'Acro Mode',
    11: 'Free Slot',
    12: 'Descend Mode',
    13: 'Termination Mode',
    14: 'Off Board',
    15: 'Stabilized Mode',
    16: 'Rattitide Mode (Do A Flip)',
    17: 'Takeoff',
    18: 'Land',
    19: 'Auto Follow',
    10: 'Precision Land With Traget',
    21: 'Orbit',
    22: 'Max'
  }

  let allModes = [];
  let modes = [];

  for (let i = 0; i < data['vehicle_status'].length; i++) {
    allModes.push(data['vehicle_status'][i]['nav_state'])
  }
  lastMode = allModes[0];
  modes.push({
    val: lastMode,
    time: data['vehicle_status'][0]['timestamp'],
    mode: navStates[lastMode]
  })
  for (let i = 0; i < allModes.length; i++) {
    if (allModes[i] != lastMode) {
      lastMode = allModes[i];
      modes.push({
        val: lastMode,
        time: data['vehicle_status'][i]['timestamp'],
        mode: navStates[lastMode]
      })
    }
  }

  console.log(modes)

  dispatch.on('chartCreated.timeline', function (comps) {
    chartComps.push(comps)
  });

  let test = function () {
    // console.log(Xarray.length)
  }

  dispatch.on('timelineBrushed.timeline', function (window) {
    //console.log(window)
  });


  let timelineLineChartSpec = {
    margin: {
      top: 5,
      right: 10,
      bottom: 20,
      left: 10
    },
    width: dimensions.timeline.width - 10,
    height: dimensions.timeline.height - 10
  }

  let xAxis = '';


  dispatch.on('hover.timeline', function (time) {
    d3.select('#hoverTimeline').style("opacity", 0.5).attr("x", xAxis(time)).attr("y", 0);
  });

  dispatch.on('unhover.timeline', function () {
    d3.select('#hoverTimeline').style("opacity", 0)
  });

  dispatch.on('mapped.timeline', function (chartInfo) {
    xAxis = lineChartGen('timeline-container', chartInfo.what, timelineLineChartSpec, chartInfo.color);
  })

  function lineChartGen(where, what, options, color) {
    d3.select('#' + where).selectAll('svg').remove();

    df = data[what.log]
    //console.log(where)
    //console.log(what.data, what.x, what.y);
    //console.log(df)
    let yVal = what.y;
    let xVal = what.x;
    let vals = [];

    for (let i = 0; i < df.length; i++) {
      vals.push(df[i][yVal]);
    }

    var margin = {
        top: options.margin.top,
        right: options.margin.right,
        bottom: options.margin.bottom,
        left: options.margin.left
      },
      width = options.width - (margin.right + margin.left) // Use the window's width 
      ,
      height = options.height - (margin.top + margin.bottom) // Use the window's height

    var brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on("start brush end", brushed)

    var svg = d3.select('#' + where)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleLinear()
      .domain(d3.extent(df, function (d) {
        return d[xVal] / 10000000;
      }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    var y = d3.scaleLinear()
      .domain(d3.extent(df, function (d) {
        return d[yVal];
      }))
      .range([height, 0]);
    svg.append("g");

    svg.append("path")
      .datum(df)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return x(d[xVal] / 10000000)
        })
        .y(function (d) {
          return y(d[yVal])
        })
      )

    var focus = svg
      .append('g')
      .append('rect')
      .attr("id", 'hoverTimeline')
      .style("fill", "black")
      .attr("stroke", "black")
      .attr('stroke', 8.5)
      .attr('height', height)
      .attr('width', 1)
      .style("opacity", 0)


    var gBrush = svg.append("g")
      .attr("class", "brush")
      .call(brush)


    // X - axis label for timelinem,.kl
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("transform",
        "translate(" + (width + margin.left) + " ," +
        (height + margin.top + 0.5 * margin.bottom) + ")")
      .style("font-size", "16px")
      .text("Time (s)");


    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);


    let modesGroup = svg.append("g").selectAll('rect').data(modes);

    let modeMarks = modesGroup.enter();

    let h = d3.scaleOrdinal(["rgb(22,20,47)", "rgb(144,0,61)", "rgb(232,7,54)", "rgb(248,93,63)", "rgb(109,197,221)", "rgb(44,113,148)", "rgb(98,236,182)", "rgb(42,107,42)", "rgb(119,190,32)", "rgb(110,57,1)", "rgb(246,187,134)", "rgb(173,118,107)", "rgb(188,205,151)", "rgb(76,62,118)", "rgb(171,145,220)", "rgb(112,44,180)", "rgb(251,93,231)", "rgb(159,4,252)", "rgb(63,244,76)", "rgb(192,113,12)", "rgb(243,212,38)"])

    modeMarks.append('rect')
      .attr('height', 10)
      .attr('width', 10)
      .attr('opacity', 0.7)
      .attr("transform", "translate(0," + height + ")")
      .attr('fill', function (d) {
        return h(d.val)
      })
      .attr('x', function (d) {
        //console.log(x(d.time / 10000000));
        return x(d.time / 10000000)
      })
      .attr('y', 0)
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html(d.mode + " " + Math.round(d.time / 10000000) + "s")
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
          .style("color", 'white')
          .style("background", h(d.val));
        dispatch.call('hover', this, d.time / 10000000, 'hi');
      })
      .on("mouseout", function (d) {
        div.transition()
          .duration(500)
          .style("opacity", 0);
        dispatch.call('unhover', this)
      });


    //console.log(d3.brushSelection(gBrush.node))

    gBrush.call(brush.move, d3.extent(df, function (d) {
      return d[xVal] / 10000000;
    }).map(x));

    let overviewTab = d3.select('#overview');
    let pinnedTab = d3.select('#pinned');
    let allTab = d3.select('#all');

    function brushed() {



      // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

      var s = d3.event.selection || x.range();

      dispatch.call('timelineBrushed', this, [s.map(x.invert)[0], s.map(x.invert)[1]]);

      if (chartComps.length > 0) {
        for (let i = 0; i < chartComps.length; i++) {
          let chart = chartComps[i];
          try {
            //console.log(d3.select('#' + chartComps[i]['id'])['_groups'][0][0]['parentElement']['parentElement']['parentElement']['parentElement']['style'].display)
            if (chart.spec.default == true && overviewTab.style('display') == 'block') {
              chart['axis'].domain(s.map(x.invert, x));
              d3.select('#' + chart['id']).attr("d", chart['line']);
              d3.select("#xAxis" + chart['id']).call(d3.axisBottom(chart['axis']));
            } else if (chart.spec.pinned == true && pinnedTab.style('display') == 'block') {
              chart['axis'].domain(s.map(x.invert, x));
              d3.select('#' + chart['id']).attr("d", chart['line']);
              d3.select("#xAxis" + chart['id']).call(d3.axisBottom(chart['axis']));
            } else if (chart.spec.pinned == false && allTab.style('display') == 'block' && d3.select('#' + chart.what.log).attr('class') == 'active') {
              //console.log('#' + chart.what.log,d3.select('#' + chart.what.log).attr('class') == 'active');
              chart['axis'].domain(s.map(x.invert, x));
              d3.select('#' + chart['id']).attr("d", chart['line']);
              d3.select("#xAxis" + chart['id']).call(d3.axisBottom(chart['axis']));
            }

          } catch (err) {

          }
        }
      }


    }

    return x;
  }





});
