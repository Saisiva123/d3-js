// each data format isFiniteacceleration: "12"
// cylinders: "8"
// displacement: "307"
// horsepower: "130"
// mpg: "18"
// name: "chevrolet chevelle malibu"
// origin: "USA"
// weight: "3504"
// year: "1970"
var data
const width = 600,
  height = 350,
  margin = { top: 20, bottom: 70, right: 20, left: 60 }
var onYaxis = 'weight',
  onXaxis = 'horsepower'
const circleRadius = 7
var menuOptions = []

loadData = async () => {
  data = await d3
    .csv('https://vizhub.com/curran/datasets/auto-mpg.csv')
    .then((res) => res)
    console.log(data,data.columns)
  menuOptions = data.columns
  constructChart()
}

loadData()

function constructChart() {
  let xAxisItems = data.map((items) => parseInt(items[onXaxis]))
  let yAxisItems = data.map((items) => parseInt(items[onYaxis]))

  // scaling
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(yAxisItems).sort((a, b) => b - a))
    .range([0, height - margin.bottom - margin.top])
    .nice()

  const xScale = d3
    .scaleLinear()
    .domain([d3.min(xAxisItems), d3.max(xAxisItems)])
    .range([0, width - margin.left - margin.right])
    .nice()

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  //axis
  const yAxis = svg
    .append('g')
    .call(d3.axisLeft(yScale).tickSize(-width).tickPadding(5))
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xAxis = svg
    .append('g')
    .call(d3.axisBottom(xScale).tickSize(-height).tickPadding(10))
    .attr(
      'transform',
      `translate(${margin.left},${height + (margin.top - margin.bottom - margin.top)})`,
    )

  //draw cirlces
  const g = svg
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${margin.left},${margin.top})`)

  g.append('circle')
    .classed('circle', true)
    .attr('cy',(height-margin.bottom -margin.top)/2)
    .attr('cx',(width-margin.left-margin.left)/2)
    .transition()
    .attr('r', circleRadius)
    .attr('cx', (d) => xScale(d[onXaxis]))
    .attr('cy', (d) => yScale(d[onYaxis]))
    .delay((d,i)=>i*5)
    .duration(1000)


  // left and bottom legends
  xAxis
    .append('text')
    .text(onXaxis)
    .attr(
      'transform',
      `translate(${(width - margin.right - margin.left) / 2},40)`,
    )
    .classed('legends', true)
  yAxis
    .append('text')
    .text(onYaxis)
    .classed('legends', true)
    .attr('transform', `rotate(-90)`)
    .attr('x', -(height - margin.bottom) / 3)
    .attr('y', -40)

  // call will call the function and the first parameter will be the select attached and other are optional parameters we send
  d3.select('#yMenu').call(dropdown, menuOptions)
  d3.select('#xMenu').call(dropdown, menuOptions)
}

function dropdown(elem, data) {
  let select = elem.selectAll('select').data([null])
  select = select
    .enter()
    .append('select')
    .merge(select)
    .attr('transform', `translate(0,0)`)
    .on('change', (event) => {
      changeTheAxis(event, elem)
    })

  const option = select.selectAll('option').data(data)
  option
    .enter()
    .append('option')
    .merge(option)
    .attr('value', (d) => d)
    .text((d) => d)
    // option.each((d)=>{
    //   return d===onXaxis ?  d3.select(this).attr('selected',d) : null
    // })
}

function changeTheAxis(event, dropdown) {
  d3.select('svg').remove()
  dropdown.attr('id') === 'yMenu'
    ? (onYaxis = event.target.value)
    : (onXaxis = event.target.value)

  constructChart()
}
