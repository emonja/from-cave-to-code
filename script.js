const svg = d3.select("#timeline");
const margin = { top: 80, right: 40, bottom: 80, left: 40 };
const width = 1800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const g = svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

const color = d3.scaleOrdinal()
  .domain(["Visual", "Sound", "Interactive", "Digital"])
  .range(["#ff8c00", "#1e90ff", "#8a2be2", "#2ecc71"]);

const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

d3.json("data/media_timeline.json").then(data => {
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

  const xAxis = d3.axisBottom(x)
    .tickFormat(d => d < 0 ? `${-d} BCE` : d)
    .ticks(20);

  g.append("g")
    .attr("transform", `translate(0,${height / 2})`)
    .call(xAxis);

  const events = g.selectAll(".event")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "event")
    .attr("transform", d => `translate(${x(d.year)},${height / 2})`);

  events.append("circle")
    .attr("class", "event-circle")
    .attr("r", 8)
    .attr("fill", d => color(d.category))
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", .9);
      tooltip.html(`<strong>${d.title}</strong><br>${d.year}<br>${d.description}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));

  events.append("text")
    .attr("class", "event-label")
    .attr("y", (d, i) => (i % 2 === 0 ? -20 : 30))
    .text(d => d.title);
});
