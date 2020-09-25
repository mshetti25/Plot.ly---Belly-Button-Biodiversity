function changed(Data) {

    let demo = window.rawData.metadata.find(d => d.id === Number(Data));
    changedDemo(demo);

    let graphData = window.rawData.samples.find(d => d.id === Data);


    Bar(graphData);
    Bubble(graphData);

}

function changedDemo(demo) {
    let panelBody = d3.select("#sample-metadata");
    panelBody.html("");
    Object.entries(demo).forEach(([key, value]) => {
        panelBody.append("span")
            .html(`${key} : ${value}`)
            .append("br");
    });
}

function Bar(graphData) {
    let x = graphData.sample_values.slice(0, 10).reverse();
    let y = graphData.otu_ids.map(row => `OTU ${row}`).slice(0, 10).reverse();
    let Labels = graphData.otu_labels.slice(0, 10).reverse();

    let trace = {
        type: "bar",
        x: x,
        y: y,
        text: Labels,
        orientation: 'h'
    };
    let data = [trace];
    Plotly.newPlot("bar", data, {}, { displayModeBar: false });
}

function Bubble(graphData) {
    let x = graphData.otu_ids;
    let y = graphData.sample_values;
    let Labels = graphData.otu_labels;

    let trace = {
        x: x,
        y: y,
        mode: 'markers',
        marker: {
            color: x,
            size: y,
            colorscale: "Earth"
        },
        text: Labels
    };
    let data = [trace];
    let layout = {
        title: 'Marker Size',
        showlegend: false,
        height: 600,
        width: 1200
    };
    Plotly.newPlot('bubble', data, layout);
}

function init() {
    let url = "./samples.json";
    d3.json(url).then(function (data) {
        window.rawData = data;
        let select = d3.select("#test-subject-dropdown");
        options = select.selectAll('option')
            .data(data.names)
            .enter()
            .append("option")
            .attr("value", value => value)
            .text(text => text);

        if (data.names.length > 0) {
            changed(data.names[0]);
        }
    });
}

init();