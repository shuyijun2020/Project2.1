// Define chart size and margins
var svgWidth = 960;
var svgHeight = 800;

var margin = {
  top: 50,
  right: 30,
  bottom: 140,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "HDI";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
  console.log(chosenXAxis)
  console.log(d3.max(data, d => d[chosenXAxis]))

  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenXAxis]) - 20,
    d3.max(data, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);

  return xLinearScale;

}
// Initial Params
var chosenYAxis = "HappinessScore";

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[chosenYAxis]) * 0.5,
    d3.max(data, d => d[chosenYAxis]) * 1.1
    ])
    .range([0, height]);

  return yLinearScale;

}
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, textGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));
  textGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup) {

  var label;

  if (chosenXAxis === "HDI") {
    label = "HDI:";
  }
  else if (chosenXAxis === "GDP_PerCapita") {
    label = "GDP:";
  }
  else if (chosenXAxis === "Spirit_PerCapita") {
    label = "Spirit:";
  }
  else if (chosenXAxis === "Beer_PerCapita") {
    label = "Beer:";
  }
  else {
    label = "Wine:";
  }
  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.Country}<br>${label} ${d[chosenXAxis]}`);
    });


  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//Load data 
var url = "/all_data";

d3.json(url)
  .then(function (happinessdata) {
    console.log(happinessdata);

    // xLinearScale function 
    var xLinearScale = xScale(happinessdata, chosenXAxis);
    var yLinearScale = yScale(happinessdata, chosenYAxis);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(happinessdata, d => d.HappinessScore)])
      .range([height, 0]);


    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //   // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(happinessdata)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d.HappinessScore))
      .attr("r", 20)
      .attr("fill", "tan")
      .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll("text.Country")
      .data(happinessdata)
      .enter()
      .append("text")
      .attr("class", "Country")
      .text(d => d.HappinessScore)
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d.HappinessScore))
      .style("text-anchor", "middle")

    // Create location for three x-axis labels
    var labelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var HDILabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "HDI") // value to grab for event listener
      .classed("active", true)
      .text("HDI");
    var GDPLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "GDP_PerCapita") // value to grab for event listener
      .classed("active", true)
      .text("GDP_PerCapita");
    var SpiritLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "Spirit_PerCapita") // value to grab for event listener
      .classed("active", true)
      .text("Spirit_PerCapita");
    var BeerLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 80)
      .attr("value", "Beer_PerCapita") // value to grab for event listener
      .classed("active", true)
      .text("Beer_PerCapita");
    var WineLabel = labelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 100)
      .attr("value", "Wine_PerCapita") // value to grab for event listener
      .classed("active", true)
      .text("Wine_PerCapita");

    // append y axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .classed("axis-text", true)
      .text("HappinessScore");

    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // x axis labels event listener
    labelsGroup.selectAll("text")
      .on("click", function () {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

          // replaces chosenXAxis with value
          chosenXAxis = value;

          // console.log(chosenXAxis)

          // updates x scale for new data
          xLinearScale = xScale(happinessdata, chosenXAxis);

          // updates x axis with transition
          xAxis = renderAxes(xLinearScale, xAxis);

          // updates circles with new x values
          circlesGroup = renderCircles(circlesGroup, textGroup, xLinearScale, chosenXAxis);

          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

          // changes classes to change bold text
          if (chosenXAxis === "HDI") {
            HDILabel
              .classed("active", true)
              .classed("inactive", false);
            GDPLabel
              .classed("active", false)
              .classed("inactive", true);
            SpiritLabel
              .classed("active", false)
              .classed("inactive", true);
            BeerLabel
              .classed("active", false)
              .classed("inactive", true);
            WineLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "GDP_PerCapita") {
            GDPLabel
              .classed("active", true)
              .classed("inactive", false);
            HDILabel
              .classed("active", false)
              .classed("inactive", true);
            SpiritLabel
              .classed("active", false)
              .classed("inactive", true);
            BeerLabel
              .classed("active", false)
              .classed("inactive", true);
            WineLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "Spirit_PerCapita") {
            SpiritLabel
              .classed("active", true)
              .classed("inactive", false);
            HDILabel
              .classed("active", false)
              .classed("inactive", true);
            GDPLabel
              .classed("active", false)
              .classed("inactive", true);
            BeerLabel
              .classed("active", false)
              .classed("inactive", true);
            WineLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis === "Beer_PerCapita") {
            BeerLabel
              .classed("active", true)
              .classed("inactive", false);
            HDILabel
              .classed("active", false)
              .classed("inactive", true);
            SpiritLabel
              .classed("active", false)
              .classed("inactive", true);
            GDPLabel
              .classed("active", false)
              .classed("inactive", true);
            WineLabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else {
            WineLabel
              .classed("active", true)
              .classed("inactive", false);
            SpiritLabel
              .classed("active", false)
              .classed("inactive", true);
            HDILabel
              .classed("active", false)
              .classed("inactive", true);
            GDPLabel
              .classed("active", false)
              .classed("inactive", true);
            BeerLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });
  });