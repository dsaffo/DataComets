d3.json('data.json').then(function(data){
  
  console.log('loaded', data)

  
  const dispatch = d3.dispatch("timelineFiltered","openBranch","closeBranch","encodePath");
  
  const map = Map(dispatch, data);
  const timeline = Timeline(dispatch, data);
  const tree = Tree(dispatch, data);
  
  
  
  
});