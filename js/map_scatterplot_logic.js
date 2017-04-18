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
        This url is incomplete!!! I append the left string in switch case 4
    */
    "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND",
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
    dataArray.pos(0) := digit that indicates to which dataset belongs the next fields
    dataArray.pos(1) := latitude
    dataArray.pos(2) := longitude
    dataArray.pos(3) := filled with 0, for future use

    All data must reside in the same array to compute correctly the scales to scatterplot...
*/
var dataArray = []; // used to hold AJAX requests
var dataArrayGeo = []; // used to store boundaries polygon

/*
    dataArray is splitted again in its component dataset to perfom calculations
    and drawin on scatterplot more clearly.
*/
var dataset0 = []; // police data
var dataset1 = []; // house data
var dataset2 = []; // ??
var dataset3 = []; // crime data
var dataset4 = []; // climateStations data

var selectCounter = 0;

var loadOnlineData = true;

/*
    Here are stored possible room candidates. There are selected by user.
*/
var candidates = [];


/*
    Progress bar and log box behavior
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
        mapTypeId: 'terrain'
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
            if(loadOnlineData) {
                var request = new XMLHttpRequest();
                request.open("GET", url[linkNumber], false);
                request.send();
            }
            switch(linkNumber) {
                // Markers for Police_Stations.json
                case 0:
                    progress(65, "Requesting police data.");
                    if(loadOnlineData)
                        response = JSON.parse(request.responseText);
                    else
                        response = loadOffline0();
                    for(var i = 0; i < response.data.length; i++) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(response.data[i][22][1], response.data[i][22][2]),
                            map: map,
                            icon: "icon/police.png"
                        });
                        if(!(response.data[i][22][1] === undefined))
                            dataArray.push({
                                type: 0,
                                lat: response.data[i][22][1],
                                lon: response.data[i][22][2],
                                addInfo: {}
                            });
                    }
                    break;

                // Markers for Affordable_Rental_Housing_Developments.json
                case 1:
                    progress(70, "Requesting houses data.");
                    if(loadOnlineData)
                        response = JSON.parse(request.responseText);
                    else
                        response = loadOffline1();
                    for(var i = 0; i < response.data.length; i++) {
                        if(response.data[i][19] == null)
                            continue;
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(response.data[i][19], response.data[i][20]),
                            map: map,
                            icon: "icon/house2.png"
                        });
                        marker.addListener('click', function() {
                            this.setIcon("icon/numbers/number_" + selectCounter + ".png");
                            this.setAnimation(google.maps.Animation.BOUNCE);
                            var house = findHouse("key" + this.getPosition().lat(), dataset1)
                            candidates.push(house);
                            drawOnPlot({key: "key" + this.getPosition().lat()}, "purple", "BlueViolet ", 4);
                            seeSelectedHouses();
                            selectCounter++;
                        });
                        if(!(response.data[i][19] === undefined)) {
                            var loc = {
                                type: 1,
                                lat: response.data[i][19],
                                lon: response.data[i][20],
                                pho: response.data[i][14],
                                key: "key" + response.data[i][19]
                            }
                            dataArray.push(loc);
                        }
                    }
                    break;

                // Markers for SSMMA_Median_Home_Value.json
                case 2:
                    break;

                // Markers for Crimes - 2001 to present (recent)
                case 3:
                    progress(80, "Requesting crime data.")
                    if(loadOnlineData)
                        response = JSON.parse(request.responseText);
                    else
                        response = loadOffline3();
                    /*
                        Only are plotted dataset entries that are multiple of 3, due
                        to do a responsive app.
                    */
                    for(var i = 0; i < response.length; ++i) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(response[i].latitude, response[i].longitude),
                            map: map,
                            icon: "icon/battlefield.png",
                            opacity: 0.2
                        });
                        if(!(response[i].latitude === undefined))
                            dataArray.push({
                                type: 3,
                                lat: response[i].latitude,
                                lon: response[i].longitude,
                                addInfo: {}
                            });
                    }
                    break;

                // Markers for climate stations
                case 4:
                    progress(95, "Requesting climate data");
                    var stations = getUpdatedStations();
                    if(loadOnlineData) {
                        request = new XMLHttpRequest();
                        for(var i = 0; i < stations.length; ++i) {
                            //request data for each climate station
                            request.open("GET", url[4] + "&stationid=" + stations[i][3] + "&units=standard&startdate=2017-04-10&enddate=2017-04-10", false);
                            request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
                            request.send();
                            response = JSON.parse(request.responseText);
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(stations[i][1], stations[i][2]),
                                map: map,
                                icon: "icon/radar.png"
                            });
                            dataArray.push({
                                type: 4,
                                lat: stations[i][1],
                                lon: stations[i][2],
                                addInfo: response.results
                            });
                        }
                    } else {
                        response = loadOffline4();
                        for(var i = 0; i < stations.length; ++i) {
                            var marker = new google.maps.Marker({
                                position: new google.maps.LatLng(stations[i][1], stations[i][2]),
                                map: map,
                                icon: "icon/radar.png"
                            });
                            dataArray.push({
                                type: 4,
                                lat: stations[i][1],
                                lon: stations[i][2],
                                addInfo: response[i].results
                            });
                        }
                    }
                    break;
                case 5:
                    progress(99, "Requesting district boundaries");
                    if(loadOnlineData)
                        response = JSON.parse(request.responseText);
                    else
                        response = loadOffline5();
                    for(var i = 0; i < response.data.length; ++i) {
                        dataArrayGeo.push({
                            type: 5,
                            districtNumber: response.data[i][10],
                            polygonVertex: response.data[i][8],
                            addInfo: {}
                        });
                    }
                    break;


            }
    }
    loadOnlineStatus();
    putMarkersOfURL(0);
    putMarkersOfURL(1);
    putMarkersOfURL(3);
    putMarkersOfURL(4);
    //putMarkersOfURL(5);
    drawScatterplot(dataArray);
    progress(100, "Ready!");
};

