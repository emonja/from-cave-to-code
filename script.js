// D3.js Horizontal Timeline Visualization

const margin = { top: 50, right: 40, bottom: 50, left: 40 };
const width = window.innerWidth - margin.left - margin.right - 100;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#timeline")
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("data/media_timeline.json").then(data => {
  // Parse years
  data.forEach(d => d.year = +d.year);

  // Create scales
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

  // Timeline axis
  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Event markers
  svg.selectAll(".event")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "event")
    .attr("cx", d => x(d.year))
    .attr("cy", height / 2)
    .attr("r", 6)
    .attr("fill", d => {
      if (d.category === "Visual") return "#2a9d8f";
      if (d.category === "Sound") return "#e76f51";
      if (d.category === "Interactive") return "#f4a261";
      if (d.category === "Digital") return "#264653";
      return "#999";
    });

  // Tooltip
  const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

  svg.selectAll(".event")
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(200).style("opacity", 0.95);
      tooltip.html(`<strong>${d.title}</strong><br>${d.year}<br>${d.description}`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 40) + "px");
    })
    .on("mouseout", () => tooltip.transition().duration(300).style("opacity", 0));
});
