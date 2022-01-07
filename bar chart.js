const data = [
  { country: "India", population: 9000 },
  { country: "china", population: 10000 },
  { country: "usa", population: 5000 },
  { country: "russia", population: 7000 },
  { country: "Japan", population: 9000 },
  { country: "Malaysia", population: 10000 },
  { country: "Singapore", population: 5000 },
  { country: "Korea", population: 7000 },
];

const width = 960,
  height = 400,
  margin = { top: 40, right: 20, bottom: 30, left: 100 },
  space = 10;

const xScale = d3
  .scaleLinear()
  .domain([0, d3.max(data.map((i) => i.population))])
  .range([0, width - margin.left - margin.right]);

const yScale = d3
  .scaleBand()
  .domain(data.map((i) => i.country))
  .range([0, height - margin.bottom - margin.top])
  .padding(0.1);

const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg
  .selectAll("g")
  .data(data)
  .enter()
  .append("g")
  .attr(
    "transform",
    (d, i) => `translate(${margin.left},${yScale(d.country) + margin.top})`
  );

g.append("rect")
  .attr("height", yScale.bandwidth())
  .transition()
  .attr("width", (d) => xScale(d.population))
  .duration(1000);

const text = g
  .append("text")
  .text((d) => d.population)
  .attr("y", 23)
  .attr("x", (d) => xScale(d.population) - 45)
  .classed("text", true);

svg
  .append("g")
  .call(d3.axisLeft(yScale))
  .attr("transform", `translate(${margin.left - space},${margin.top})`);

svg
  .append("g")
  .call(d3.axisBottom(xScale).tickFormat(d3.format(".0s")))
  .attr(
    "transform",
    `translate(${margin.left},${height - margin.bottom + space})`
  );
  
svg
  .append("text")
  .text("Top * countries with their population")
  .attr("x", 300)
  .attr("y", 20)
  .classed("heading", true);