function getCoordinates(multipolygonString) {
    var coordinates = multipolygonString.split(",");
    var loc;
    var points = [];
    for(var i = 1; i < coordinates.length; i++) {
        loc = coordinates[i].split(" ");
        points.push({
            lat: loc[1],
            lon: loc[2]
        });
    }
    return points;
}

function getPolygonFomat(multipolygonString) {
    var coordinates = multipolygonString.split(",");
    var loc;
    var points = [];
    for(var i = 1; i < coordinates.length; i++) {
        loc = coordinates[i].split(" ");
        points.push({
            lat: loc[1],
            lon: loc[2]
        });
    }
    var string = "";
    for(var i = 1; i< points.length; ++i) {
        string = string.concat(points[i].lat + "," + points[i].lon + " ");
    }
    return string;
}

function seeSelectedHouses() {
    var node = document.getElementById("houseDisplay");
    var rem = document.getElementById("housesList");
    node.removeChild(rem);
    x = document.createElement("ul");
    x.setAttribute("id", "housesList");
    node.appendChild(x);
    var list = document.getElementById("housesList");
    for(var i = 0; i < candidates.length; ++i) {
        var li = document.createElement("pre");
        var house = candidates[i];
        var textLi = document.createTextNode(
            "phone: " + house.pho + "\n" +
            "latitude: " + house.lat + "\n" +
            "longitude: " + house.lon + "\n" +
            "unique id: " + house.key + "\n"
        );
        li.appendChild(textLi);
        list.appendChild(li);
    }
}

