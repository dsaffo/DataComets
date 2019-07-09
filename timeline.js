const Timeline = (function (dispatch, data) {

  let Xarray = [];

  dispatch.on('openBranch.timeline', function (recordXs) {
    Xarray = recordXs
    test();
  });

  let test = function () {
    console.log(Xarray.length)
  }

  


});
