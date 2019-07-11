const Tree = (function (dispatch, data, dimensions) {

  let treeLineChartSpec = {
    margin: {
      top: 20,
      right: 10,
      bottom: 30,
      left: 30
    },
    width: 350,
    height: 100
  }

  let pinnedLineChartSpec = {
    margin: {
      top: 50,
      right: 20,
      bottom: 30,
      left: 80
    },
    width: 350,
    height: 100
  }

  console.log('tree')

  let activeBranches = [];

  let elem = document.querySelector('.collapsible.expandable');
  let instance = M.Collapsible.init(elem, {
    accordion: false,
    //onOpenEnd: function(){ var activeBodies = this.$el.children('li.active').children('.collapsible-body');  console.log(activeBodies)},
    //onCloseEnd: function(){ removeCharts() }
  });

  instance.onclick = function () {
    console.log(instance.id)
  }

  const allEqual = arr => arr.every(v => v === arr[0])

  //when branch is opened save x-axis to dictionary 
  dispatch.on('openBranch.tree', function (recordXs) {
    console.log(recordXs.length)

  });

  //when branch is closed mark x-axis for removal 
  dispatch.on('closeBranch.tree', function (recordXs) {

  });

  //when record is selected to be encoded on drone path
  dispatch.on('encodePath.tree', function (record) {

  });


  var ul = d3.select('#tree');

  let logs = Object.keys(data) //.splice(0, 3);

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


    if (log != 'Overview') {
      let log_data = data[log];
      let records = Object.keys(log_data[0]);

      for (let i = 0; i < records.length; i++) {

        let record = records[i];
        let vals = [];
        for (let i = 0; i < log_data.length; i++) {
          vals.push(log_data[i][record])
        }

        if (record != "timestamp" && !allEqual(vals)) {
          let x = lineChartGen(log + "-body", {
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
  

  lineChartGen('pinned', {
    data: 'vehicle_gps_position',
    x: 'timestamp',
    y: 'alt'
  }, pinnedLineChartSpec);
  
  lineChartGen('pinned', {
    data: 'vehicle_global_position',
    x: 'timestamp',
    y: 'alt'
  }, pinnedLineChartSpec);
  
  lineChartGen('pinned', {
    data: 'vehicle_air_data',
    x: 'timestamp',
    y: 'baro_alt_meter'
  }, pinnedLineChartSpec);
  
   lineChartGen('pinned', {
    data: 'actuator_controls_0',
    x: 'timestamp',
    y: 'control[3]'
  }, pinnedLineChartSpec);



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



  dispatch.call('openBranch', this, recordXs);

});
