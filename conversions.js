function convertQuant(data, record_name) {
  
  let results = [];
  
  for (let i = 0; i < data.length; i++) {
    let xyz = quatToEuler([data[i][record_name + '[0]'], data[i][record_name + '[1]'], data[i][record_name + '[2]'], data[i][record_name + '[3]']])

    xyz.forEach(function (e) {
      xyz[xyz.indexOf(e)] = e * 180 / Math.PI;
    });
    
    results.push(xyz);
  }
  
  return results;
}

function convertMillimeters(data, record){
  
  let newData = data;
  
  for (let i = 0; i < data.length; i++){
    newData[i][record] = data[i][record] / 1000;
  }
  
  return newData;
}

function convertRad(data, record){
  
  let newData = data;
  
  for (let i = 0; i < data.length; i++){
    newData[i][record] = data[i][record] * 180 / Math.PI;;
  }
  
  return newData;
}