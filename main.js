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

top.addEventListener('click', function(){
  console.log('hello');
    //document.getElementById('tree-container').scrollTop = 0; // For Safari
    document.getElementById('tree-container').scrollTop = 0; // For Chrome, Firefox, IE and Opera
});


d3.json('data/data.json').then(function (data) {



  console.log('loaded', data)



  const dispatch = d3.dispatch("timelineBrushed", "openBranch", "switchTab", "mapped", "unmapped", "chartCreated", "pinned", "unpinned", "hover", "unhover");

  const default_charts = [
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Recorded (Millimeters)'
  },
    {
      data: data['vehicle_global_position'],
      log: 'vehicle_global_position',
      x: 'timestamp',
      y: 'alt',
      title: 'Altitude Estimated (Meters)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[3]',
      title: 'Thrust (0=no thrust - 1=max thrust)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[0]',
      title: 'Roll (-1 - 1)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[1]',
      title: 'Pitch (-1 - 1)'
    },
    {
      data: data['actuator_controls_0'],
      log: 'actuator_controls_0',
      x: 'timestamp',
      y: 'control[2]',
      title: 'Yaw (-1 - 1)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'vel_m_s',
      title: 'Velocity (Meters/second)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'remaining',
      title: 'Battery Remaining (0=Empty - 1=Full)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'current_filtered_a',
      title: 'Battery Current (Amps)'
    },
    {
      data: data['battery_status'],
      log: 'battery_status',
      x: 'timestamp',
      y: 'discharged_mah',
      title: 'Battery Discharged (Milliamp Hours)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'noise_per_ms',
      title: 'Noise (Per Meters/second)'
    },
    {
      data: data['vehicle_gps_position'],
      log: 'vehicle_gps_position',
      x: 'timestamp',
      y: 'jamming_indicator',
      title: 'Jamming Indicator'
    },
    {
      data: data['cpuload'],
      log: 'cpuload',
      x: 'timestamp',
      y: 'load',
      title: 'CPU Load (0 - 1)'
    }


  ]

  const map = Map(dispatch, data, dimensions);
  const timeline = Timeline(dispatch, data, dimensions);
  const tree = Tree(dispatch, data, dimensions, default_charts);



});
