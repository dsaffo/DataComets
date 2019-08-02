const Overview = (function (dispatch, data, dimensions) {

  let chartList = [];



  color1 = "#691433"

  color2 = "#91003E"


  color3 = "#E80936"


  color4 = "#F95E3F"
  
  color5= '#F7AC40'

  const default_charts = [{

      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Recorded (Meters)',
      unit: 'millimeters',
      color: color1
  },
    {
      data: data['vehicle_global_position'],
      log: 'vehicle_global_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Estimated (Meters)',
      color: color2
    },
    {
      data: data['position_setpoint_triplet'],
      log: 'position_setpoint_triplet',
      x: 'timestamp',
      y: 'current.alt',
      title: 'Altitude Set Points (Meters)',
      color: color3
    },
    {
      data: data['vehicle_air_data'],
      log: 'vehicle_air_data',
      x: 'timestamp',
      y: 'baro_alt_meter',
      title: 'Barometer Altitude (Meters)',
      color: color4
    },

    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[3]',
      title: 'Thrust (0=no thrust - 1=max thrust)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[0]',
      title: 'Roll (-1 - 1)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[1]',
      title: 'Pitch (-1 - 1)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[2]',
      title: 'Yaw (-1 - 1)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'vel_m_s',
      title: 'Velocity (Meters/second)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'remaining',
      title: 'Battery Remaining (0=Empty - 1=Full)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'current_filtered_a',
      title: 'Battery Current (Amps)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'discharged_mah',
      title: 'Battery Discharged (Milliamp Hours)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'noise_per_ms',
      title: 'Noise (Per Meters/second)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'jamming_indicator',
      title: 'Jamming Indicator'
    },
    {
      data: data['cpuload'],
      log: 'cpuload',
      x: 'timestamp',
      y: 'load',
      title: 'CPU Load (0 - 1)'
    }
  ]

  const multicharts = [[{

      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Recorded (Meters)',
      unit: 'millimeters',
      color: color1
  },
    {
      data: data['vehicle_global_position'],
      log: 'vehicle_global_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Estimated (Meters)',
      color: color5
    }]]


  let defaultPinnedLineChartSpec = {
    margin: {
      top: 5,
      right: 50,
      bottom: 25,
      left: 40
    },
    width: dimensions.tree.width,
    height: 150,
    pinned: false,
    default: true
  }


  for (let i = 0; i <multicharts.length; i++) {
    let starter = overviewChartGen('overview', multicharts[i], defaultPinnedLineChartSpec);
    if (i == 0) dispatch.call('mapped', this, starter);
  }


  function overviewChartGen(where, what, spec) {

    color = what[0].color || "#16132E"

    console.log(what)

    let chartData = what[0].data
    let yVal = what[0].y;
    let xVal = what[0].x;
    
    if (what[0].unit == 'millimeters'){
      chartData = convertMillimeters(chartData, yVal);
    }

    let id = 'chart' + chartNo;

    let margin = {
      top: spec.margin.top,
      right: spec.margin.right,
      bottom: spec.margin.bottom,
      left: spec.margin.left
    }
    let width = spec.width - margin.left - margin.right;
    let height = spec.height - margin.top - margin.bottom;

    let div = d3.select('#' + where)
      .append('div')
      .attr('id', 'card' + id)
      .attr('class', 'card-panel')

    

    div.append('a')
      .attr('id', 'mapSel' + chartNo)
      .style('float', 'right')
      .style('color', 'lightgrey')
      .append('i')
      .attr('class', 'mdi mdi-map small')
      .on('click', function () {
        dispatch.call('mapped', this, chartInfo)
      });

    div.append('a')
      .style('float', 'right')
      .style('color', function () {
        if (spec.pinned === true) {
          return "#16132E"
        } else {
          return "lightgrey"
        }
      })
      .attr('class', function () {
        if (spec.pinned === true) {
          return "on"
        } else {
          return "off"
        }
      })
      .on('click', function () {
        if (d3.select(this)["_groups"][0][0]['classList'][0] === "off") {
          dispatch.call('pinned', this, spec, what, id)
        } else if (d3.select(this)["_groups"][0][0]['classList'][0] === "on") {
          console.log('onclick')
          dispatch.call('unpinned', this, spec, id)
        }
      })
      .append('i')
      .attr('class', "mdi mdi-pin small")
    
    for (let i = 0; i < what.length; i++){

    var title = div.append("span")
      .attr("x", margin.right + margin.left + 10)
      .attr("y", margin.top - 5)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .text(function () {
        if (what[i].title != undefined) {
          return what[i].title
        } else {
          return what[i].y
        }

      });
    
    div.append('br')
    }


    let svg = div.append("svg")
      .attr("width", width)
      .attr("height", height + margin.bottom);

    let clip = svg.append("defs").append("clipPath")
      .attr("id", "clip" + chartNo)
      .append("rect")
      .attr("width", width - margin.right)
      .attr("height", height)
    //.attr("x", 0)
    //.attr("y", 0); 



    let lineChart = svg.append("g")
      .attr('id', 'main' + id)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("clip-path", "url(#clip" + chartNo + ")");

    var axes = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let lineGen = d3.line()
      .x(function (d) {
        return x(d.x)
      })
      .y(function (d) {
        return y(d.y)
      }).curve(d3.curveMonotoneX);

    let lineGen2 = d3.line()
      .x(function (d) {
        return d.x
      })
      .y(function (d) {
        return d.y
      }).curve(d3.curveMonotoneX);


    let xy = [];
    let yvals = [];


    for (let i = 0; i < chartData.length; i++) {
      yvals.push(chartData[i][yVal]);
      xy.push({
        x: chartData[i][xVal] / 10000000,
        y: chartData[i][yVal]
      });
    }



    simple = simplify(xy, 0.01, false);



    let x = d3.scaleLinear()
      .domain(d3.extent(simple, function (d) {
        return d.x;
      }))
      .range([0, width - margin.right]);

    let y = d3.scaleLinear()
      .domain(d3.extent(simple, function (d) {
        return d.y;
      }))
      .range([height - margin.top, 0]);

    axes.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr('id', 'xAxis' + id)
      .attr('class', 'axis')
      .call(d3.axisBottom(x));

    axes.append("g")
      .attr('class', 'axis')
      .call(d3.axisLeft(y).ticks(8).tickFormat(d3.format(",.2r")));



    lineChart.append("path")
      .datum(simple)
      .attr('class', 'line')
      .attr('id', id)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .attr("d", lineGen)

    let bisect = d3.bisector(function (d) {
      return d[xVal];
    }).left;


    var focus = lineChart
      .append('g')
      .append('rect')
      .attr("id", 'hover' + chartNo)
      .style("fill", "#16132E")
      .attr("stroke", "#16132E")
      .attr('height', height)
      .attr('width', 1)
      .style("opacity", 0)

    var focusText = lineChart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")

    svg
      .append('rect')
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('width', width - margin.right)
      .attr('height', height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .on('mouseover', mouseover)
      .on('mousemove', mousemove)
      .on('mouseout', mouseout);

    function mouseover() {
      focus.style("opacity", 0.5)
      focusText.style("opacity", 1)
    }

    function mousemove() {
      // recover coordinate we need
      var x0 = x.invert(d3.mouse(this)[0]);
      var i = bisect(chartData, x0 * 10000000, 1);
      //console.log(x0, i)
      selectedData = chartData[i]
      focus.attr("x", x(selectedData[xVal] / 10000000))
        .attr("y", 0)

      focusText
        .html(selectedData[yVal] + ": " + Math.round(x(selectedData[xVal] / 10000000)) + "s")
        .attr("x", x(selectedData[xVal] / 10000000) + 20)
        .attr("y", y(selectedData[yVal]) + 50)


      dispatch.call('unhover', this)
      dispatch.call('hover', this, selectedData[xVal] / 10000000, chartNo)

    }

    function mouseout() {
      focus.style("opacity", 0)
      dispatch.call('unhover', this)
    }

    let chartInfo = {
      id: id,
      line: lineGen,
      axis: x,
      spec: spec,
      what: what[0],
      chartNo: chartNo,
      color: color
    }

    dispatch.call('chartCreated', this, chartInfo)

    for (let i = 1; i < what.length; i++) {
      
      let newChartData = what[i].data;
      let newY = what[i].y;
      let newX = what[i].x;

      let newID = 'chart' + chartNo;

      let lineGen = d3.line()
        .x(function (d) {
          return x(d.x)
        })
        .y(function (d) {
          return y(d.y)
        }).curve(d3.curveMonotoneX);

      let xy = [];
      
      for (let i = 0; i < newChartData.length; i++) {
        xy.push({
          x: newChartData[i][newX] / 10000000,
          y: newChartData[i][newY]
        });
      }

      let simple = simplify(xy, 0.01, false);

      let x = d3.scaleLinear()
        .domain(d3.extent(simple, function (d) {
          return d.x;
        }))
        .range([0, width - margin.right]);

      let y = d3.scaleLinear()
        .domain(d3.extent(simple, function (d) {
          return d.y;
        }))
        .range([height - margin.top, 0]);
      
      
      lineChart.append("path")
      .datum(simple)
      .attr('class', 'line')
      .attr('id', newID)
      .attr("fill", "none")
      .attr("stroke", what[i].color)
      .attr("stroke-width", 2)
      .attr('opacity', 0.8)
      .attr("d", lineGen)

      
      let chartInfo = {
      id: newID,
      line: lineGen,
      axis: x,
      spec: spec,
      what: what[i],
      chartNo: chartNo,
      color: color
    }

    dispatch.call('chartCreated', this, chartInfo)

    }


    return chartInfo

  }

  dispatch.on('chartCreated.overview', function (chartInfo) {
    chartList.push(chartInfo);
  });

  dispatch.on('hover.overview', function (time, idNo) {

    for (let i = 0; i < chartList.length; i++) {
      let chart = chartList[i];
      if (chart.chartNo != idNo) {
        d3.select("#hover" + chart.chartNo).style('opacity', 0.5).style("fill", "black").attr("x", chart.axis(time)).attr("y", 0);
      }
    }

  })

  dispatch.on('unhover.overview', function () {
    for (let i = 0; i < chartList.length; i++) {
      let chart = chartList[i];
      d3.select("#hover" + chart.chartNo).style('opacity', 0);
    }
  });


});
