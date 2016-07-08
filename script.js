getData = function() {
  return $.getJSON(
    // python -m SimpleHTTPSever
    "/cyclist-data.json",
    function(json) {
      return json
    }
  )
}
createChart = function(data) {
  var margin = {top: 30, right: 50, bottom: 30, left: 50},
      width = 950 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var timeMin = d3.min(data, function(d){
    var date = new Date();
    date.setMinutes(d.Time.slice(0, 2));
    date.setSeconds(d.Time.slice(3, 5));
    return date
  }),
  timeMax = d3.max(data, function(d){
    var date = new Date();
    date.setMinutes(d.Time.slice(0, 2));
    date.setSeconds(d.Time.slice(3, 5));
    return date
  });
  var placeMax = d3.max(data, function(d){
    return d.Place
  }),
  placeMin = d3.min(data, function(d){
   return d.Place
  });

  timeMax.setSeconds(10)
  timeMax.setMinutes(timeMax.getMinutes() + 1); // lets us add more to the x axis for better readability

  var xAxisScale = d3.scaleTime()
      .domain([timeMax-timeMin, 0])
      .range([0, width - margin.left - margin.right - 50])

  var yAxisScale = d3.scaleLinear()
      .domain([placeMin, placeMax + 1])
      .range([50, height - margin.top - margin.bottom])

  var y = d3.scaleLinear()
      .domain([placeMin, placeMax])
      .range([45.2, height - margin.top - margin.bottom - 15])

  var x = d3.scaleTime()
      .domain([timeMax, timeMin])
      .range([70.5, width - margin.left - margin.right + 20])

  var bottomAxis = d3.axisBottom(xAxisScale).tickFormat(d3.timeFormat("%M:%S"))
  var leftAxis = d3.axisLeft(yAxisScale);

  d3.select('body').select('svg')
      .style('background-color', 'white')
      .attr('height', height)
      .attr('width', width)
  var chart = d3.select('body').select('svg');

      chart.selectAll('.chart')
      .data(data).enter()
      .append('g')
      .append('circle')
      .attr('cx', function(d, i) {
        var date = new Date();
        date.setMinutes(d.Time.slice(0, 2));
        date.setSeconds(d.Time.slice(3, 5));
        return x(date)
      })
      .attr('cy', function(d, i){ return y(d.Place) })
      .attr('r', 3)
      .attr('stroke', 'black')
      .attr('fill', function(d, i){
        if (d.Doping == false) {
          return 'black'
        }
        else {
          return 'red'
        }
      })
      //.text(function(d, i){ console.log(d.Name)})

  d3.select("body").select("svg")
    .append("g")
    .attr("width", width)
    .attr("transform", "translate(70, 375)")
    .call(bottomAxis)

  d3.select("body").select("svg")
    .append("g")
    .attr("height", height - 50)
    .attr("transform", "translate(70, -5)")
    .call(leftAxis)

}
createDataSet = function() {
  var data = [];
  for (var i = 0; i < 75; i++) {
    var rand = Math.floor((Math.random() * 100) + 10)
    data.push(rand);
  }
  return data
}
$(function(){
  var promise = getData();
  promise.success(function(data){
    createChart(data);
  })
});
