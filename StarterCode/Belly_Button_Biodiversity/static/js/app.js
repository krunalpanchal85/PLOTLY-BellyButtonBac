function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    console.log(data)
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });


  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
 
    d3.json(`/samples/${sample}`).then((data) => {
    // Use d3 to select the panel with id of `#data`
    var PANEL = d3.select("#data");


    // @TODO: Build a Bubble Chart using the sample data

    var trace1 = {
      x: data.otu_ids.slice(0, 10),
      y: data.sample_values.slice(0, 10),
      text: data.otu_labels.slice(0, 10),
      size: data.sample_values.slice(0, 10),
      mode: 'markers',
      marker: {
        color: data.otu_ids.slice(0, 10),
        size: data.sample_values.slice(0, 10)
      }
    };

    var trace0 = [trace1];

    var layout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 600
    };

     Plotly.newPlot('bubble', trace0, layout, {showSendToCloud:true});

    // @TODO: Build a Pie Chart
    // Slice the first 10 objects for plotting     
    var data = [{
      values: data.sample_values.slice(0, 10),
      labels: data.otu_ids.slice(0, 10),
      type: "pie"
    }];

    var layout = {
      height: 600,
      width: 800
    };

    Plotly.plot("pie", data, layout);
    // -------------------------------------
      // Sorts descending


    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  console.log(newSample);
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();