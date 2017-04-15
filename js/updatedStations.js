// Illinois ID = FIPS:17 ---> Cook county = 17031 ----> Chicago zipcodes = see zipCodes[]
/*
    This script requests to NOAA CDO (National Centers for Environmental Information -
    Climate Data Online) for available wheater stations for each of available
    zip codes of chicago.
    There are 62 zip codes for chicago, each one for each sub zone. An in average
    there are 10 stations por zip code zone, resulting in 620 wheather stations.
    So I took the first station in each zip zone, to minimize this log information.
    The zip code were taken from:
        http://www.city-data.com/zipmaps/Chicago-Illinois.html
    That are the same incountered in
        https://catalog.data.gov/dataset/boundaries-zip-codes
*/
function getUpdatedStations() {


    var zipCodes = [ 60007, 60018, 60068, 60106, 60131,
                     60176, 60601, 60602, 60603, 60604,
                     60605, 60606, 60607, 60608, 60609,
                     60610, 60611, 60612, 60613, 60614,
                     60615, 60616, 60617, 60618, 60619,
                     60620, 60621, 60622, 60623, 60624,
                     60625, 60626, 60628, 60629, 60630,
                     60631, 60632, 60633, 60634, 60636,
                     60637, 60638, 60639, 60640, 60641,
                     60642, 60643, 60644, 60645, 60646,
                     60647, 60649, 60651, 60652, 60653,
                     60654, 60655, 60656, 60657, 60659,
                     60660, 60661, 60706, 60707, 60714,
                     60804, 60827 ];

    var request = new XMLHttpRequest();
    var data = []; // holds all parsed data obtained from request
    var filteredData = []; // holds data without repeated stations

    var basicData = []; // 4 fields: datasetID = 4, latitude, longitude, stationID
    var intervalDate = []; // 3 fields: stationID, mindate, maxdate
    var response;

    /*
        Make AJAX requests for each zipCode available in Chicago. Each iteration
        requests for available wheater stations per location (zipCode).
    */

// THIS CODE WAS COMMENT DUE TO HIGH EXHAUSTIVE AND LONG REQUEST MADE TO NOAA CDO SERVER
// THE RESULTS OF THIS REQUESTS ARE PROVIDE AT THE END OF THIS FILE, WHERE ALSO IS
// EXPLAINED THE TREATMENT OF DATA...
// SEE WHERE IS FROM DATA, UNCOMENT THE CODE...
/*
    for(var i = 0; i < zipCodes.length; ++i) {
         request.open("GET", "https://www.ncdc.noaa.gov/cdo-web/api/v2/stations?locationid=ZIP:" + zipCodes[i], false);
         request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
         request.send();
         response = JSON.parse(request.responseText);
         // Only first station for each zip code is pushed
         console.log(response.results);
         for(var j = 0; j < response.results.length; ++j)
         {
             var segment = response.results[j].maxdate.split("-");
             // only add recent data
             if(segment[0] == "2017")
                data.push(response.results[j]);
         }
         console.log(i);
    }

    console.log(">> only recent data ----------------------------------------------------------------");
    console.log(data);

    // There are stations that are repeated. This program bring out duplicates.
    filteredData.push(data[0]);
    for(var i = 1; i < data.length; ++i) {
        var passedAll = false;
        var breaked = false;
        for(var j = 0; j < filteredData.length; ++j) {
            if(j == filteredData.length-1)
                passedAll = true;
            if(data[i].id == filteredData[j].id) {
                breaked = true;
                break;
            }
        }
        if(passedAll && !breaked) {
            filteredData.push(data[i]);
            basicData.push([4, data[i].latitude, data[i].longitude, data[i].id]);
            intervalDate.push([data[i].id, data[i].mindate, data[i].maxdate]);
        }

    }
    console.log(">> Filtered data (no duplicates)----------------------------------------------------");
    console.log(filteredData);

    console.log(">> Basic data ----------------------------------------------------------------------");
    for(var i = 0; i < basicData.length; ++i) {
        console.log(basicData[i]);
    }

    console.log(">> Interval data -------------------------------------------------------------------");
    for(var i = 0; i < intervalDate.length; i++) {
        console.log(intervalDate[i]);
    }
    */
    return [
                [ 4, 41.9953, -88.0527, "GHCND:US1ILCK0075" ],
                [ 4, 41.995, -87.9336, "GHCND:USW00094846" ],
                [ 4, 42.0044, -87.846, "GHCND:US1ILCK0180" ],
                [ 4, 42.0168, -87.8557, "GHCND:US1ILCK0192" ],
                [ 4, 41.886, -87.621, "GHCND:US1ILCK0036" ],
                [ 4, 41.8558, -87.6094, "GHCND:USC00111550" ],
                [ 4, 41.9481, -87.6588, "GHCND:US1ILCK0179" ],
                [ 4, 41.9266, -87.6562, "GHCND:US1ILCK0032" ],
                [ 4, 41.8008, -87.5903, "GHCND:US1ILCK0014" ],
                [ 4, 41.9642, -87.6974, "GHCND:US1ILCK0168" ],
                [ 4, 42.0043, -87.6697, "GHCND:US1ILCK0232" ],
                [ 4, 41.6598, -87.5529, "GHCND:US1ILCK0082" ],
                [ 4, 41.7372, -87.7775, "GHCND:USC00111577" ],
                [ 4, 41.78611, -87.75222, "GHCND:USW00014819" ],
                [ 4, 42.0019, -87.6985, "GHCND:US1ILCK0094" ],
                [ 4, 41.9957, -87.6918, "GHCND:US1ILCK0214" ],
                [ 4, 41.9177, -87.8037, "GHCND:US1ILCK0243" ],
                [ 4, 41.8231, -87.7666, "GHCND:US1ILCK0100" ]
            ];
}

    /*
        // This was copied from console log after run previous filter loops. This
        // Array is intervalDate

        Array [ "GHCND:US1ILCK0075", "2007-05-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "NEXRAD:KDVN", "1995-01-09", "2017-04-14" ]  climateData.js:99:9
        Array [ "NEXRAD:KGRR", "1995-09-21", "2017-04-14" ]  climateData.js:99:9
        Array [ "NEXRAD:KIWX", "1997-12-09", "2017-04-14" ]  climateData.js:99:9
        Array [ "NEXRAD:KLOT", "1995-04-13", "2017-04-14" ]  climateData.js:99:9
        Array [ "NEXRAD:KMKX", "1995-04-27", "2017-04-14" ]  climateData.js:99:9
        Array [ "GHCND:USW00094846", "1946-10-09", "2017-04-12" ]  climateData.js:99:9
        Array [ "WBAN:94846", "1946-10-01", "2017-04-14" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0180", "2011-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0192", "2011-08-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "NEXRAD:KILX", "1995-08-09", "2017-04-14" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0036", "2007-03-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:USC00111550", "2005-06-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0179", "2011-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0032", "2007-03-01", "2017-04-10" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0014", "2007-01-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0168", "2010-08-01", "2017-04-06" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0232", "2014-03-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0082", "2007-09-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:USC00111577", "1928-02-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:USW00014819", "1997-05-01", "2017-04-10" ]  climateData.js:99:9
        Array [ "WBAN:14819", "1948-01-01", "2017-04-14" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0094", "2008-03-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0214", "2013-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0243", "2014-08-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0100", "2008-05-01", "2017-02-26" ]  climateData.js:99:9

        // I only take those that have GHCND dataset

        Array [ "GHCND:US1ILCK0075", "2007-05-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:USW00094846", "1946-10-09", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0180", "2011-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0192", "2011-08-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0036", "2007-03-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:USC00111550", "2005-06-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0179", "2011-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0032", "2007-03-01", "2017-04-10" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0014", "2007-01-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0168", "2010-08-01", "2017-04-06" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0232", "2014-03-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0082", "2007-09-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:USC00111577", "1928-02-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:USW00014819", "1997-05-01", "2017-04-10" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0094", "2008-03-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0214", "2013-04-01", "2017-04-12" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0243", "2014-08-01", "2017-04-11" ]  climateData.js:99:9
        Array [ "GHCND:US1ILCK0100", "2008-05-01", "2017-02-26" ]  climateData.js:99:9
    */

    /*
        // The same treatment was do with basicData...

        Array [ 4, 41.9953, -88.0527, "GHCND:US1ILCK0075" ]  updatedStations.js:95:9
        Array [ 4, 41.61167, -90.58083, "NEXRAD:KDVN" ]  updatedStations.js:95:9
        Array [ 4, 42.89389, -85.54472, "NEXRAD:KGRR" ]  updatedStations.js:95:9
        Array [ 4, 41.40861, -85.7, "NEXRAD:KIWX" ]  updatedStations.js:95:9
        Array [ 4, 41.60444, -88.08472, "NEXRAD:KLOT" ]  updatedStations.js:95:9
        Array [ 4, 42.96778, -88.55056, "NEXRAD:KMKX" ]  updatedStations.js:95:9
        Array [ 4, 41.995, -87.9336, "GHCND:USW00094846" ]  updatedStations.js:95:9
        Array [ 4, 41.995, -87.9336, "WBAN:94846" ]  updatedStations.js:95:9
        Array [ 4, 42.0044, -87.846, "GHCND:US1ILCK0180" ]  updatedStations.js:95:9
        Array [ 4, 42.0168, -87.8557, "GHCND:US1ILCK0192" ]  updatedStations.js:95:9
        Array [ 4, 40.15056, -89.33667, "NEXRAD:KILX" ]  updatedStations.js:95:9
        Array [ 4, 41.886, -87.621, "GHCND:US1ILCK0036" ]  updatedStations.js:95:9
        Array [ 4, 41.8558, -87.6094, "GHCND:USC00111550" ]  updatedStations.js:95:9
        Array [ 4, 41.9481, -87.6588, "GHCND:US1ILCK0179" ]  updatedStations.js:95:9
        Array [ 4, 41.9266, -87.6562, "GHCND:US1ILCK0032" ]  updatedStations.js:95:9
        Array [ 4, 41.8008, -87.5903, "GHCND:US1ILCK0014" ]  updatedStations.js:95:9
        Array [ 4, 41.9642, -87.6974, "GHCND:US1ILCK0168" ]  updatedStations.js:95:9
        Array [ 4, 42.0043, -87.6697, "GHCND:US1ILCK0232" ]  updatedStations.js:95:9
        Array [ 4, 41.6598, -87.5529, "GHCND:US1ILCK0082" ]  updatedStations.js:95:9
        Array [ 4, 41.7372, -87.7775, "GHCND:USC00111577" ]  updatedStations.js:95:9
        Array [ 4, 41.78611, -87.75222, "GHCND:USW00014819" ]  updatedStations.js:95:9
        Array [ 4, 41.78611, -87.75222, "WBAN:14819" ]  updatedStations.js:95:9
        Array [ 4, 42.0019, -87.6985, "GHCND:US1ILCK0094" ]  updatedStations.js:95:9
        Array [ 4, 41.9957, -87.6918, "GHCND:US1ILCK0214" ]  updatedStations.js:95:9
        Array [ 4, 41.9177, -87.8037, "GHCND:US1ILCK0243" ]  updatedStations.js:95:9
        Array [ 4, 41.8231, -87.7666, "GHCND:US1ILCK0100" ]  updatedStations.js:95:9

        // Only took those that are GHCND

        Array [ 4, 41.9953, -88.0527, "GHCND:US1ILCK0075" ]  updatedStations.js:95:9
        Array [ 4, 41.995, -87.9336, "GHCND:USW00094846" ]  updatedStations.js:95:9
        Array [ 4, 42.0044, -87.846, "GHCND:US1ILCK0180" ]  updatedStations.js:95:9
        Array [ 4, 42.0168, -87.8557, "GHCND:US1ILCK0192" ]  updatedStations.js:95:9
        Array [ 4, 41.886, -87.621, "GHCND:US1ILCK0036" ]  updatedStations.js:95:9
        Array [ 4, 41.8558, -87.6094, "GHCND:USC00111550" ]  updatedStations.js:95:9
        Array [ 4, 41.9481, -87.6588, "GHCND:US1ILCK0179" ]  updatedStations.js:95:9
        Array [ 4, 41.9266, -87.6562, "GHCND:US1ILCK0032" ]  updatedStations.js:95:9
        Array [ 4, 41.8008, -87.5903, "GHCND:US1ILCK0014" ]  updatedStations.js:95:9
        Array [ 4, 41.9642, -87.6974, "GHCND:US1ILCK0168" ]  updatedStations.js:95:9
        Array [ 4, 42.0043, -87.6697, "GHCND:US1ILCK0232" ]  updatedStations.js:95:9
        Array [ 4, 41.6598, -87.5529, "GHCND:US1ILCK0082" ]  updatedStations.js:95:9
        Array [ 4, 41.7372, -87.7775, "GHCND:USC00111577" ]  updatedStations.js:95:9
        Array [ 4, 41.78611, -87.75222, "GHCND:USW00014819" ]  updatedStations.js:95:9
        Array [ 4, 42.0019, -87.6985, "GHCND:US1ILCK0094" ]  updatedStations.js:95:9
        Array [ 4, 41.9957, -87.6918, "GHCND:US1ILCK0214" ]  updatedStations.js:95:9
        Array [ 4, 41.9177, -87.8037, "GHCND:US1ILCK0243" ]  updatedStations.js:95:9
        Array [ 4, 41.8231, -87.7666, "GHCND:US1ILCK0100" ]  updatedStations.js:95:9

        // Some strings were removed... to do the areay by hand...
        [
            [ 4, 41.9953, -88.0527, "GHCND:US1ILCK0075" ],
            [ 4, 41.995, -87.9336, "GHCND:USW00094846" ],
            [ 4, 42.0044, -87.846, "GHCND:US1ILCK0180" ],
            [ 4, 42.0168, -87.8557, "GHCND:US1ILCK0192" ],
            [ 4, 41.886, -87.621, "GHCND:US1ILCK0036" ],
            [ 4, 41.8558, -87.6094, "GHCND:USC00111550" ],
            [ 4, 41.9481, -87.6588, "GHCND:US1ILCK0179" ],
            [ 4, 41.9266, -87.6562, "GHCND:US1ILCK0032" ],
            [ 4, 41.8008, -87.5903, "GHCND:US1ILCK0014" ],
            [ 4, 41.9642, -87.6974, "GHCND:US1ILCK0168" ],
            [ 4, 42.0043, -87.6697, "GHCND:US1ILCK0232" ],
            [ 4, 41.6598, -87.5529, "GHCND:US1ILCK0082" ],
            [ 4, 41.7372, -87.7775, "GHCND:USC00111577" ],
            [ 4, 41.78611, -87.75222, "GHCND:USW00014819" ],
            [ 4, 42.0019, -87.6985, "GHCND:US1ILCK0094" ],
            [ 4, 41.9957, -87.6918, "GHCND:US1ILCK0214" ],
            [ 4, 41.9177, -87.8037, "GHCND:US1ILCK0243" ],
            [ 4, 41.8231, -87.7666, "GHCND:US1ILCK0100" ]
        ]
*/
