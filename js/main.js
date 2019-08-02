//new SSVG();


let el = document.querySelector('.tabs');
var instance2 = M.Tabs.init(el, {});


let dimensions = {
  map: {
    width: document.getElementById('map-canvas').offsetWidth,
    height: document.getElementById('map-canvas').offsetHeight
  },
  tree: {
    width: document.getElementById('tree-container').offsetWidth,
    height: document.getElementById('tree-container').offsetHeight
  },
  timeline: {
    width: document.getElementById('timeline-container').offsetWidth,
    height: document.getElementById('timeline-container').offsetHeight
  }
}

console.log(dimensions);

document.addEventListener('DOMContentLoaded', function () {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems, {});
});

let topButton = document.getElementById('top');

topButton.addEventListener('click', function(){
    //console.log('hello');
    //document.getElementById('tree-container').scrollTop = 0; // For Safari
    document.getElementById('tree-container').scrollTop = 0; // For Chrome, Firefox, IE and Opera
});


let chartNo = 0

d3.json('data/dataLong.json').then(function (data) {


     function reduceData(value) {
      if (log_data.indexOf(value) % Math.ceil(log_data.length / 10000) == 0) {
        return value;
      } 
    }

  console.log('loaded', data)
  
  
  let logs = Object.keys(data)
  
 /* for (let i = 0; i < logs[i].length; i++){
    log_data = data[logs[i]]
    if (log_data.length >= 10000){
        console.log('reducing')
        log_data = log_data.filter(d=> reduceData(d));
      }
        console.log(log_data.length);
        data[logs[i]] = log_data;
    }
*/

  

  const dispatch = d3.dispatch("timelineBrushed", "openBranch", "switchTab", "mapped", "unmapped", "chartCreated", "pinned", "unpinned", "hover", "unhover");

  
  
  
  dispatch.on('chartCreated.main', function(){
    chartNo += 1;
  });

  const map = Map(dispatch, data, dimensions);
  const timeline = Timeline(dispatch, data, dimensions);
  const tree = Tree(dispatch, data, dimensions);
  const overview = Overview(dispatch, data, dimensions);


});
