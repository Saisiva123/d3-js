// each data format isFiniteacceleration: "12"
// timestamp
// temperature
// const d3Collection = require('d3-collection');
// import * as d3Collection from 'd3-collection';
var data;
var newData = [];
const width = 600,
  height = 250,
  margin = { top: 20, bottom: 40, right: 20, left: 40 };
const onXaxis = "timestamp",
  onYaxis = "temperature";
const circleRadius = 3;

loadData = async () => {
  data = await d3
    .csv(
      "https://vizhub.com/curran/datasets/data-canvas-sense-your-city-one-week.csv"
    )
    .then((res) => res);
  data?.length && console.log("data loaded");
  data?.length && constructChart();
};

loadData();

function constructChart() {
  let xAxisItems = data.map((items) => new Date(items[onXaxis]));
  let yAxisItems = data.map((items) => parseInt(items[onYaxis]));
  // scaling
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yAxisItems).sort((a, b) => b - a))
    .range([0, height - margin.bottom])
    .nice();

  const xScale = d3
    .scaleTime()
    .domain([d3.min(xAxisItems), d3.max(xAxisItems)])
    .range([0, width - margin.left - margin.right])
    .nice();

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  //axis
  svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(-width))
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("g")
    .call(d3.axisBottom(xScale).tickSize(-height))
    .attr(
      "transform",
      `translate(${margin.left},${height + margin.top - margin.bottom})`
    );

  const g = svg
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${margin.left},${margin.top})`);

  const nestedData = d3
    .nest()
    .key((d) => d.city)
    .entries(data);

  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  colorScale.domain(nestedData.map((d) => d.city));

  const line = d3
    .line()
    .x((d) => xScale(new Date(d[onXaxis])))
    .y((d) => yScale(d[onYaxis]));
  g.selectAll(".line-path")
    .data(nestedData)
    .enter()
    .append("path")
    .attr("d", (d) => line(d.values))
    .classed("line-path", true)
    .attr("stroke", (d) => colorScale(d.key));
}
