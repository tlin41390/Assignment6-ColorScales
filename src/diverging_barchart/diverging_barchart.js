function main(){
    const canvasWidth = 700;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    const width = svg.attr("width") - margin;
    const height = svg.attr("height") - margin;

    svg.append("text")
        .attr("transform", "translate(100, 0)")
        .attr("x",50)
        .attr("y", 50)
        .attr("font-size", "20px")
        .attr("font-family","sans-serif")
        .text("Change In Affordability Between States For 2014")


    const container_g = svg.append("g")
        .attr("transform","translate(100,100)");

    const xScale =  d3.scaleLinear().range([0,width])
    const yScale = d3.scaleBand().range([height,0]).padding(0.1);
    const divergingColor = d3.scaleSequential().interpolator(d3.interpolateRdBu).domain([-15,15]);

    d3.csv("https://gist.githubusercontent.com/tlin41390/92417015baa3d4c23303d0a254e0cb4e/raw/0e0b5219220225a9caf57cefc5cafc377784e4a6/states.csv").then(data => {
        xScale.domain([-15,15]);
        yScale.domain(data.map(function(d){ return d.State}));

        container_g.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x",d => xScale(Math.min(0,d.affordability)))
            .attr("y", d => yScale(d.State))
            .attr("height",yScale.bandwidth())
            .attr("width", d=>Math.abs(xScale(d.affordability)-xScale(0)))
            .style("fill",d=>divergingColor(d.affordability));

        container_g.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x",xScale(0))
            .attr("y", d=>yScale(d.State)+40)
            .attr("text-anchor", d=> d.affordability < 0 ? "start" : "end")
            .attr("font-family","sans-serif")
            .text(d=> d.State)

        container_g.append("g")
            .attr("transform","translate(0 " + height + ")")
            .call(d3.axisBottom(xScale).ticks(18))
            .append("text")
            .attr("y",height-450)
            .attr("x", width-250)
            .attr("font-size","20px")
            .attr("stroke","black")
            .text("increase/decrease in affordability");

        container_g.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(500,100)")
            .attr("font-family","sans-serif");

        //set the color and size legend for the bubble chart
        const legendOrdinal = d3.legendColor()
            .scale(divergingColor);

        container_g.select(".legendOrdinal")
            .call(legendOrdinal);



    })
}
main();