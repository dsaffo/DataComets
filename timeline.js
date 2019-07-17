const Timeline = (function (dispatch, data, dimensions) {

  let chartComps = [];

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

  lineChartGen('timeline-container', {
    data: 'vehicle_gps_position',
    x: 'timestamp',
    y: 'alt'
  }, timelineLineChartSpec)

  function lineChartGen(where, what, options) {

    df = data[what.data]
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
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function (d) {
          return x(d[xVal] / 10000000)
        })
        .y(function (d) {
          return y(d[yVal])
        })
      )

    var gBrush = svg.append("g")
      .attr("class", "brush")
      .call(brush)


    // X - axis label for timeline
    svg.append("text")
      .attr("class", "x label")
      .attr("text-anchor", "end")
      .attr("transform",
        "translate(" + (width + margin.left) + " ," +
        (height + margin.top + 0.5 * margin.bottom) + ")")
      .style("font-size", "16px")
      .text("Time (s)");

    //console.log(d3.brushSelection(gBrush.node))

    gBrush.call(brush.move, [96, 120].map(x));

    function brushed() {

      //let focusses = d3.selectAll(".focus");

      max = d3.max(data['vehicle_gps_position'], function (d) {
        return parseFloat(d['timestamp']);
      });
      min = d3.min(data['vehicle_gps_position'], function (d) {
        return parseFloat(d['timestamp']);
      });


      if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom




      var s = d3.event.selection || x.range();


      if (chartComps.length > 0) {
        for (let i = 0; i < chartComps.length; i++) {
          try {
            //console.log(d3.select('.' + chartComps[i]['id']))
            chartComps[i]['axis'].domain(s.map(x.invert, x));
            d3.select('#' + chartComps[i]['id']).attr("d", chartComps[i]['line']);
            d3.select("#xAxis" + chartComps[i]['id']).call(d3.axisBottom(chartComps[i]['axis']));
          } catch (err) {
            
          }
        }
      }



      dispatch.call('timelineBrushed', this, [s.map(x.invert)[0], s.map(x.invert)[1]]);
    }
  }





});
