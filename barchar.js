//Acción cuando se da click en el mapa
function handleClick(d) {
    d3.select("#div2").select("svg").remove()

//Crea Lienzo
    var width = 600;
    var height = 600;

    var svg = d3.select("#div2")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

//Define scala del eje X del barchar
var xposition = width / 8
var widthBarChar = width / 3
var heightBarChar = height / 1.6

var  scaleXBarChar = d3.scaleBand()
                .domain(d.properties.avgbedrooms.map(function(d) {return d.bedrooms}))
                .range([0, widthBarChar])
                .padding(0.5)
var xaxisBarChar = d3.axisBottom(scaleXBarChar)

//Define scala del eje Y del barchar
var yminBarChar = d3.min(d.properties.avgbedrooms, (d) => d.total)
var ymaxBarChar = d3.max(d.properties.avgbedrooms, (d) => d.total)
var scaleYBarChar = d3.scaleLinear()
                        .domain([0, ymaxBarChar])
                        .range([heightBarChar - 100, 0])
var yaxisBarChar = d3.axisLeft(scaleYBarChar)

//Pinta eje X del barchar
var xBarChar = svg.append("g")
                    .attr("transform","translate("+ xposition +"," + heightBarChar + ")")
                    .style("fill","darkred")
                    .call(xaxisBarChar)

//Pinta eje Y del barchar
var yBarChar = svg.append("g")
                    .attr("transform","translate(" + xposition + ", 100)")
                    .style("fill","darkred")
                    .call(yaxisBarChar)

//Pinta las barras del barchar
var barChar = svg.append("g")
                .selectAll("rect")
                .data(d.properties.avgbedrooms)
                .enter()
                .append("rect")
                .attr("transform","translate("+ xposition +",0)")
                .attr("x", (d) => scaleXBarChar(d.bedrooms))
                .attr("y", 0)
                .attr("width", scaleXBarChar.bandwidth())
                .attr("height", 0)
                .attr("fill", function (d) {
                                    if (d.total === yminBarChar) {
                                        return "#2874A6"
                                    } else if (d.total === ymaxBarChar) {
                                        return "#1D8348"
                                    } else {
                                        return "#A04000"
                                    }
                                })

    //Accion Mouse sobre las barras del barchar 
    barChar.append("title")
            .text(d => `Rooms: ${d.bedrooms}\nProperties: ${d.total}`)

    //Animación de las barras del barchar
    barChar.transition()
            .duration(1000)
            .delay(function (d,i) {return i * 200})
            .attr("y", (d) => scaleYBarChar(d.total) + 100)
            .attr("height", function (d) {return heightBarChar - 100 - scaleYBarChar(d.total)})

//Etiqueta Eje X del barchar
var roomsText =  svg.append("text")
                    .attr("transform","translate(" + xposition * 2 + ", " + (heightBarChar + 40) + ")") 
                    .style("text-anchor","middle")
                    .attr("fill", "darkred")
                    .style("font-weight","bold")
                    .text("Number of Rooms")
                    

//Etiqueta Eje Y del barchar
var propertiesText =  svg.append("text")
                            .attr("y", 80)
                            .attr("x", xposition)
                            .attr("dy", "1em")
                            .style("text-anchor","middle")
                            .attr("fill", "darkred")
                            .style("font-weight","bold")
                            .text("Number of Properties")
            
//Titulo del Barrio
var neighborhoodTitle =  svg.append("text")
                            .attr("y", 0)
                            .attr("x", 0)
                            .attr("dy", "1em")
                            .attr("fill", "darkred")
                            .style("font-weight","bold")
                            .style("font-Size", "30px")
                            .text(`Neighborhood: ${d.properties.name}`)


//Titulo del precio promedio general
var avgPriceTitle =  svg.append("text")
                        .attr("y", 30)
                        .attr("x", 0)
                        .attr("dy", "1em")
                        .attr("fill", "darkred")
                        .style("font-weight","bold")
                        .style("font-Size", "20px")
                        .text(`Average General Price: ${d.properties.avgprice}`)
}