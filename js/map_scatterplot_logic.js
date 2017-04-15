

// url to datasets...
var url = [
    /*
        "police"
        linkNumber = 0
        Police_Stations.json
        JSON := {meta: object, data: array[23]}
        coordinates of station k at JSON.data[k][22]
    */
    "https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json?accessType=DOWNLOAD",
    /*
        "house"
        linkNumber = 1
        iconColor := green
        Affordable_Rental_Housing_Developments.json

    */
    "https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD",
    /*
        linkNumber = 2
        SSMMA_Median_Home_Value.json
    */
    "https://data.illinois.gov/api/views/miqf-743d/rows.json?accessType=DOWNLOAD",
    /*
        "crimes"
        linkNumber = 3
        iconColor := red
        "Crimes - 2001 to present (recent)"

    */
    "https://data.cityofchicago.org/resource/6zsd-86xi.json",
    /*
        "climateData"
        linkNumber = 4
        iconColor := yellow
        "??"
        token := yPamBBFyXheSqvqPtnIXIdrHeumciHmr
    */
    "https://www.ncdc.noaa.gov/cdo-web/api/v2/dataset",
    /*
        linkNumber = 5
        Boundaries - Police Districts (current)
    */
    "https://data.cityofchicago.org/api/views/24zt-jpfn/rows.json?accessType=DOWNLOAD",
    /*
        linkNumber = 6
        Boundaries - Police Beats (current)
    */
    "https://data.cityofchicago.org/api/views/n9it-hstw/rows.json?accessType=DOWNLOAD"
]

/*
    used to hold AJAX request. Has the following four fields
    dataArray[0] := digit that indicates to which dataset belongs the next fields
    dataArray[1] := latitude
    dataArray[2] := longitude
    dataArray[3] := filled with 0, for future use
*/
var dataArray = []; // used to hold AJAX requests

/*
    Progress bar a log box behavior
*/
function progress(percent, message) {
    document.getElementById("progressBar").setAttribute("aria-valuenow", "" + percent + "");
    document.getElementById("progressBar").setAttribute("style", "width:" + percent +"%");
    document.getElementById("progressBar").innerHTML = percent + "%";
    var curLog = document.getElementById("mainLog").innerHTML;
    curLog += "\n" + message;
    document.getElementById("mainLog").innerHTML = curLog;

}

/*
    The most code was placed in this function (drawMap) because seems that
    google put here an environment to handle its maps API
*/
// Callback function from GoogleMap API
/* ------------------------------------------------------------------------*/
function drawMap() {
    progress(50, "Drawing google maps");
    var latLngDeptComp = {lat: 41.8708, lng: -87.6505}; //    Department of Computer Science – University of Illinois coords

    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: latLngDeptComp,
        mapTypeId: 'satellite'
    });

    // Department of Computer Science marker
    var marker = new google.maps.Marker({
        position: latLngDeptComp,
        map: map,
        title: 'Chicago University',
        animation: google.maps.Animation.BOUNCE,
        icon: "icon/university2.png"
    });

    // JSON loading via ajax request
    // puts markers of coordinates specified in var url
    function putMarkersOfURL(linkNumber) {
            var response;
            var request = new XMLHttpRequest();
            request.open("GET", url[linkNumber], false);
            request.send();
            switch(linkNumber) {
                // Markers for Police_Stations.json
                case 0:
                    progress(65, "Requesting police data.");
                    response = JSON.parse(request.responseText);
                    for(var i = 0; i < response.data.length; i++) {
                        var coord = response.data[i][22]
                        var latLng = new google.maps.LatLng(coord[1], coord[2]);
                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            icon: "icon/police.png"
                        });
                        dataArray.push([0, coord[1], coord[2], 0]);
                    }
                    break;

                // Markers for Affordable_Rental_Housing_Developments.json
                case 1:
                    progress(70, "Requesting houses data.");
                    response = JSON.parse(request.responseText);
                    for(var i = 0; i < response.data.length; i++) {
                        var coordinate = new google.maps.LatLng(response.data[i][19], response.data[i][20]);
                        var marker = new google.maps.Marker({
                            position: coordinate,
                            map: map,
                            icon: "icon/house2.png"
                        });
                        marker.addListener('click', function() {
                            this.setIcon("icon/house3.png");
                            this.setAnimation(google.maps.Animation.BOUNCE);
                            var node = document.getElementById("long" + this.getPosition().lat());
                            node.setAttribute("fill", "purple");
                        });
                        dataArray.push([1, response.data[i][19], response.data[i][20], response.data[i][14]]);
                    }
                    break;

                // Markers for SSMMA_Median_Home_Value.json
                case 2:
                    break;

                // Markers for Crimes - 2001 to present (recent)
                case 3:
                    progress(80, "Requesting crime data.")
                    response = JSON.parse(request.responseText);
                    /*
                        Only are plotted dataset entries that are multiple of 3, due
                        to do a responsive app.
                    */
                    for(var i = 0; i < response.length; ++i) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(response[i].latitude, response[i].longitude),
                            map: map,
                            icon: "icon/battlefield.png",
                            opacity: 0.05
                        });
                        dataArray.push([3, response[i].latitude, response[i].longitude, 0]);
                    }
                    break;

                // Markers for climate stations
                case 4:
                    progress(90, "Requesting climate data");

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(41.8008, -87.5903),
                        map: map

                    });

                    var marker2 = new google.maps.Marker({
                        position: new google.maps.LatLng(41.6598, -87.5529),
                        map: map

                    });
                    var marker3 = new google.maps.Marker({
                        position: new google.maps.LatLng(42.0019, -87.6985),
                        map: map

                    });
                    var marker4 = new google.maps.Marker({
                        position: new google.maps.LatLng(41.9957, -87.6918),
                        map: map

                    });

                    break;
            }
    }

    /*
        Para el clima se deben hacer varias solicitudes, una por cada estación
        de interés.
        See comments in js/climateData.js to understand how were selected
        these wheater stations.
    */

    putMarkersOfURL(0);
    putMarkersOfURL(1);
    putMarkersOfURL(3);
    putMarkersOfURL(4);
    drawScatterplot(dataArray);
    progress(100, "Ready!");

};

