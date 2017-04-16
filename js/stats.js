/*
    In this file is supposed that que every node (location in map) is an object
    with at least this three atributes:
        - type -> what kind of dataset is refferred
            - 0 police
            - 1 home
            - 3 crimes
            - 4 climates
        - lat -> latitude of location node
        - lon -> longitude of location node
*/

var Rm = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
var Rk = 6373; // mean radius of the earth (km) at 39 degrees from the equator

function findDistance(locationA, locationB) {
    /*
    	This script is pretty basic, but if you use it, please let me know.  Thanks!
    	Andrew Hedges, andrew(at)hedges(dot)name
    */
	var t1, n1, t2, n2, lat1, lon1, lat2, lon2, dlat, dlon, a, c, dm, dk, mi, km;

	// get values for lat1, lon1, lat2, and lon2
	t1 = locationA.lat;
	n1 = locationA.lon;
	t2 = locationB.lat;
	n2 = locationB.lon;

	// convert coordinates to radians
	lat1 = deg2rad(t1);
	lon1 = deg2rad(n1);
	lat2 = deg2rad(t2);
	lon2 = deg2rad(n2);

	// find the differences between the coordinates
	dlat = lat2 - lat1;
	dlon = lon2 - lon1;

	// here's the heavy lifting
	a  = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2);
	c  = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); // great circle distance in radians
	dm = c * Rm; // great circle distance in miles
	dk = c * Rk; // great circle distance in km

	// round the results down to the nearest 1/1000
	mi = round(dm);
	km = round(dk);

	// display the result
    return km;
}


// convert degrees to radians
function deg2rad(deg) {
	rad = deg * Math.PI/180; // radians = degrees * pi/180
	return rad;
}

// round to the nearest 1/1000
function round(x) {
	return Math.round( x * 1000) / 1000;
}


function getNearest(center, listLocations) {
    var min = findDistance(center, listLocations[0]);
    var d;
    var ans = {
        type: listLocations[0].type,
        lat: listLocations[0].lat,
        lon: listLocations[0].lon,
        addInfo: listLocations[0].addInfo,
		dist: min,
		index: 0
    };

    for(var i = 1; i < listLocations.length; ++i) {
        d = findDistance(center, listLocations[i]);
        if(d < min) {
			min = d;
            ans = {
                type: listLocations[i].type,
				lat: listLocations[i].lat,
				lon: listLocations[i].lon,
                addInfo: listLocations[i].addInfo,
				dist: d,
				index: i
			};
		}
    }
    return ans;
}

function locationsInRadius(center, radius, avaLocations) {
    var list = [];
    var d;
    for(var i = 0; i < avaLocations.length; ++i) {
        d = findDistance(center, avaLocations[i]);
        if(d < radius)
            list.push(avaLocations[i]);
    }
    return list;
}

function singleStats(house, policeStations, climateStations, crimeList) {
    var police = getNearest(house, policeStations);
    var climate = getNearest(house, climateStations);
	var crimes = locationsInRadius(house, 2, crimeList);

	var stats = {
		nearPolice: police,
		nearClimate: climate,
		crimesList: crimes
	}
    return stats;
}

function mainStats(houseList, policeStations, climateStations, crimeList) {
    var stat = singleStats(houseList[0], policeStations, climateStations, crimeList); // init reference

    var minPolice = stat.nearPolice.dist;   	// hold actual min of distance from house to police station
	var minClimate = stat.nearClimate.dist;		// store actual min distance from house to some climate station
    var minCrimes = stat.crimesList.length; 	// hold actual min of number of crimes near to house
    var maxCrimes = 0;                      	// stores actual max of number of crimes near to house
    var housePolice = 0;                  	 	 // holds index in houseList of house that is nearest to police station
	var houseClimate = 0;						// same as house police...
    var houseCrimes = 0;                  	 	 // stores index in houseLIst of best house in crime issues
    var houseCrimesX = 0;                 		 // stores index in houseLIst of worst house in crime issues

    for(var i = 1; i < houseList.length; ++i) {
        stat = singleStats(houseList[i], policeStations, climateStations, crimeList);
        if(stat.nearPolice.dist < minPolice) {
            housePolice = i;
            minPolice = stat.nearPolice.dist;
        }
		if(stat.nearClimate.dist < minClimate) {
			houseClimate = i;
			minClimate = stat.nearClimate.dist;
		}
        if(stat.crimesList.length < minCrimes) {
            houseCrimes = i;
            minCrimes = stat.crimesList.length;
        }
        if(stat.crimesList.length > maxCrimes) {
            houseCrimesX = i;
            maxCrimes = stat.crimesList.length;
        }
    }

	var result = {
		minPolice: minPolice,
		minClimate: minClimate,
		minCrimes: minCrimes,
		maxCrimes: maxCrimes,
		housePolice: housePolice,
		houseClimate: houseClimate,
		houseCrimes: houseCrimes,
		houseCrimesX: houseCrimesX
	}
	return result;

}