function results(houseList, policeData, climateData, crimeData) {
    // prebox that holds two main stats
    var result = mainStats(houseList, policeData, climateData, crimeData);
    var node = document.getElementById("generalStats");
    var elem = document.createElement("pre");
    elem.setAttribute("class", "alert-info");
    var text = document.createTextNode(
        "BEST SELECTED HOUSES LOCATIONS: " + "\n" + "\n" +
        "House with nearest police station is: " + result.housePolice + "\n" +
        "\tThe distance is: " + result.minPolice + "\n" +  "\n" +
        "House with minimum number of crimes is: " + result.houseCrimes + "\n" +
        "\tThe number of crimes is: " + result.minCrimes + "\n" + "\n" +
        "House with maximum number of crimes is: " + result.houseCrimesX + "\n" +
        "\t The humber of crimes is: " + result.maxCrimes + "\n"
    );
    elem.appendChild(text);
    node.appendChild(elem);

    // get near stations:
    var station1 = getNearest(houseList[result.housePolice], climateData);
    var station2 = getNearest(houseList[result.houseCrimes], climateData);

    // climate data of stations
    var climateData1 = station1.addInfo;
    var climateData2 = station2.addInfo;

    // contanating data in climateData1
    var string1 = "";
    for(var i = 0; i < climateData1.length; ++i) {
        string1 += climateData1[i].datatype + " = " + climateData1[i].value
            + "\t\tDate = " + climateData1[i].date + "\n";
    }

    // concatenating data in climateData2
    var string2 = "";
    for(var i = 0; i < climateData2.length; ++i) {
        string2 += climateData2[i].datatype + " = " + climateData2[i].value
            + "\t\tDate = " + climateData2[i].date + "\n";
    }

    // prebox that holds climate stats for house1 (best police)
    elem = document.createElement("pre");
    elem.setAttribute("class", "alert-success");
    text = document.createTextNode(
        "BEST POLICE COVERED HOUSE CLIMATE STATUS: (HOUSE" + result.housePolice + ") "
        + "\n" + "\n" + string1
    );
    elem.appendChild(text);
    node.appendChild(elem);

    // prebox that holds climate stats for house2 (best crimes)
    elem = document.createElement("pre");
    elem.setAttribute("class", "alert-success");
    text = document.createTextNode(
        "BEST MINIMAL CRIME HOUSE CLIMATE STATUS: (HOUSE" + result.houseCrimes + ") "
        + "\n" + "\n" + string2
    );
    elem.appendChild(text);
    node.appendChild(elem);

    drawOnPlot(houseList[result.housePolice], "Gold", "Olive", 4);
    drawOnPlot(houseList[result.houseCrimes], "Gold", "Olive", 4);
}

function bestOfAll(houseList, policeData, climateData, crimeData) {
    // prebox that holds two main stats
    var result = mainStats(houseList, policeData, climateData, crimeData);
    var node = document.getElementById("generalStats");
    var elem = document.createElement("pre");
    elem.setAttribute("class", "alert-danger");
    var text = document.createTextNode(
        "BEST HOUSES LOCATIONS OF ALL!: " + "\n" + "\n" +
        "House with nearest police station is: " + result.housePolice + "\n" +
        "\tThe distance is: " + result.minPolice + "\n" +  "\n" +
        "House with minimum number of crimes is: " + result.houseCrimes + "\n" +
        "\tThe number of crimes is: " + result.minCrimes + "\n" + "\n" +
        "House with maximum number of crimes is: " + result.houseCrimesX + "\n" +
        "\t The humber of crimes is: " + result.maxCrimes + "\n"
    );
    elem.appendChild(text);
    node.appendChild(elem);

    // get near stations:
    var station1 = getNearest(houseList[result.housePolice], climateData);
    var station2 = getNearest(houseList[result.houseCrimes], climateData);

    // climate data of stations
    var climateData1 = station1.addInfo;
    var climateData2 = station2.addInfo;

    // contanating data in climateData1
    var string1 = "";
    for(var i = 0; i < climateData1.length; ++i) {
        string1 += climateData1[i].datatype + " = " + climateData1[i].value
            + "\t\tDate = " + climateData1[i].date + "\n";
    }

    // concatenating data in climateData2
    var string2 = "";
    for(var i = 0; i < climateData2.length; ++i) {
        string2 += climateData2[i].datatype + " = " + climateData2[i].value
            + "\t\tDate = " + climateData2[i].date + "\n";
    }

    // prebox that holds climate stats for house1 (best police)
    elem = document.createElement("pre");
    elem.setAttribute("class", "alert-warning");
    text = document.createTextNode(
        "BEST OF ALL!" + "\n" +
        "BEST POLICE COVERED HOUSE CLIMATE STATUS: (HOUSE" + result.housePolice + ") "
        + "\n" + "\n" + string1
    );
    elem.appendChild(text);
    node.appendChild(elem);

    // prebox that holds climate stats for house2 (best crimes)
    elem = document.createElement("pre");
    elem.setAttribute("class", "alert-warning");
    text = document.createTextNode(
        "BEST OF ALL!" + "\n" +
        "BEST MINIMAL CRIME HOUSE CLIMATE STATUS: (HOUSE" + result.houseCrimes + ") "
        + "\n" + "\n" + string2
    );
    elem.appendChild(text);
    node.appendChild(elem);

    drawOnPlot(houseList[result.housePolice], "Gold", "Olive", 4);
    drawOnPlot(houseList[result.houseCrimes], "Gold", "Olive", 4);
}

