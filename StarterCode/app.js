var url = "samples.json";
// Fetch the JSON data and console log it
function init(){
  var sample_location = d3.select("#selDataset")
  d3.json(url).then(function(data) {
    var samplenames=data.names
    console.log(samplenames);
    samplenames.forEach((x) => {
      sample_location.append("option").text(x).property("value", x)
    });
    var firstid=samplenames[0]
    maketable(firstid)
    buildCharts(firstid);
});
}
function maketable(sampleid){
  d3.json(url).then(function(data) {
    var samplemetadata=data.metadata
    var filterdata=samplemetadata.filter(x=>x.id==sampleid)
    console.log(filterdata);
    var filterresult=filterdata[0]
    console.log(filterresult);
        var table_location = d3.select("#sample-metadata")
        table_location.html('')
        Object.entries(filterresult).forEach(function([key, value]){ 
          var row = table_location.append("tr");
          var cell = row.append("td");
          cell.text(value)
        });
    }); 
}
init()
function optionChanged(newsample){
  maketable(newsample)
  buildCharts(newsample)
}
function buildCharts(sampleid) {
  // Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    var samples=data.samples
    var filterdata=samples.filter(x=>x.id==sampleid)
    var filterresult=filterdata[0]
    console.log(filterresult);
    // Create a trace for bubble plot
    trace1 = [{
      x: filterresult.otu_ids,
      y: filterresult.sample_values,
      mode: "markers",
      marker: {
        size: filterresult.sample_values,
        color: filterresult.otu_ids
      },
      text: filterresult.otu_labels
    }];
    // Create the layout for the bubble chart
    layout1 = {
      xaxis: {
        autorange: true,
        type: "linear",
        title: "OTU_ID"
      },
      yaxis: {
        autorange: true,
        type: "linear"
      }
    };
    // Create the bubble plot
    Plotly.newPlot("bubble", trace1, layout1);


    // Create a trace for bar chart
    var yticks = filterresult.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    trace2 = [{
      x: filterresult.sample_values.slice(0,10).reverse(),
      y: yticks,
      type:"bar",
      orientation: "h",
      text: filterresult.otu_labels.slice(0,10).reverse()
    }];
    // Create the layout for the bubble chart
    layout2 = {
      title: "Biodiversity",
    };
    // Create the bubble plot
    Plotly.newPlot("bar", trace2, layout2);
});
}
