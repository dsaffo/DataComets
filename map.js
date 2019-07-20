const Map = (function (dispatch, data, dimensions) {

  /*
    UI Initialization
  */

  //side nav
  let elem = document.querySelector('.sidenav');
  let instance = new M.Sidenav(elem);

  /*
    Map Initialization 
  */

  let refLon = data['vehicle_local_position'][0]['ref_lon'];
  let refLat = data['vehicle_local_position'][0]['ref_lat'];

  let map = L.map("map-canvas", {
    center: [refLat, refLon],
    zoom: 18,
    maxZoom: 25,
    minZoom: 1,
    zoomControl: true
  });

  map.zoomControl.setPosition('bottomleft');

  let Esri_WorldTopoMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    maxNativeZoom: 18
  });

  Esri_WorldTopoMap.addTo(map);
  L.svg().addTo(map);

  /*
    Code Initialization
  */

  let selections = {
    window: []
  }

  let lineGen = d3.line()
    .x(function (d) {
      var lat = d.lat / 10000000;
      var lon = d.lon / 10000000;
      return map.latLngToLayerPoint([lat, lon]).x
    })
    .y(function (d) {
      var lat = d.lat / 10000000;
      var lon = d.lon / 10000000;
      //console.log('global' , map.latLngToLayerPoint([lat, lon]).y)
      return map.latLngToLayerPoint([lat, lon]).y
    }).curve(d3.curveMonotoneX)


  log = 'vehicle_gps_position'


  /*
    Dispatch and Listener Functions
    
    moveend: 
    listens for map moves/zooms and calls update
    
    timelineBrushed.map: 
    calculates the index range of the data from the brushed window and calls update
  */

  map.on("moveend", update);

  dispatch.on('timelineBrushed.map', function (window) {
    let start = 'x';
    let end = 'x';
    for (let i = 0; i < data[log].length; i++) {
      if (start == 'x') {
        //console.log(Math.floor(data[log][i]['timestamp'] / 10000000))
        if (data[log][i]['timestamp'] / 10000000 > window[0]) {
          start = i - 1
        }
      } else if (end == 'x') {
        if (data[log][i]['timestamp'] / 10000000 > window[1]) {
          end = i - 1
        }
      }
    }

    if (start == 'x') {
      start = 0
    }
    if (end == 'x') {
      end = data[log].length - 1
    }
    selections.window = [start, end]
    update()
  });

  let chartDeets = {};
  dispatch.on("mapped", function (chartInfo) {
    chartDeets = chartInfo.what;
    attrData = align(chartInfo.what);
    colorScale = selectColorScale(attrData, 'Purples');
    drawPath(data[log], attrData, colorScale);

  });

  function align(what) {
    let pathTimes = [];
    let attrTimes = [];
    let attrData = [];
    let alignedData = [];

    for (let i = 0; i < data[log].length; i++) {
      pathTimes.push(data[log][i]['timestamp'])
    }

    for (let i = 0; i < data[what.data].length; i++) {
      attrTimes.push(data[what.data][i]['timestamp'])
      attrData.push(data[what.data][i][what.y])
    }

    if (pathTimes.length === attrTimes.length) {
      return attrData;
    } else if (pathTimes.length > attrTimes.length) {
      dataIndex = 0;
      for (let i = 0; i < pathTimes.length; i++) {
        if (pathTimes[i] <= attrTimes[dataIndex]) {
          alignedData.push(attrData[dataIndex])
        } else if (attrData[dataIndex] != undefined) {
          dataIndex += 1;
          alignedData.push(attrData[dataIndex]);
        }
      }
      return alignedData;
    } else if (pathTimes.length < attrTimes.length) {
      dataIndex = 0;
      passed = 0;
      for (let i = 0; i < pathTimes.length; i++) {
        //console.log(pathTimes[i], attrTimes[dataIndex])
        while (pathTimes[i] > attrTimes[dataIndex]) {
          dataIndex += 1;
        }
        alignedData.push(attrData[dataIndex])
      }
    }
    //console.log(pathTimes.length, alignedData.length)
    return alignedData;
  }



  /*
    Worker Functions
    
    drawPath(pathData): 
    draws drone path using a new path for each data point drawn to the next 2 data points takes log data as parameter (data['log_name'])  
    data needs lat/lon records
    
    selectColorScale(data, value, cmap):
    returns color scale for the given log (data), value (record), and color map (cmap) for example (data['gps'],'alt','Reds')
    
    update(): 
    updates the path when the map moves, zooms, or the brush window is changed
  */

  function drawPath(pathData, attrData, colorScale) {
    d3.selectAll('.pathSegments').remove()

    var div = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    start = 0;
    for (i = 0; i < pathData.length; i++) {
      line = pathData.slice(start, start + 3);
      if (start != 0 && start <= data.length) {
        line.unshift(pathData[start - 1])
      }
      start = start + 1
      //console.log(line)
      d3.select("#map-canvas")
        .select("svg")
        .selectAll("thing")
        .data([line])
        .enter()
        .append('path')
        .attr('stroke', function (d) {
          return colorScale(attrData[i])
        })
        .attr('id', "seg" + i)
        .attr('fill', 'none')
        .style('stroke-width', 5)
        .style('opacity', 1)
        .attr('d', lineGen)
        .attr("class", "pathSegments leaflet-interactive")
        .on('mouseover', function (d) {
          div.transition()
            .duration(200)
            .style("opacity", .9);
          div.html(attrData[pathData.indexOf(d[0])] + " " + Math.round(d[0]['timestamp'] / 10000000) + "s")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .style("color", 'white')
            .style("background", colorScale(attrData[pathData.indexOf(d[0])]));
          dispatch.call('hover', this, d[0]['timestamp'] / 10000000)
        })
        .on('mouseout', function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
          dispatch.call('unhover', this)
        });
    }

  }

  function selectColorScale(data, cmap) {
    //max = d3.max(data, function (d) {
    //  return parseFloat(d[value]);
    //});
    ///min = d3.min(data, function (d) {
    //  return parseFloat(d[value]);
    //});

    max = Math.max(...data)
    min = Math.min(...data)

    const d = (max - min) / 30;

    var colorScale = d3.scaleSequential(d3["interpolate" + cmap])
      .domain([min, max]);

    var colorScale = d3.scaleThreshold()
      .range(['#16132e', '#22142f', '#2c152f', '#361630', '#401631', '#491632', '#521633', '#5c1534', '#651435', '#6f1237', '#780f39', '#820b3a', '#8c043d', '#95003e', '#9d013d', '#a5043d', '#ad073c', '#b50c3c', '#bc123c', '#c3173c', '#ca1d3b', '#d1233b', '#d82a3b', '#de303b', '#e4373b', '#e93e3c', '#ee463c', '#f24d3d', '#f6563e', '#f95e3f'])
      .domain([min + d * 1, min + d * 2, min + d * 3, min + d * 4, min + d * 5, min + d * 6, min + d * 7, min + d * 8, min + d * 9, min + d * 10, min + d * 11, min + d * 12, min + d * 13, min + d * 14, min + d * 15, min + d * 16, min + d * 17, min + d * 18, min + d * 19, min + d * 20, min + d * 21, min + d * 22, min + d * 23, min + d * 24, min + d * 25, min + d * 26, min + d * 27, min + d * 28, min + d * 29]);

    return colorScale;
  }

  function update() {
    d3.selectAll(".pathSegments")
      .style('stroke-width', 5)
      .style('display', function () {
        let id = d3.select(this)['_groups'][0][0]['id'].substring(3)
        if (id < selections.window[0] || id > selections.window[1]) {
          return 'none'
        } else {
          return 'initial';
        }
      })
      .attr('d', lineGen)
  }

  dispatch.on('hover.map', function (time, idNo) {

    if (idNo == undefined) {
      d3.select(this).style('stroke-width', 20);
    } else {
      let index = 0;
      for (let i = 0; i < data[log].length; i++) {
        if (data[log][i]['timestamp'] / 10000000 >= time) {
          index = i;
          break;
        }
      }
      d3.select('#seg' + index).style('stroke-width', 20);
    }



  })

  dispatch.on('unhover.map', function () {
    d3.selectAll('.pathSegments').style('stroke-width', 5)
  })








});
