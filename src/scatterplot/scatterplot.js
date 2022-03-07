function main(){
    const width = 800;
    const height = 800;
    const margin = 300;

    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)

    const visualizationWidth = svg.attr("width") - margin;
    const visualizationHeight = svg.attr("height") - margin;

    //text for the canvas of the title
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x",50)
        .attr("y",50)
        .attr("font-size", "20px")
        .text("Sales Made by Games Based On Review Score")

    const xScale = d3.scaleLinear().range([0, visualizationWidth]);
    const yScale = d3.scaleLinear().range([visualizationHeight,0]);

    //different color scales for publishing companies
    const nintendoScale = d3.scaleSequential().interpolator(d3.interpolateReds).domain([0,100])
    const ubisoftScale = d3.scaleSequential().interpolator(d3.interpolateBlues).domain([0,100]);

    const container_g = svg.append("g")
        .attr("transform", "translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/228e2be3bc65da29bdea8d90bf1f978d/raw/5f36bd81ad56ccf627916e636418378f3d6df71a/video_game_sales_by_reviews.csv").then(data => {

        xScale.domain([30,100]);
        yScale.domain([0,7]);

        //create the tooltip for the plot
        const tooltip = d3.select("body")
            .append("div")
            .style("opacity",0)
            .attr("class","tooltip")
            .style("background-color","white")
            .style("border","solid")
            .style("width","10%")
            .style("border-radius",5)
            .style("padding","5px")

        //mouseover function for the tooltip
        let mouseover = function(d) {
            tooltip
                .style("opacity",1)
            d3.select(this)
                .style("stroke","black")
                .style("opacity",1)
        }

        //mouseleave action
        let mouseleave = function(d){
            tooltip
                .style("opacity",0)
            d3.select(this)
                .style("stroke","none")
                .style("opacity", 1)
        }

        //append the circles on the graph and see what color scale to use based on the publisher
        container_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .style("fill",d=>d.Publishers =="Ubisoft"? ubisoftScale(d.Review_Score) : nintendoScale(d.Review_Score))
            .attr("class", "dot")
            .attr("cx", function(d){ return xScale(d.Review_Score); })
            .attr("cy", function(d){ return yScale(d.Sales); })
            //actions to display and remove tooltip
            .on("mouseover",mouseover)
            .on("mousemove",(Event,d)=>{
                tooltip
                    .html("Publisher: " + d.Publishers+"<br>Sales: $"+d.Sales+"<br>MetaScore: "+d.Review_Score)
                    .style("left", (Event.x)/2-100+"px")
                    .style("top",(Event.y)/2 + "px")
                    .style("font-family","sans-serif")
            })
            .on("mouseleave",mouseleave)

        //Display the X-axis
        container_g.append("g")
            .attr("transform", "translate(0, " + 500 + ")")
            .call(d3.axisBottom(xScale).tickFormat(function(d) {
                return d;
            }).ticks(10))
            .append("text")
            .attr("y", visualizationHeight-450)
            .attr("x", visualizationWidth-250)
            .attr("font-size", "20px")
            .attr("stroke", "black")
            .text("The metascore for each videogame")

        container_g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){
                return d + "mill";
            }).ticks(10))
            .append("text")
            .attr("font-size","20px")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", -50)
            .attr("dy","-4.1em")
            .attr("stroke", "black")
            .text("Sales in Millions of Dollars for Video Game")

        //orient the canvas to the desired location.
        container_g.append("g")
            .attr("class", "nintendo")
            .attr("transform", "translate(600,100)")
            .attr("font-family","sans-serif");

        //set the color and size legend for the bubble chart
        const nintendo = d3.legendColor()
            .title("Nintendo")
            .scale(nintendoScale);

        //call the color scales and append them to the canvas
        container_g.select(".nintendo")
            .call(nintendo);

        container_g.append("g")
            .attr("class", "ubisoft")
            .attr("transform", "translate(600,300)")
            .attr("font-family","sans-serif");

        //set the color and size legend for the bubble chart
        const ubisoft = d3.legendColor()
            .title("Ubisoft")
            .scale(ubisoftScale);

        //call the ubisoft scale
        container_g.select(".ubisoft")
            .call(ubisoft);


    })
}
main();