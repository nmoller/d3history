

// On veut avoir la possibilite de lire plusiers fichiers
d3.queue()
  .defer(d3.csv, 'pub_32016_sigle_resume_20161027.csv')
  .defer(d3.csv, 'pub_12017_sigle_resume_20170328.csv')
  .defer(d3.csv, 'pub_22017_sigle_resume_20170802.csv')
  .await(treatDataCours);

// On veut avoir la possibilite de lire plusiers fichiers
d3.queue()
  .defer(d3.csv, 'pub_32016_sigle_resume_20161027.csv')
  .defer(d3.csv, 'pub_12017_sigle_resume_20170328.csv')
  .defer(d3.csv, 'pub_22017_sigle_resume_20170802.csv')
  .await(treatDataEtudiants);

// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

/** Graph for the number of courses*/
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('id', 'graph1')
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

/** Graph for the number of students */
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg2 = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr('id', 'graph2')
  .append("g")
  .attr("transform", 
         "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

/**
 * [extractValues description]
 * We treat the data before presenting it.
 * @param  {[type]} serie   [description]
 * @param  {[type]} session [description]
 * @return {[type]}         [description]
 */
function extractValues(serie, session) {
	var noCours = 0;
	var noEtudiants = 0;
	serie.forEach(function(d,i){
		noCours += parseInt(d.nbcours);
		noEtudiants += parseInt(d.etudiants);
	});
	return {
		'noCours' : noCours,
		'noEtudiants' : noEtudiants,
		'session' : session
	};
}

/**
 * [treatSessions description]
 * To centralise series insertions one we add more files.
 * @param  {[type]} series [description]
 * @return {[type]}        [description]
 */
function treatSessions(series) {
	var data = [];
	var sessions = ['automne-2016', 'hiver-2017', 'été-2017'];
	series.forEach(function(d, i) {
		data.push(extractValues(d, sessions[i]))
	});
	return data;
}

/**
 * [treatData description]
 * Chaque fichier ajoute une serie à traiter
 * @param  {[type]} error  [description]
 * @param  {[type]} serie1, serie2....  [description]
 * @return {[type]}        [description]
 */
function treatDataCours(error) {
	// To catch all the series no mather how many we have
	var series = Array.prototype.slice.call(arguments, 1);
	var data = treatSessions(series);

	// Scale the range of the data in the domains
	x.domain(data.map(function(d, i) { return d.session; }));
	y.domain([0, d3.max(data, function(d) { return d.noCours; })]);

	// append the rectangles for the bar chart
	svg.selectAll(".bar")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d,i) { return x(d.session); })
		.attr("y", function(d) { return y(d.noCours); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.noCours); })
		.on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.session + "<br/>" + 'No de cours: ' + d.noCours)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

	// add the x Axis
	  svg.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // add the y Axis
	  svg.append("g")
	      .call(d3.axisLeft(y));
}


/**
 * [treatData description]
 * Chaque fichier ajoute une serie à traiter
 * @param  {[type]} error  [description]
 * @param  {[type]} serie1, serie2.... [description]
 * @return {[type]}        [description]
 */
function treatDataEtudiants(error) {
	// To catch all the series no mather how many we have
	var series = Array.prototype.slice.call(arguments, 1);
	var data = treatSessions(series);

	// Scale the range of the data in the domains
	x.domain(data.map(function(d, i) { return d.session; }));
	y.domain([0, d3.max(data, function(d) { return d.noEtudiants; })]);

	// append the rectangles for the bar chart
	svg2.selectAll(".bar2")
		.data(data)
	  .enter().append("rect")
		.attr("class", "bar2")
		.attr("x", function(d,i) { return x(d.session); })
		.attr("y", function(d) { return y(d.noEtudiants); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d.noEtudiants); })
		.on("mouseover", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.session + "<br/>" + 'Étudiants: ' + d.noEtudiants)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
        .on("mouseout", function(d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

	// add the x Axis
	  svg2.append("g")
	      .attr("transform", "translate(0," + height + ")")
	      .call(d3.axisBottom(x));

	  // add the y Axis
	  svg2.append("g")
	      .call(d3.axisLeft(y));
}