function nearToUniversity(houseList, nearNumber) {
    var houses = [];
    var nearest = [];
    var university = {lat: 41.8708, lon: -87.6505};
    for(var i = 0; i < houseList.length; ++i) {
        houses.push({
            lat: houseList[i].lat,
            lon: houseList[i].lon,
            dist: findDistance(university, houseList[i]),
            pho: houseList[i].pho,
            key: houseList[i].key
        })
    }
    function compare(house1, house2) {
        if(house1.dist > house2.dist)
            return 1;
        else if(house1.dist < house2.dist)
            return -1;
        else
            return 0;
    }
    houses.sort(compare);
    for(var i = 0; i < nearNumber; ++i)
        nearest.push(houses[i]);

    // HTML display
    var node = document.getElementById("houseDisplay");
    var rem = document.getElementById("housesList");
    node.removeChild(rem);
    x = document.createElement("ul");
    x.setAttribute("id", "housesList");
    node.appendChild(x);
    var list = document.getElementById("housesList");
    for(var i = 0; i < nearest.length; ++i) {
        var li = document.createElement("pre");
        li.setAttribute("class", "alert-info");
        var house = nearest[i];
        var textLi = document.createTextNode(
            "HOUSE " + i + "\n" +
            "phone: " + house.pho + "\n" +
            "distance: " + house.dist + " kms."
        );
        li.appendChild(textLi);
        list.appendChild(li);
        drawOnPlot(house, "rgb(255," + (255 - i*6) + ",0)", "Olive", 3);
    }
}

function findHouse(key, dataset) {
    for(var i = 0; i < dataset.length; ++i) {
        if(dataset[i].key == key)
            return dataset1[i];
    }
}

function printDataArray() {
    var counter = 0;
    for(var i = 0; i < dataArray.length; ++i) {
        if(dataArray[i][1] === undefined)
            counter++;
        console.log(dataArray[i]);
    }
    console.log("undefined elements: " + counter);
}

// divide dataset in pieces. Each piece is data about specific dataset
function divideDatasets(dataset) {
    for(var i = 0; i < dataset.length; i++) {
        switch(dataset[i].type) {
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
            case 4:
                dataset4.push(dataset[i]);
                break;
        }
    }
}

function drawOnPlot(location, fillColor, strokeColor, radius) {
    var dot = document.getElementById(location.key);
    dot.setAttribute("fill", fillColor);
    dot.setAttribute("stroke", strokeColor);
    dot.setAttribute("r", radius);
}

