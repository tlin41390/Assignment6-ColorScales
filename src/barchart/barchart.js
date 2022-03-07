function main(){
    var canvasWidth = 700;
    var canvasHeight = 700;
    var margin = 200;

    var svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    var width = svg.attr("width") - margin;
    var height = svg.attr("height") - margin;

    //add the text to the canvas for the title

    svg.append("text")
        .attr("transform", "translate(100, 0)")
        .attr("x",50)
        .attr("y", 50)
        .attr("font-size", "20px")
        .attr("font-family","sans-serif")
        .text("Total Sales in Millions By Publishing Game Companies")

    var xScale = d3.scaleBand().range([0, width]).padding(0.3);
    var yScale = d3.scaleLinear().range([height, 0]);

    var container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/e7e7aadc511857c518c1bbafc7845f88/raw/b94e87e3601f1561ae360c57628b3bbb08a381d4/total_game_sales.csv").then(data => {

        xScale.domain(data.map(function(d){
            return d.Publishers;
        }));
        yScale.domain([0, 100]);

        //create the color scale for the barchart.
        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateBlues).domain([0,99])

        // Draw bars!
        container_g.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d){ return xScale(d.Publishers); })
            .attr("y", function(d){return yScale(d.Total_Sales); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d){ return height - yScale(d.Total_Sales); })
            .attr("fill",d=>colorScale(d.Total_Sales));

        // Display the X-axis
        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height-450)
            .attr("x", width-250)
            .attr("font-size", "20px")
            .attr("stroke", "black")
            .text("Publisher")

        // Display the Y-axis
        container_g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d) {
                return d + "mill.";
            }).ticks(10))
            .append("text")
            .attr("font-size","20px")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", -190)
            .attr("dy", "-4.1em")
            .attr("stroke", "black")
            .text("Sales in Millions")

        //translate the color scale
        container_g.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(400,100)")
            .attr("font-family","sans-serif");

        //set the color and size legend for the bubble chart
        const legendOrdinal = d3.legendColor()
            .scale(colorScale);

        container_g.select(".legendOrdinal")
            .call(legendOrdinal);
    })
}
main();