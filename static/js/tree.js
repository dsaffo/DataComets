const Tree = (function (dispatch, data, dimensions) {

  let colorCycle = 0;


  let pinnedList = {};

  let chartList = [];

  let mapSelection = {
    id: null
  };

  let treeLineChartSpec = {
    margin: {
      top: 5,
      right: 40,
      bottom: 25,
      left: 35
    },
    width: dimensions.tree.width * 0.9,
    height: 150,
    pinned: false,
    default: false
  }

  let pinnedLineChartSpec = {
    margin: {
      top: 5,
      right: 50,
      bottom: 25,
      left: 40
    },
    width: dimensions.tree.width,
    height: 200,
    pinned: true,
    default: false

  }

  let defaultPinnedLineChartSpec = {
    margin: {
      top: 5,
      right: 50,
      bottom: 25,
      left: 40
    },
    width: dimensions.tree.width,
    height: 200,
    pinned: false,
    default: true
  }

  //console.log('tree')

  let activeBranches = [];

  let elem = document.querySelector('.collapsible.expandable');
  let instance = M.Collapsible.init(elem, {
    accordion: false,
    //onOpenEnd: function(){ var activeBodies = this.$el.children('li.active').children('.collapsible-body');  console.log(activeBodies)},
    //onCloseEnd: function(){ removeCharts() }
  });

  instance.onclick = function () {
    //console.log(instance.id)
  }
  
 

  const allEqual = arr => arr.every(v => v === arr[0])


  dispatch.on('pinned.tree', function (spec, what,id) {
    d3.select(this).style('color', '#16132E')
      .attr('class', 'on');

    let newWhat = {
      data: what.data,
      log: what.log,
      x: what.x,
      y: what.y,
      title: what.log + ": " + what.y
    }
     pinnedList = Object.assign({
        [id.substr(5)]: chartNo 
    }, {[chartNo]:id.substr(5)})
    lineChartGen2('pinned', newWhat, pinnedLineChartSpec);
   
    //console.log(pinnedList)
  });

  dispatch.on('unpinned.tree', function (spec, id) {
    if (spec.pinned === true) {
      d3.select(this).style('color', 'lightgrey')
        .attr('class', 'off');
      sel = pinnedList['299'];
      d3.select('#pinchart' + sel).style('color', 'lightgrey')
        .attr('class', 'off');
      d3.select('#card' + id).remove();
    } else {
      //console.log(id)
      sel = pinnedList[id.substr(5)]
      d3.select(this).style('color', 'lightgrey')
        .attr('class', 'off');
      //console.log('#cardchart' + sel)
      d3.select('#cardchart' + sel).remove();
    }
    chartList.splice(id, id);
  });

  dispatch.on('chartCreated.tree', function (chartInfo) {
    chartList.push(chartInfo);
  });

  dispatch.on('mapped.tree', function (chartInfo) {

    if (mapSelection.id != "#mapSe" + chartInfo.chartNo) {
      d3.select(mapSelection.id).style('color', 'lightgrey')
      mapSelection.id = "#mapSel" + chartInfo.chartNo;
      d3.select(mapSelection.id).style('color', '#16132E')

    }


  });




  var ul = d3.select('#tree');

  let logs = Object.keys(data) //.slice(8, 9);

  blacklist = logs.indexOf('ekf2_timestamps')

  logs.splice(blacklist, 1)

  let recordXs = [];

  //logs.unshift("Overview");


  ul.selectAll('li')
    .data(logs)
    .enter()
    .append('li')
    .attr('id', function (d) {
      return d
    })
    .append('div')
    .attr('class', "collapsible-header")
    .html(String);



  for (let i = 0; i < logs.length; i++) {
    let log = logs[i];
    let singles = [];

    ul.select("#" + log)
      .append('div')
      .attr("class", "collapsible-body")
      .attr("id", log + '-body');

    if (log != '') {
      var log_data = data[log];
      let records = Object.keys(log_data[0]);

      let xyz = [];

      for (let i = 0; i < records.length; i++) {
        let title = undefined;
        let record = records[i];
        let vals = [];
        
        if (record == 'q[3]' || record == 'q_d[3]') {
          continue
        }

        if (record == 'q[0]') {
            xyz = convertQuant(log_data, 'q')
        }
        
         if (record == 'q_d[0]') {
            xyz = convertQuant(log_data, 'q_d')
        }

        if (record == 'q[0]' || record == 'q_d[0]') {
          for (let i = 0; i < xyz.length; i++) {
            log_data[i][record] = xyz[i][0]
            title = 'roll'
          }
        } else if (record == 'q[1]' || record == 'q_d[1]') {
          for (let i = 0; i < xyz.length; i++) {
            log_data[i][record] = xyz[i][1]
            title = 'pitch'


          }
        } else if (record == 'q[2]' || record == 'q_d[2]') {
          for (let i = 0; i < xyz.length; i++) {
            log_data[i][record] = xyz[i][2]
            title = 'yaw'
          }
        }
        
        
        rads = ['rollspeed','pitchspeed','yawspeed','roll_body','pitch_body','yaw_body','roll','pitch','yaw']
        
        if (rads.indexOf(record) >= 0){
          log_data = convertRad(log_data, record);
        }

        for (let i = 0; i < log_data.length; i++) {
          vals.push(log_data[i][record])
        }

        if (record != "timestamp" && !allEqual(vals)) {
          lineChartGen2(log + "-body", {
            data: log_data,
            log: log,
            x: "timestamp",
            y: record,
            title: title
          }, treeLineChartSpec);

        } else if (record != "timestamp") {
          singles.push(record)
        }
      }
      for (let i = 0; i < singles.length; i++) {

        let single = singles[i];

        var margin = {
            top: 20,
            right: 20,
            bottom: 10,
            left: 20
          },
          width = 150 // Use the window's width 
          ,
          height = 12 // Use the window's height

        var svg = d3.select('#' + log + '-body')
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

        svg.append("text").text(single + ': ' + data[log][0][single])
      }
    }
  }




  function lineChartGen2(where, what, spec) {


    color = "#16132E"

    if (colorCycle == 0) {
      color = "#691433"
      colorCycle += 1;
    } else if (colorCycle == 1) {
      color = "#91003E"
      colorCycle += 1;
    } else if (colorCycle == 2) {
      color = "#E80936"
      colorCycle += 1;
    } else if (colorCycle == 3) {
      color = "#F95E3F"
      colorCycle = 0;
    }

    let chartData = what.data
    let yVal = what.y;
    let xVal = what.x;


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

    var title = div.append("span")
      .attr("x", margin.right + margin.left + 10)
      .attr("y", margin.top - 5)
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .text(function () {
        if (what.title != undefined) {
          return what.title
        } else {
          return yVal
        }
      });

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
          dispatch.call('pinned', this, spec, what, id)
        } else if (d3.select(this)["_groups"][0][0]['classList'][0] === "on") {
          //console.log('onclick')
          dispatch.call('unpinned', this, spec, id)
        }
      })
      .append('i')
      .attr('class', "mdi mdi-pin small")




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
 
    //console.log(chartData[0][yVal], chartData[index][yVal], chartData[0][yVal] - chartData[index][yVal])
    
    tol = standardDeviation(yvals);
    
    if (tol >= 1){
      tol = 0.05;
    } 
    
    //console.log(yVal, tol);
    
    simple = simplify(xy, tol, false);

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
      .attr("d", lineGen)

    let bisect = d3.bisector(function (d) {
      return d[xVal];
    }).left;
    
      var focusText = lineChart
      .append('g')
      .append('text')
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle")
      .style("z-index", 3)


    var focus = lineChart
      .append('g')
      .append('rect')
      .attr("id", 'hover' + chartNo)
      .style("fill", "#16132E")
      .attr("stroke", "#16132E")
      .attr('height', height)
      .attr('width', 1)
      .style("opacity", 0)

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

      dispatch.call('unhover', this)
      dispatch.call('hover', this, selectedData[xVal] / 10000000, chartNo)
      
       focusText
        .html(Math.round(selectedData[yVal] * 100) / 100 + ": " + Math.round(selectedData[xVal] / 10000000) + "s")
        .attr("x", function () {
          if( width + x(selectedData[xVal] / 10000000) - width < width - 150){
            return width + x(selectedData[xVal] / 10000000) - width + 20
          } else {
            return width + x(selectedData[xVal] / 10000000) - width - 120
          }
        })
        .attr("y", height - y(selectedData[yVal]))


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
      what: what,
      chartNo: chartNo,
      color: color
    }

    dispatch.call('chartCreated', this, chartInfo)
    

    return chartInfo

  }

  

  dispatch.on('hover.tree', function (time, idNo) {

    for (let i = 0; i < chartList.length; i++) {
      let chart = chartList[i];

      if (chart.chartNo != idNo) {
        d3.select("#hover" + chart.chartNo).style('opacity', 0.5).style("fill", "black").attr("x", chart.axis(time)).attr("y", 0);
      }
    }

  })

  dispatch.on('unhover.tree', function () {

    for (let i = 0; i < chartList.length; i++) {
      let chart = chartList[i];
      d3.select("#hover" + chart.chartNo).style('opacity', 0);
    }
  });




});
