const Tree = (function (dispatch, data, dimensions) {

  let chartNo = 0;

  let pinnedList = {};
  
  let mapSelection = {selection:null};

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
    pinned: true,
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


  dispatch.on('pinned.tree', function (spec, what, chartNo) {
    if (spec.default != true) {
      d3.select(this).style('color', '#612658')
        .attr('class', 'on');
      id = lineChartGen2('pinned', what, pinnedLineChartSpec);
      pinnedList = Object.assign({
        [chartNo]: id
      });
      console.log(chartNo, id);
    }
  });

  dispatch.on('unpinned.tree', function (spec, id) {
    if (spec.pinned === true) {
      d3.select(this).style('color', 'lightgrey')
        .attr('class', 'off');
      d3.select('#card' + id).remove();
    } else {
      sel = pinnedList[id]
      d3.select(this).style('color', 'lightgrey')
        .attr('class', 'off');
      console.log('#cardchart' + sel)
      d3.select('#cardchart' + sel).remove();
    }
  });



  //when record is selected to be encoded on drone path
  dispatch.on('encodePath.tree', function (record) {

  });


  var ul = d3.select('#tree');

  let logs = Object.keys(data) //.slice(8, 9);

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


    if (log != 'ekf2_timestamps') {
      let log_data = data[log];
      let records = Object.keys(log_data[0]);

      for (let i = 0; i < records.length; i++) {

        let record = records[i];
        let vals = [];
        for (let i = 0; i < log_data.length; i++) {
          vals.push(log_data[i][record])
        }

        if (record != "timestamp" && !allEqual(vals)) {
          let x = lineChartGen2(log + "-body", {
            data: log,
            x: "timestamp",
            y: record
          }, treeLineChartSpec);
          recordXs.push(x);
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

        svg.append("text").text(single + ': ' + log_data[0][single])
      }
    }
  }


  let x1 = lineChartGen2('pinned', {
    data: 'vehicle_gps_position',
    x: 'timestamp',
    y: 'alt'
  }, defaultPinnedLineChartSpec);

  lineChartGen2('pinned', {
    data: 'vehicle_global_position',
    x: 'timestamp',
    y: 'alt'
  }, defaultPinnedLineChartSpec);

  lineChartGen2('pinned', {
    data: 'vehicle_air_data',
    x: 'timestamp',
    y: 'baro_alt_meter'
  }, defaultPinnedLineChartSpec);

  lineChartGen2('pinned', {
    data: 'actuator_controls_0',
    x: 'timestamp',
    y: 'control[3]'
  }, defaultPinnedLineChartSpec);


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
      width = options.width // Use the window's width 
      ,
      height = options.height // Use the window's height

    var svg = d3.select('#' + where)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    var title = svg.append("text")
      .attr("x", 0 + margin.left / 2)
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "left")
      .style("font-size", "14px")
      .text(yVal);

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
    svg.append("g")
      .call(d3.axisLeft(y));

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


  function lineChartGen2(where, what, spec) {

    let chartData = data[what.data]
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
      .text(yVal);

    div.append('a')
      .style('float', 'right')
      .style('color', 'lightgrey')
      .append('i')
      .attr('class', 'mdi mdi-map small');

    div.append('a')
      .style('float', 'right')
      .style('color', function () {
        if (spec.pinned === true) {
          return "#612658"
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
      .attr('class', function () {
        if (spec.default === true) {
          return "mdi mdi-pin-off small"
        } else {
          return "mdi mdi-pin small"
        }
      })




    let svg = div.append("svg")
      .attr("width", width)
      .attr("height", height + margin.bottom);

    let clip = svg.append("defs").append("clipPath")
      .attr("id", "clip" + chartNo)
      .append("rect")
      .attr("width", width)
      .attr("height", height)
    //.attr("x", 0)
    //.attr("y", 0); 



    let lineChart = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .attr("clip-path", "url(#clip" + chartNo + ")");

    var axes = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let lineGen = d3.line()
      .x(function (d) {
        return x(d[xVal] / 10000000)
      })
      .y(function (d) {
        return y(d[yVal])
      });


    let x = d3.scaleLinear()
      .domain(d3.extent(chartData, function (d) {
        return d[xVal] / 10000000;
      }))
      .range([0, width]);

    let y = d3.scaleLinear()
      .domain(d3.extent(chartData, function (d) {
        return d[yVal];
      }))
      .range([height, 0]);

    axes.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr('id', 'xAxis' + id)
      .call(d3.axisBottom(x));

    axes.append("g")
      .call(d3.axisLeft(y));


    lineChart.append("path")
      .datum(chartData)
      .attr('class', 'line')
      .attr('id', id)
      .attr("fill", "none")
      .attr("stroke", "#7C3F73")
      .attr("stroke-width", 1.5)
      .attr("d", lineGen)

    let pinBottom = 60 + "px"
    let mapBottom = 30 + "px"

    let pinLeft = 10 + "px"
    let mapRight = 20 + "px"

    /*
      div.append('a')
      .style('position', 'relative')
      .style('bottom', pinBottom)
      .style('left', pinLeft)
      .style('color', 'lightgrey')
      .on('click', function(){ console.log('hi'); d3.select(this).style('color', '#612658')})
      .append('i')
      .attr('class', 'mdi mdi-pin small')
      div.append('a')
      //.style('position', 'relative')
      //.style('bottom', mapBottom)
      //.style('right', mapRight)
      .style('color', 'lightgrey')
      .append('i')
      .attr('class', 'mdi mdi-map small');
      */

    dispatch.call('chartCreated', this, {
      id: id,
      line: lineGen,
      axis: x
    })

    chartNo += 1;
    return chartNo - 1;

  }



});
