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
function putMarkersClimate() {


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
        To avoid make this request each time that app is running, after this comment
        we provide the stations...
    */
    /*
        Make AJAX requests for each zipCode available in Chicago. Each iteration
        requests for available wheater stations per location (zipCode).
    */
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
             if(segment[0] == "2017")
                data.push(response.results[j]);
         }
         console.log(i);
    }

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
    console.log(filteredData);


    for(var i = 0; i < basicData.length; ++i) {
        console.log(basicData[i][0] + " " + basicData[i][1] + " " + basicData[i][2] + " " + basicData[i][3]);
    }



    for(var i = 0; i < intervalDate.length; i++) {
        console.log(intervalDate[i]);
    }

}


    /*
    request.open("GET",
    "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=PRECIP_15&stationid=COOP:010008&units=metric&startdate=2010-05-01&enddate=2010-05-31", false);
    request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
    request.send();
    //response = JSON.parse(request.responseText);
    */

    /*
         request.open("GET", "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:US1ILCK0014&units=standard&startdate=2017-01-01&enddate=2017-01-31", false);
         request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
         request.send();
         console.log(request.responseText);
         console.log("1--------------------------------------------------------------------------------------------");

         request.open("GET", "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:US1ILCK0082&units=standard&startdate=2017-01-01&enddate=2017-01-31", false);
         request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
         request.send();
         console.log(request.responseText);
         console.log("2--------------------------------------------------------------------------------------------")

         request.open("GET", "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:US1ILCK0094&units=standard&startdate=2017-01-01&enddate=2017-01-31", false);
         request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
         request.send();
         console.log(request.responseText);
         console.log("3--------------------------------------------------------------------------------------------")

         request.open("GET", "https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GSOM&stationid=GHCND:US1ILCK0214&units=standard&startdate=2017-01-01&enddate=2017-01-31", false);
         request.setRequestHeader("token", "yPamBBFyXheSqvqPtnIXIdrHeumciHmr");
         request.send();
         console.log(request.responseText);
         console.log("4--------------------------------------------------------------------------------------------")
    */

    /*
        // Refined this is the stations on chicago an its data coverage. I take only
        // that have support for this year.


    // taked by hand from below list this stations are the only that have updated (2017-04) data
    [ "NEXRAD:KDVN", "1995-01-09", "2017-04-13" ]
    [ "NEXRAD:KGRR", "1995-09-21", "2017-04-13" ]
    [ "GHCND:US1ILCK0014", "2007-01-01", "2017-04-12" ]
    [ "GHCND:US1ILCK0082", "2007-09-01", "2017-04-12" ]
    [ "GHCND:US1ILCK0094", "2008-03-01", "2017-04-12" ]
    [ "GHCND:US1ILCK0214", "2013-04-01", "2017-04-12" ]


    // copied from output console after run filter loop
     [ "COOP:111549", "1958-11-01", "2015-11-01" ]
     [ "COOP:116624", "2002-12-01", "2003-07-01" ]
     [ "GHCND:US1ILDP0099", "2011-04-01", "2012-04-01" ]
     [ "NEXRAD:KDVN", "1995-01-09", "2017-04-13" ]
     [ "COOP:111526", "1972-01-01", "1976-09-01" ]
     [ "COOP:111582", "1948-07-01", "1964-11-28" ]
     [ "NEXRAD:KGRR", "1995-09-21", "2017-04-13" ]
     [ "COOP:111550", "2005-06-01", "2015-11-01" ]
     [ "GHCND:US1ILCK0204", "2012-10-01", "2013-10-30" ]
     [ "COOP:111557", "1948-07-01", "1975-01-01" ]
     [ "COOP:111562", "1948-07-01", "1975-01-01" ]
     [ "GHCND:US1ILCK0010", "2007-08-01", "2010-09-16" ]
     [ "GHCND:US1ILCK0104", "2008-03-01", "2008-11-19" ]
     [ "COOP:111592", "1959-08-30", "1959-08-30" ]
     [ "GHCND:US1ILCK0014", "2007-01-01", "2017-04-12" ]
     [ "COOP:111564", "1948-07-01", "1980-07-30" ]
     [ "GHCND:US1ILCK0117", "2008-07-01", "2010-10-26" ]
     [ "COOP:111547", "1948-07-01", "1969-04-28" ]
     [ "COOP:111537", "1948-07-01", "1968-06-01" ]
     [ "COOP:111522", "1948-07-01", "1975-01-01" ]
     [ "COOP:111542", "1948-07-01", "1980-07-30" ]
     [ "GHCND:US1ILCK0082", "2007-09-01", "2017-04-12" ]
     [ "GHCND:US1ILCK0070", "2007-03-01", "2007-12-05" ]
     [ "COOP:111572", "1942-08-01", "1995-02-01" ]
     [ "COOP:111577", "1948-01-01", "2015-11-01" ]
     [ "COOP:111567", "1948-07-01", "1980-07-30" ]
     [ "COOP:111532", "1948-07-01", "1965-04-25" ]
     [ "GHCND:US1ILCK0102", "2008-04-01", "2009-08-27" ]
     [ "GHCND:US1ILCK0108", "2008-04-01", "2011-06-09" ]
     [ "GHCND:US1ILCK0094", "2008-03-01", "2017-04-12" ]
     [ "GHCND:US1ILCK0196", "2012-03-01", "2016-08-22" ]
     [ "GHCND:US1ILCK0158", "2009-11-01", "2012-07-24" ]
     [ "GHCND:US1ILCK0214", "2013-04-01", "2017-04-12" ]
     [ "GHCND:US1ILCK0238", "2014-04-01", "2016-11-29" ]
     [ "COOP:111648", "1933-11-01", "1959-05-01" ]
     */


