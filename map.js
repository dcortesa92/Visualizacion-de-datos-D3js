//Importa datos archivo Json
d3.json("practica_airbnb.json")
    .then((Data) => {
        drawMap(Data);
    });
  
//Imprime los datos
function drawMap(data) {
    console.log(data)

    //Crea Lienzo
    var width = 600;
    var height = 600;

    var svg = d3.select("#div1")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g");

    //Establece Escala de colores del mapa 
    var avmin = d3.min(data.features, (d) => {return d.properties.avgprice})
    var avmax = d3.max(data.features, (d) => {return d.properties.avgprice})
    var color = d3.scaleLinear()
                    .domain([avmin,avmax])
                    .range(["lightyellow", "darkred"])
                    .unknown("#D7DBDD")

    //Configura ubicacion del Mapa
    var center = d3.geoCentroid(data)
    var projectionMercator = d3.geoMercator()
                                .scale(75000)
                                .center(center)
                                .translate([280, 320])
    var pathGenerator = d3.geoPath()
                            .projection(projectionMercator)
    
    //Pinta el mapa
    var pathMadrid = svg.append("g")
                        .selectAll("path")
                        .data(data.features)
                        .enter()
                        .append("path")
                        .attr("d", (d) => pathGenerator(d))
                        .attr("fill", (d) => color(d.properties.avgprice))
                        .attr("stroke", "#641E16")
                        .attr("stroke-width", 1)
                        .on("mouseover",handleMouseOver)
                        .on("mouseout",handleMouseOut)
                        .on("click", handleClick)
        
        //Etiqueta Mouse sobre el mapa
        pathMadrid.append("title")
                    .text(d => `Neighborhood: ${d.properties.name}\nAverage Price: ${d.properties.avgprice}Eur`)

        //Accion Mouse sobre el mapa   
        function handleMouseOver(){
            d3.select(this)
                .transition("mouse")
                .attr("fill","#A04000")
                .attr("stroke", "#641E16")
                .attr("stroke-width", 5)
                .style("cursor", "pointer")
        }       
        
        //Accion Mouse fuera del mapa
        function handleMouseOut(d){
            d3.select(this)
                .transition("mouse")
                .attr("fill",(d) => color(d.properties.avgprice))
                .attr("stroke", "#641E16")
                .attr("stroke-width", 1)
                .style("cursor", "default")
        }

    //Datos de la leyenda
    var infLeyend = []
    var itemLeyend = 9
    var numberLeyend = Math.ceil(avmax/itemLeyend)
    
    for (let i = 0; i <= itemLeyend; i++) {
            numberOK = avmin + numberLeyend * i
            infLeyend.push(numberOK);
    }

    //Variables y escala de la leyenda
    var nbofLegend = 10
    var widthLegend = (width/2) / nbofLegend
    var heightLegend = 20
    var minLeyend = d3.min(infLeyend, (d) => {return d})
    var maxLeyend = d3.max(infLeyend, (d) => {return d})

    var scaleLegend = d3.scaleLinear()
                        .domain([0,nbofLegend])
                        .range([minLeyend, maxLeyend])

    //Titulo de la leyenda
    var legendTitle = svg.append("g")
                        .append("text")
                        .attr("x", 15)
                        .attr("y", heightLegend - 5) 
                        .attr("fill", "darkred")
                        .text("Average Price Airbnb Madrid (Eur)")
                        .style("font-weight","bold")

    //Pinta los colores de la leyenda                     
    var legenColor = svg.append("g")
                            .selectAll("rect")
                            .data(infLeyend)
                            .enter()
                            .append("rect")
                            .attr("x", (d,i) => scaleLegend(i))
                            .attr("y", heightLegend)
                            .attr("width", widthLegend)
                            .attr("height", heightLegend) 
                            .attr("fill", (d) => color(d))
    
    //Pinta el texto de la leyenda
    var legendText = svg.append("g")
                        .selectAll("text")
                        .data(infLeyend)
                        .enter()
                        .append("text")
                        .attr("x", (d,i) => scaleLegend(i))
                        .attr("y", heightLegend * 2.7) 
                        .attr("fill", "darkred")
                        .text((d) => d)

    //Pinta Linea referencia para el texto de la leyenda
    var legendLine = svg.append("g")
                        .selectAll("line")
                        .data(infLeyend)
                        .enter()
                        .append("line")   
                        .attr("x1", (d,i) => scaleLegend(i))
                        .attr("x2", (d,i) => scaleLegend(i))
                        .attr("y1", heightLegend) 
                        .attr("y2", heightLegend * 2.3) 
                        .attr("stroke", "darkred")
                        .attr("stroke-width", 1)
}