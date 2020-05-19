function getPlots(id) {
    //read json data//
    d3.json("samples.json").then(sampleData => {
        //show data in console//
        console.log(sampleData)

        //assign vars for the data needed and display to console//
        var ids = sampleData.samples[0].otu_ids;
        console.log(ids)
        var sampleValues = sampleData.samples[0].sample_values.slice(0, 10).reverse();
        console.log(sampleValues)
        var labels = sampleData.samples[0].otu_labels.slice(0, 10);
        console.log(labels)

        // get the top 10 otu's and reverse order//
        var otuTop = (sampleData.samples[0].otu_ids.slice(0, 10)).reverse();

        //parse the data to get sample id//
        var otuId = otuTop.map(d => "OTU " + d);
        console.log(`OTU Ids: ${otuId}`)

        //get the top 10 labels//
        var labels = sampleData.samples[0].otu_labels.slice(0, 10);

        var trace = {
            x: sampleValues,
            y: otuId,
            text: labels,
            marker: {
                color: 'Blue'
            },
            type: "bar",
            orientation: "h",
        };

        //create data variable//
        var data = [trace];

        //set the layout for the bar chart//
        var layout = {
            margin: {
                left: 100,
                right: 100,
                top: 100,
                bottom: 30
            },
            title: "Top 10 OTU",
            yAxis: {
                tickmode: "linear"
            }

        };

        // Create the Bar chart//
        Plotly.newPlot("bar", data, layout);

        // Bubble Chart//
        var trace1 = {
            x: sampleData.samples[0].otu_ids,
            y: sampleData.samples[0].sample_values,
            mode: "markers",
            marker: {
                size: sampleData.samples[0].sample_values,
                color: sampleData.samples[0].otu_ids
            },
            text: sampleData.samples[0].otu_labels
        };

        //set the layout for the bubble plot//
        var layout2 = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        //creating the data variable//
        var data1 = [trace1];

        //create the bubble plot//
        Plotly.newPlot("bubble", data1, layout2);

    });



};


// Function to get the data//
function getDemoInfo(id) {
    //read the json file//
    d3.json("samples.json").then((data) => {
        //get the metadat info//
        var metadata = data.metadata;

        //display to console//
        console.log(metadata)

        //filter by id//
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        //select demographic panel//
        var demographicInfo = d3.select("#sample-metadata");

        //reset demographic before appending//
        demographicInfo.html("");

        //get necessary demographic info and append//
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");

        });
        //build the guage plot
        buildGauge(result.wfreq);
    });
}

// When a choice is made... //
function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
    buildGauge(id.wfreq)

}

// initial data rendering//
function init() {
    //dropdown selection//
    var dropdown = d3.select("#selDataset");
    // read the data //
    d3.json("samples.json").then((data) => {
        //show data in console//
        console.log(data)

        //get id for dropdown menu//
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        //call the functions to display plots//
        getPlots(data.names[0]);
        getDemoInfo(data.names[0]);
    });
}

//initialize the page//
init();