function clearAll() {
    // removes svg, if not so, the next call overdraw scatterplot
    /*
    var node = document.getElementById("plot");
    var rem = document.getElementById("scatterplot");
    node.removeChild(rem);
    drawMap();
    */
    location.reload();
}

/*
    See if check box is checked. If so, load data present in offlinedata.js.
    The real offline load is make insde putMarkersOfURL function.
*/
function loadOnlineStatus() {
    var x = document.getElementById("boolOffline");
    if(x.checked)
        loadOnlineData = false;
    else
        loadOnlineData = true;
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

     divideDatasets(dataset);

    // adding SVG to DOM
    var svg = d3.select("svg")
                    .attr("width", w)
                    .attr("height", h);

    // making a scale bijection between dataset and SVG canvas size
    var xScale = d3.scaleLinear()
                    .domain([
                        d3.min(dataset, function(d) { return d.lat; }),
                        d3.max(dataset, function(d) { return d.lat; })
                    ])
                    .range([padding, w - padding*2]);

    var yScale = d3.scaleLinear()
                    .domain([
                        d3.min(dataset, function(d) { return d.lon; }),
                        d3.max(dataset, function(d) { return d.lon; })
                    ])
                    .range([h - padding, padding]);

    //------------------------------------------------------------------------
    //var poly = getPolygonFomat(dataArrayGeo[0].polygonVertex);
    /*
    var poly = [{lat: "-88.0", lon: "41.7"},
                {lat: "-87.6", lon: "41.9"},
                {lat: "-88.0", lon: "42.0"}];

    d3.select("body").select("svg")
                        .selectAll("polyline")
                        .data(poly)
                        .enter()
                        .append("polyline")
                        .attr("points",function(d) {
                                return d.map(function(d) {
                                    return [xScale(d.lat), yScale(d.lon)].join(",");
                                }).join(" ");
                            })
                        .attr("style","fill:none;stroke:black;stroke-width:3");
    */
    //------------------------------------------------------------------------

    // Draws police security incidence area (blue)
    d3.select("body").select("svg")
        .selectAll("circle")
        .data(dataset0)
        .enter()
        .append("circle")
        .attr("class", "police")
        .attr("cx", function(d){
            return xScale(d.lat);
        })
        .attr("cy", function(d){
            return yScale(d.lon);
        })
        .attr("r", function(d){
            return 50;
        })
        .attr("fill", "rgb(56, 117, 215)")
        .attr("opacity", "0.4")
        .attr("filter", "url(#blur)");

    // Draws possible house dots (green)
    d3.select("body").select("svg")
        .selectAll("circle.house")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("id", function(d) {
            return "key" + d.lat;
        })
        .attr("class", "house")
        .attr("cx", function(d){
            return xScale(d.lat);
        })
        .attr("cy", function(d){
            return yScale(d.lon);
        })
        .attr("r", function(d){
            return 2;
        })
        .attr("fill", "rgb(103, 197, 71)")
        .attr("stroke", "green")
        .attr("stronke-width", "1");

    // Draws recent crimes (red dots)
    d3.select("body").select("svg")
        .selectAll("circle.crime")
        .data(dataset3)
        .enter()
        .append("circle")
        .attr("class", "crime")
        .attr("cx", function(d){
            return xScale(d.lat);
        })
        .attr("cy", function(d){
            return yScale(d.lon);
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
        .attr("stroke", "brown")
        .attr("stronke-width", "1")
        .attr("fill", "rgb(255, 137, 34)");

    // Adds alert with phone number to all houses!
    d3.selectAll("circle.house").on("click",function(d,i) {
        alert("Phone: " + d.pho + "\n"
                + "Internal id: " + d.key + "\n" + "\n"
                + "For information on rents, income requirements and availability, " + "\n"
                + "contact each property directly. For information on other affordable " + "\n"
                + "rental properties in Chicago and Illinois, call (877) 428-8844, " + "\n"
                + "or visit www.ILHousingSearch.org. "
            );

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
