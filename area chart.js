// each data format isFiniteacceleration: "12"
// timestamp
// temperature

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
    .csv("https://vizhub.com/curran/datasets/temperature-in-san-francisco.csv")
    .then((res) => res);
  data.map((item, index) => index < 15 && newData.push(item));
  newData?.length && constructChart();
};

loadData();

function constructChart() {
  let xAxisItems = data.map((items) => new Date(items[onXaxis]));
  let yAxisItems = data.map((items) => parseInt(items[onYaxis]));

  // scaling

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yAxisItems).sort((a, b) => b - a))
    .range([0, height - margin.bottom]);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(xAxisItems), d3.max(xAxisItems)])
    .range([0, width - margin.left - margin.right]);

  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // axis

  svg
    .append("g")
    .call(d3.axisLeft(yScale).tickSize(-width))
    .attr("transform", `translate(${margin.left},${margin.top})`);

  svg
    .append("g")
    .call(d3.axisBottom(xScale).tickSize(-height).ticks(6))
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

    g.append("circle")
      .attr("cx", (d) => xScale(new Date(d[onXaxis])))
      .attr("cy", (d) => yScale(d[onYaxis]))
      .classed("circle", true)
      .transition()
      .attr("r", circleRadius).duration(1000);

  const area = d3
    .area()
    .x((d) => xScale(new Date(d[onXaxis])))
    .y0(height - margin.bottom)
    .y1((d) => yScale(d[onYaxis]))
    .curve(d3.curveBasis);
  g.append("path").attr("d", area(data)).classed("area-path", true);
}
