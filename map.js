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

  let map = L.map("map-canvas", {
    center: [32.3874292, -117.0763872],
    zoom: 20,
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

  colorScale = selectColorScale(data['vehicle_gps_position'], 'alt', 'Reds');
  log = 'vehicle_gps_position'
  drawPath(data[log])

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

  function drawPath(pathData) {
    d3.selectAll('.pathSegments').remove()

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
          return colorScale(pathData[i]['alt'])
        })
        .attr('id', i)
        .attr('fill', 'none')
        .style('stroke-width', 5)
        .style('opacity', 1)
        .attr('d', lineGen)
        .attr("class", "pathSegments leaflet-interactive")
        .on('mouseover', function (d) {});
    }

  }

  function selectColorScale(data, value, cmap) {
    max = d3.max(data, function (d) {
      return parseFloat(d[value]);
    });
    min = d3.min(data, function (d) {
      return parseFloat(d[value]);
    });

    if (value === 'cpu_load' || value === 'ram_usage' || value === 'remaining') {
      max = 1;
      min = 0;
    }

    //console.log(min,max)
    var colorScale = d3.scaleSequential(d3["interpolate" + cmap])
      .domain([min, max]);

    return colorScale;
  }

  function update() {
    d3.selectAll(".pathSegments")
      .style('stroke-width', 5)
      .style('display', function () {
        let id = d3.select(this)['_groups'][0][0]['id']
        if (id < selections.window[0] || id > selections.window[1]) {
          return 'none'
        } else {
          return 'initial';
        }
      })
      .attr('d', lineGen)
  }






});
