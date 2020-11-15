const Overview = (function (dispatch, data, dimensions) {

  let chartList = [];



  color1 = "#691433"

  color2 = "#91003E"


  color3 = "#E80936"


  color4 = "#F95E3F"

  color5 = '#F7AC40'

/*
  const multicharts = [
    [{

        data: data['vehicle_gps_position_0'],
        log: 'vehicle_gps_position_0',
        x: 'timestamp',
        y: 'alt',
        title: 'Altitude Recorded (Meters)',
        unit: 'millimeters',
        color: color1
  },
      {
        data: data['vehicle_global_position_0'],
        log: 'vehicle_global_position_0',
        x: 'timestamp',
        y: 'alt',
        title: 'Altitude Estimated (Meters)',
        color: color5
    }],
                       [{
      data: data['position_setpoint_triplet_0'],
      log: 'position_setpoint_triplet_0',
      x: 'timestamp',
      y: 'current.alt',
      title: 'Altitude Set Points (Meters)',
      color: color2
    }],
    [{
      data: data['vehicle_air_data_0'],
      log: 'vehicle_air_data_0',
      x: 'timestamp',
      y: 'baro_alt_meter',
      title: 'Barometer Altitude (Meters)',
      color: color3
    }],
                       [{
        data: data['vehicle_attitude_0'],
        log: 'vehicle_attitude_0',
        x: 'timestamp',
        y: 'q[0]',
        title: 'Roll Angle Estimated (Degs)',
        color: color1,
        unit: 'quantrinoin'
    },
      {
        data: data['vehicle_attitude_setpoint_0'],
        log: 'vehicle_attitude_setpoint_0',
        x: 'timestamp',
        y: 'q_d[0]',
        title: 'Roll Angle Setpoint (Degs)',
        color: color5,
        unit: 'quantrinoin'
    }],
                       [{
        data: data['vehicle_attitude_0'],
        log: 'vehicle_attitude_0',
        x: 'timestamp',
        y: 'q[1]',
        title: 'Pitch Angle Estimated (Degs)',
        color: color1,
        unit: 'quantrinoin'
    },
      {
        data: data['vehicle_attitude_setpoint_0'],
        log: 'vehicle_attitude_setpoint_0',
        x: 'timestamp',
        y: 'q_d[1]',
        title: 'Pitch Angle Setpoint (Degs)',
        color: color5,
        unit: 'quantrinoin'
    }],
                       [{
        data: data['vehicle_attitude_0'],
        log: 'vehicle_attitude_0',
        x: 'timestamp',
        y: 'q[2]',
        title: 'Yaw Angle Estimated (Degs)',
        color: color1,
        unit: 'quantrinoin'
    },
      {
        data: data['vehicle_attitude_setpoint_0'],
        log: 'vehicle_attitude_setpoint_0',
        x: 'timestamp',
        y: 'q_d[2]',
        title: 'Yaw Angle Setpoint (Degs)',
        color: color5,
        unit: 'quantrinoin'
    }],
                       [{
        data: data['vehicle_attitude_0'],
        log: 'vehicle_attitude_0',
        x: 'timestamp',
        y: 'rollspeed',
        title: 'Roll Anguler Rate Estimated (Degs/s)',
        color: color1,
        unit: 'quantrinoin'
    },
      {
        data: data['vehicle_rates_setpoint_0'],
        log: 'vehicle_rates_setpoint_0',
        x: 'timestamp',
        y: 'roll',
        title: 'Roll Angular Rate Setpoint (Degs/s)',
        color: color5,
        unit: 'quantrinoin'
    }],
                       [{
        data: data['vehicle_attitude_0'],
        log: 'vehicle_attitude_0',
        x: 'timestamp',
        y: 'pitchspeed',
        title: 'Pitch Angular Rate Estimated (Degs/s)',
        color: color1,
        unit: 'quantrinoin'
    },
      {
        data: data['vehicle_rates_setpoint_0'],
        log: 'vehicle_rates_setpoint_0',
        x: 'timestamp',
        y: 'pitch',
        title: 'Pitch Angular Rate Setpoint (Degs/s)',
        color: color5,
        unit: 'quantrinoin'
    }],
                       [{
      data: data['vehicle_attitude_0'],
      log: 'vehicle_attitude_0',
      x: 'timestamp',
      y: 'yawspeed',
      title: 'Yaw Angular Rate Estimated (Degs/s)',
      color: color1,
      unit: 'quantrinoin'
    }, {
      data: data['vehicle_rates_setpoint_0'],
      log: 'vehicle_rates_setpoint_0',
      x: 'timestamp',
      y: 'yaw',
      title: 'Yaw Angular Rate Setpoint (Degs/s)',
      color: color5,
      unit: 'quantrinoin'
    }], [{
      data: data['actuator_controls_0_0'],
      log: 'actuator_controls_0_0',
      x: 'timestamp',
      y: 'control[3]',
      title: 'Thrust Control (0=no thrust - 1=max thrust)',
      color: color2
    }],
    [{
      data: data['actuator_controls_0_0'],
      log: 'actuator_controls_0_0',
      x: 'timestamp',
      y: 'control[0]',
      title: 'Roll Control (-1 - 1)',
      color: color3
    }],
    [{
      data: data['actuator_controls_0_0'],
      log: 'actuator_controls_0_0',
      x: 'timestamp',
      y: 'control[1]',
      title: 'Pitch Control (-1 - 1)',
      color: color4
    }],
    [{
      data: data['actuator_controls_0_0'],
      log: 'actuator_controls_0_0',
      x: 'timestamp',
      y: 'control[2]',
      title: 'Yaw Control (-1 - 1)',
      color: color5
    }],
    [{
      data: data['vehicle_gps_position_0'],
      log: 'vehicle_gps_position_0',
      x: 'timestamp',
      y: 'vel_m_s',
      title: 'Velocity (Meters/second)',
      color: color1
    }],
    [{
      data: data['battery_status_0'],
      log: 'battery_status_0',
      x: 'timestamp',
      y: 'remaining',
      title: 'Battery Remaining (0=Empty - 1=Full)',
      color: color2
    }],
    [{
      data: data['battery_status_0'],
      log: 'battery_status_0',
      x: 'timestamp',
      y: 'current_filtered_a',
      title: 'Battery Current (Amps)',
      color: color3
    }],
    [{
      data: data['battery_status_0'],
      log: 'battery_status_0',
      x: 'timestamp',
      y: 'discharged_mah',
      title: 'Battery Discharged (Milliamp Hours)',
      color: color4
    }],
    [{
      data: data['vehicle_gps_position_0'],
      log: 'vehicle_gps_position_0',
      x: 'timestamp',
      y: 'noise_per_ms',
      title: 'Noise (Per Meters/second)',
      color: color5
    }],
    [{
      data: data['vehicle_gps_position_0'],
      log: 'vehicle_gps_position_0',
      x: 'timestamp',
      y: 'jamming_indicator',
      title: 'Jamming Indicator',
      color: color1
    }],
    [{
      data: data['cpuload_0'],
      log: 'cpuload_0',
      x: 'timestamp',
      y: 'load',
      title: 'CPU Load (0 - 1)',
      color: color2
    }]]
    */
		
		
	
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
    
  const multicharts = [
      [{
      data: data['cpuload_0'],
      log: 'cpuload_0',
      x: 'timestamp',
      y: 'load',
      title: 'CPU Load (0 - 1)',
      color: color2
    }]
  ]


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

	

  for (let i = 0; i < multicharts.length; i++) {
    try {
     overviewChartGen('overview', multicharts[i], defaultPinnedLineChartSpec);
      
    } catch {
      console.log('something went wrong with these charts', multicharts[i]);
    }
  }
    
  console.log(chartList)
  dispatch.call('mapped', this, chartList[0]);
    

  function overviewChartGen(where, what, spec) {

    let chartLedger = [];

    color = what[0].color || "#16132E"

    let chartData = what[0].data || what.data
    let yVal = what[0].y || what.y
    let xVal = what[0].x || what.x

    if(chartData == undefined){
      return ""
    }
    //console.log(chartData)
    
    if (what[0].unit == 'millimeters') {
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





    for (let i = 0; i < what.length; i++) {

      let id = 'chart' + (chartNo + i);

      var title = div.append("span")
        .attr("x", margin.right + margin.left + 10)
        .attr("y", margin.top - 5)
        .attr("text-anchor", "left")
        .style('margin-bottom', 100)
        .text(function () {
          if (what[i].title != undefined) {
            return what[i].title
          } else {
            return what[i].y
          }

        }).append("span").attr("id", "focusval" + (chartNo + i));

      div.append('svg').style('margin-left', 5).attr('width', 10).attr('height', 10).append('rect').attr('width', 10).attr('height', 10).attr('fill', what[i].color)

      div.append('a')
        .attr('id', 'mapSel' + (chartNo + i))
        .style('float', 'right')
        .style('color', 'lightgrey')
        .style("font-size", "14px")
        .append('i')
        .attr('class', 'mdi mdi-map')

        .on('click', function () {
          //console.log(chartLedger)
          dispatch.call('mapped', this, chartLedger[i])
        });

      div.append('a')
        .attr('id', 'pin' + id)
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
            dispatch.call('pinned', this, spec, what[i], id)
          } else if (d3.select(this)["_groups"][0][0]['classList'][0] === "on") {
            dispatch.call('unpinned', this, spec, id)
          }
        })
        .style("font-size", "14px")
        .append('i')
        .attr('class', "mdi mdi-pin")


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



    let xy = [];
    let yvals = [];


    for (let i = 0; i < chartData.length; i++) {
      yvals.push(chartData[i][yVal]);
      xy.push({
        x: chartData[i][xVal] / 10000000,
        y: chartData[i][yVal]
      });
    }



    simple = simplify(xy, 0.05, false);



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
        .html(Math.round(selectedData[yVal] * 100) / 100 + ": " + Math.round(selectedData[xVal] / 10000000) + "s")
        .attr("x", function () {
          if (width + x(selectedData[xVal] / 10000000) - width < width - 150) {
            return width + x(selectedData[xVal] / 10000000) - width + 20
          } else {
            return width + x(selectedData[xVal] / 10000000) - width - 120
          }
        })
        .attr("y", height - y(selectedData[yVal]))



      dispatch.call('unhover', this)
      dispatch.call('hover', this, selectedData[xVal] / 10000000, chartNo)

    }

    function mouseout() {
      focus.style("opacity", 0)
      focusText.style("opacity", 0)
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
    chartLedger.push(chartInfo);
    dispatch.call('chartCreated', this, chartInfo);

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

      let simple = simplify(xy, 0.05, false);

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
      chartLedger.push(chartInfo);
      dispatch.call('chartCreated', this, chartInfo);

    }

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



    return chartInfo

  }





});
