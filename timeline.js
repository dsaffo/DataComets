const Timeline = (function (dispatch, data) {

  let Xarray = [];

  dispatch.on('openBranch.timeline', function (recordXs) {
    Xarray = recordXs
    test();
  });

  let test = function () {
    console.log(Xarray.length)
  }

  let focusses = d3.selectAll(".focus");

  var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on("start brush end", brushed)

  var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [510, 210]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);


  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom

    // Updated the handle appropriately as we brush
    var s_handle = d3.event.selection;
    if (s_handle == null) {
      handle.attr("display", "none");
    } else {
      handle.attr("display", null).attr("transform", function (d, i) {
        return "translate(" + s_handle[i] + "," + height / 2 + ")";
      });
    }

    var s = d3.event.selection || x.range();

    for (var i = 0; i < line_charts_arr.length; i++) {
      line_charts_arr_x[i].domain(s.map(x.invert, x));
      focusses.select("#line" + i + " .line").attr("d", line_charts_arr[i]);
      focusses.select(".axis--x").call(line_chart_axes_arr[i]);
    }
    svg.selectAll(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));

    // Create an event that states the updated selected timeline range 
    var evt = new CustomEvent('timeline_update', {
      detail: [Math.floor(s.map(x.invert, x)[0]), Math.floor(s.map(x.invert, x)[1])]
    });
    window.dispatchEvent(evt);
  }

  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    // x.domain(t.rescaleX(x2).domain());
    for (var i = 0; i < line_charts_arr.length; i++) {
      line_charts_arr_x[i].domain(t.rescaleX(x).domain());
      focusses.select(".line").attr("d", line_charts_arr[i]);
      focusses.select(".axis--x").call(line_chart_axes_arr[i]);
      context.select(".brush").call(brush.move, line_charts_arr_x[i].range().map(t.invertX, t));
    }
    // context.select(".brush").call(brush.move, x.range().map(t.invertX, t));

    // Create an event that states the updated selected timeline range 
    var evt = new CustomEvent('timeline_update', {
      detail: [Math.floor(t.rescaleX(x).domain()[0]), Math.floor(t.rescaleX(x).domain()[1])]
    });
    window.dispatchEvent(evt);
  }



});
