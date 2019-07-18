  let el = document.querySelector('.tabs');
  var instance2 = M.Tabs.init(el, {});


  let dimensions = {
    map: {width: document.getElementById('map-canvas').offsetWidth, height: document.getElementById('map-canvas').offsetHeight},
    tree: {width: document.getElementById('tree-container').offsetWidth, height: document.getElementById('tree-container').offsetHeight},
    timeline: {width: document.getElementById('timeline-container').offsetWidth, height: document.getElementById('timeline-container').offsetHeight}
  }
  
  console.log(dimensions);



  d3.json('data/data.json').then(function (data) {



    console.log('loaded', data)


    const dispatch = d3.dispatch("timelineBrushed", "openBranch", "switchTab", "encodePath", "chartCreated",  "pinned", "unpinned");

    const map = Map(dispatch, data, dimensions);
    const timeline = Timeline(dispatch, data, dimensions);
    const tree = Tree(dispatch, data, dimensions);
   

    


  });
