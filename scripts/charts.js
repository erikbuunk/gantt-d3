
let dataset; // global for datase

// convert datatypes when importing new data
function rowConverter(d) {
  return {
    ID: parseInt(d.ID),
    Phase: d.Phase,
    Track: d.Track,
    Title: d.Title,
    Start: moment(d.Start, "MMM-DD-YYYY").toDate(),
    End: moment(d.End, "MMM-DD-YYYY").toDate(),
    Line: parseInt(d.Line),
    Class: d.Class,
    Group: d.Group
  }
};


d3.csv('data/planning.csv', rowConverter)
  .then(function(data) {
    dataset = data;
    generateVis();
  })
  .catch(function(error) {
    console.log(error); // handle error
  })


function generateVis() {
  let w = 800; // widht of the svg area
  let h = 500; // height of svg area
  let n = Math.max.apply(Math, dataset.map(function(o) {
    return o.Line;
  })); // number of lines (Lines are numbered in the file because gantt block are sometimes placed on the same line)

  const padding = 5; // between elements in table
  const margin = 10; // margin round table (area around graph is also needed of strokewidth)
  const wtrack = 150; // with of the track column
  const wgroup = wtrack; // widht of the group column
  const htimeline = 75; // height of the axis
  const hTabTitles = 40; // height of the table header
  const wgantt = w - wtrack - wgroup - 2 * padding - 2 * margin; // width of gantt chart
  const hgantt = h - htimeline - padding - 2 * margin - hTabTitles; // height of gantt chart
  const hbar = parseInt((h - hTabTitles - htimeline - (n - 1) * padding) / n); // height of the bars
  const rounded = 0.3 * hbar; // rounded corners of bars


  // Time scales & axis
  const startDate = new Date(Math.min.apply(Math, dataset.map(function(o) {
    return o.Start;
  })));
  const endDate = new Date(Math.max.apply(Math, dataset.map(function(o) {
    return o.End;
  })));

  var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([margin + wtrack + padding + wgroup + padding, w - margin])



  const x_axis = d3.axisBottom()
    .scale(x)
    .ticks(  5 )
    .tickFormat( function ( x ) {
                     // get the milliseconds since Epoch for the date
                     var milli = (x.getTime() - 10000);

                     // calculate new date 10 seconds earlier. Could be one second,
                     // but I like a little buffer for my neuroses
                     var vanilli = new Date(milli);

                     // calculate the month (0-11) based on the new date
                     var mon = vanilli.getMonth();
                     var yr = vanilli.getFullYear();

                     // return appropriate quarter for that month
                     if ( mon <= 2 ) {
                         return  "Q1 " + yr;
                     } else if ( mon <= 5 ) {
                         return  "Q2 " + yr;
                     } else if ( mon <= 8 ) {
                         return  "Q3 " + yr;
                     } else {
                         return "Q4 " + yr;
                     }
                 } )


  // Graphic elements
  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  //headers
  d3.select("svg")
    .append("text")
      .text("Track")
      .attr("x", margin)
      .attr("y", hTabTitles/2 + margin)
      .attr("class", "table-header");


    d3.select("svg")
      .append("text")
        .text("Group")
        .attr("x", margin+padding+wtrack)
        .attr("y", hTabTitles/2 + margin)
        .attr("class", "table-header")

  // Gantt bars
  const rect = svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', d => x(d.Start))
    // .attr('y', d => x(d.End))
    // .attr('x', wtrack + wgroup + 2* padding+margin + )
    .attr('y', (d, i) => (d.Line - 1) * (hbar + padding) + margin + hTabTitles)
    // .attr('width', wgantt/2)
    .attr('width', d => x(d.End) - x(d.Start))
    .attr('height', hbar)
    .attr('class', d => d.Class)
    .attr('rx', rounded + "px")

  // Labels in Gantt bars
  const titles = svg.selectAll('#title')
    .data(dataset)
    .enter()
    .append('text')
    .attr('x', d => x(d.Start) + (x(d.End) - x(d.Start)) / 2)
    // .attr('y', d => x(d.End))
    // .attr('x', wtrack + wgroup + 2* padding+margin + )
    .attr('y', (d, i) => (d.Line - 1) * (hbar + padding) + margin + hbar / 2 +  hTabTitles)
    // .attr('width', wgantt/2)
    .text(d => d.Title)
    .attr('class', 'bar-font')


  // Track Labels
  let tracks=[];

  const track = svg.selectAll('#track')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => { // Do not repeat labels
      if(tracks.indexOf(d.Track) < 0 ) {
        tracks.push(d.Track);
        return d.Track;
      } else {
        return '';
      }
    })
    .attr('x', margin)
    .attr('y', (d, i) => (d.Line - 1) * (hbar + padding) + margin + (hbar / 2) +  hTabTitles)
    .attr('class', 'table-font')


  let groups=[];
  const group = svg.selectAll('#group')
    .data(dataset)
    .enter()
    .append('text')
    .text(d => { // Do not repeat labels
      if(groups.indexOf(d.Group) < 0) {
        groups.push(d.Group);
        return d.Group;
      } else {
        return '';
      }
    })
    .attr('x', wtrack + padding + margin)
    .attr('y', d => (d.Line - 1) * (hbar + padding) + margin + (hbar / 2) + hTabTitles)
    .attr('class', 'table-font')


    // horizontal axis
    svg.append("g")
      .attr("transform", "translate(0, " + (h-htimeline+margin+padding*2) + ")")
      .call(x_axis)

    // current date shown in verticl line
    const now = parseInt(x(new Date()));

    var lineGenerator = d3.line();
    var points = [
      [now, margin+hTabTitles/2-padding],
      [now, h-htimeline/2 ]
    ];
    var pathData = lineGenerator(points);

    d3.select("svg")
      .append('path')
      .attr('d', pathData)
      .attr('class', 'now')
      .attr("stroke-dasharray","10,10")
      .attr("stroke-linecap", "round");

}
