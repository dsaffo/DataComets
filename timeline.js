const Timeline = (function (dispatch, data, dimensions) {

  let Xarray = [];

  dispatch.on('openBranch.timeline', function (recordXs) {
    Xarray = recordXs
    test();
  });

  let test = function () {
    console.log(Xarray.length)
  }


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
  
  lineChartGen('timeline-container', {data: 'vehicle_gps_position', x:'timestamp', y: 'alt'}, timelineLineChartSpec)

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
      width = options.width - (margin.right + margin.left)// Use the window's width 
      ,
      height = options.height - (margin.top + margin.bottom)// Use the window's height

    var svg = d3.select('#' + where)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
/*
    var title = svg.append("text")
      .attr("x", 0 + margin.left / 2)
      .attr("y", 10)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .text(yVal);
*/
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
  }

});