// Remove crime markers from google maps

function removeCrimeMap() {
    console.log(document.getElementsByClassName("crime"));
}





// SCATTER PLOT lOGIC
/* -----------------------------------------------------------------------*/
// DATA REQUEST
// AJAX data request (until now I do not know how to reuse previus request
// without nest functions!)

// SCATTERPLOT RENDERING
/*
    dataset[0] := digit that indicates to which dataset belongs the next fields
    dataset[1] := latitude
    dataset[2] := longitude
    dataset[3] := > in house representes phone number
*/
function drawScatterplot(dataset) {
    // SVG canvas parameters
    var w = 700;
    var h = 600;
    var padding = 40;

    // adding SVG to DOM
    var svg = d3.select("svg")
                    .attr("width", w)
                    .attr("height", h);

    // making a scale bijection between dataset and SVG canvas size
    var xScale = d3.scaleLinear()
                    .domain([
                        d3.min(dataset, function(d) { return d[1]; }),
                        d3.max(dataset, function(d) { return d[1]; })
                    ])
                    .range([padding, w - padding*2]);

    var yScale = d3.scaleLinear()
                    .domain([
                        d3.min(dataset, function(d) { return d[2]; }),
                        d3.max(dataset, function(d) { return d[2]; })
                    ])
                    .range([h - padding, padding]);


    // divide dataset in pieces. Each piece is data about specific dataset
    var dataset0 = []; // police data
    var dataset1 = []; // house data
    var dataset2 = []; // ??
    var dataset3 = []; // crime data
    for(var i = 0; i < dataset.length; i++) {
        switch(dataset[i][0]) {
            case 0:
                dataset0.push(dataset[i]);
                break;
            case 1:
                dataset1.push(dataset[i]);
                break;
            case 2:
                dataset2.push(dataset[i]);
                break;
            case 3:
                dataset3.push(dataset[i]);
                break;
        }
    }

    // Draws police security incidence area (blue)
    d3.select("body").select("svg")
        .selectAll("circle.police")
        .data(dataset0)
        .enter()
        .append("circle")
        .attr("class", "police")
        .attr("cx", function(d){
            return xScale(d[1]);
        })
        .attr("cy", function(d){
            return yScale(d[2]);
        })
        .attr("r", function(d){
            return 50;
        })
        .attr("fill", "rgb(56, 117, 215)")
        .attr("opacity", "0.5")
        .attr("filter", "url(#blur)");

    // Draws possible house dots (green)
    d3.select("body").select("svg")
        .selectAll("circle.house")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("id", function(d) {
            return "long" + d[1];
        })
        .attr("class", "house")
        .attr("cx", function(d){
            return xScale(d[1]);
        })
        .attr("cy", function(d){
            return yScale(d[2]);
        })
        .attr("r", function(d){
            return 3;
        })
        .attr("fill", "rgb(103, 197, 71)");

    // Draws recent crimes (red dots)
    d3.select("body").select("svg")
        .selectAll("circle.crime")
        .data(dataset3)
        .enter()
        .append("circle")
        .attr("class", "crime")
        .attr("cx", function(d){
            return xScale(d[1]);
        })
        .attr("cy", function(d){
            return yScale(d[2]);
        })
        .attr("r", function(d){
            return 1;
        })
        .attr("fill", "rgb(192, 54, 57)");

    // Draw University Location
    d3.select("body").select("svg")
        .append("circle")
        .attr("id", "university")
        .attr("cx", xScale(41.8708))
        .attr("cy", yScale(-87.6505))
        .attr("r", "5")
        .attr("fill", "rgb(255, 137, 34)");

    // Adds alert with phone number to all houses!
    d3.selectAll("circle.house").on("click",function(d,i) {
        alert("Phone: " + d[3]);
    })


    // generate axis x y chart
    var xAxis = d3.axisBottom()
                    .scale(xScale)
                    .ticks(5);
    var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(5);

    // add generated axis to SVG canvas
    svg.append("g")
        .attr("transform", "translate(0, " + (h - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + padding + " 0)")
        .call(yAxis);
}