/*
    copied from "DataSet\Wheater\ghcnd-stations.txt"
    var stationsID = [
        [US1ILCK0010  41.8798  -87.6823  181.1 IL CHICAGO 3.0 N]
        [US1ILCK0014  41.8008  -87.5903  182.9 IL CHICAGO 5.5 ESE]
        [US1ILCK0032  41.9266  -87.6562  185.9 IL CHICAGO 6.4 NNE]
        [US1ILCK0036  41.8860  -87.6210  191.1 IL CHICAGO 4.7 NE]
        [US1ILCK0055  41.9170  -87.6386  189.9 IL CHICAGO 6.0 NNE]
        [US1ILCK0097  41.9301  -87.6393  180.1 IL CHICAGO 6.8 NNE]
        [US1ILCK0117  41.9125  -87.6695  178.0 IL CHICAGO 3.0 NW]
        [US1ILCK0122  41.9272  -87.6517  187.1 IL CHICAGO 6.5 NNE]
        [US1ILCK0152  41.7018  -87.7820  181.7 IL CHICAGO RIDGE 0.2 WSW]
        [US1ILCK0179  41.9481  -87.6588  182.9 IL CHICAGO 4.8 NNW]
        [US1ILCK0204  41.8421  -87.6891  182.6 IL BOOT CAMP-CHICAGO 4.2 SW]
        [US1ILCK0240  41.9018  -87.6726  182.9 IL CHICAGO 2.7 WNW]
        [US1ILDP0028  41.8791  -88.2099  228.9 IL WEST CHICAGO 1.0 SE]
        [US1ILDP0034  41.9288  -88.2175  238.0 IL WEST CHICAGO 2.7 N]
        [USC00111497  42.1397  -87.7853  192.0 IL CHICAGO BOTANIC GARDEN]
        [USC00111522  41.6667  -87.6167  179.8 IL CHICAGO CAL TREAT WKS]
        [USC00111526  41.8833  -87.6167  182.9 IL CHICAGO GRANT PARK]
        [USC00111527  41.5000  -87.6333  192.0 IL CHICAGO HEIGHTS]
        [USC00111532  41.9667  -87.6667  198.1 IL CHICAGO LAKEVIEW PUMP]
        [USC00111537  42.0000  -87.6667  180.1 IL CHICAGO LOYOLA UNIV]
        [USC00111542  41.9667  -87.7500  198.1 IL CHICAGO MAYFAIR PUMP S]
        [USC00111547  41.9667  -87.7000  182.9 IL CHICAGO N BRA PUMP STN]
        [USC00111550  41.8558  -87.6094  177.7 IL CHICAGO NORTHERLY IS]
        [USC00111552  41.7000  -87.6333  200.9 IL CHICAGO ROSELAND PUMP]
        [USC00111557  41.8167  -87.6500  195.1 IL CHICAGO RACINE PUMP]
        [USC00111562  41.9000  -87.6333  192.0 IL CHICAGO SAN DIST OFC]
        [USC00111564  41.7500  -87.5500  185.9 IL CHICAGO S WTR FILT PLT]
        [USC00111567  41.9167  -87.7167  182.9 IL CHICAGO SPRINGFLD PUMP]
        [USC00111577  41.7372  -87.7775  189.0 IL CHICAGO MIDWAY AP 3SW]
        [USC00111584  41.8833  -87.6333  180.1 IL CHICAGO WB CITY 2]
        [USW00004808  41.7700  -88.4814  216.4 IL CHICAGO AURORA MUNI AP]
        [USW00004838  42.1208  -87.9047  193.9 IL CHICAGO PALWAUKEE AP]
        [USW00014819  41.7861  -87.7522  186.5 IL CHICAGO MIDWAY AP]
        [USW00014880  42.4167  -87.8667  221.6 IL CHICAGO WAUKEGAN RGNL AP]
        [USW00014892  41.7833  -87.6000  181.1 IL CHICAGO UNIV]
        [USW00094892  41.9144  -88.2464  229.8 IL WEST CHICAGO DUPAGE AP]
    ]

    */
