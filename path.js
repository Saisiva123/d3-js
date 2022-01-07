const data = [[0,80],[100,100],[200,30][300,50],[400,40],[500,80]]
const svg = d3.select("body").append("svg").attr('width',600).attr('height',400);
const line = d3.line().defined(d=> d!=null)
svg.append('path').data([data]).attr('d',line).style("stroke",'red')