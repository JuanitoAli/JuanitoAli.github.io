1. App name: Room Finder :: https://juanitoali.github.io/
2. Keywords: security, simple, price
3. Description of datasets and function design:

	Police Stations (referred in code as "dataset0")
		> https://data.cityofchicago.org/api/views/z8bn-74gv/rows.json?accessType=DOWNLOAD
		> format: JSON
		> columns used: longitude, latitude
		> data amount: 25 rows

	Affordable Rental Housing Developments (referred in code as "dataset1")
		> https://data.cityofchicago.org/api/views/s6ha-ppgi/rows.json?accessType=DOWNLOAD
		> format: JSON
		> columns used: latitude, longitude, phone number
		> data amount: 264 rows

	Crimes - 2001 to present (recent) (reffered in code as "dataset3")
		> https://data.cityofchicago.org/resource/6zsd-86xi.json
		> format: JSON
		> columns used: latitude, longitude
		> data amount: 1000 rows

	Cliate Data from National Oceanic and Atmospheric Information (ref as "dataset4")
	token := yPamBBFyXheSqvqPtnIXIdrHeumciHmr
		> https://www.ncdc.noaa.gov/cdo-web/api/v2/data?datasetid=GHCND
		> colums used: latitude, longitude
		> data amount: climate data available for automated selected 18 stations

4. Brief Description:
	The principal aim of this project is make easy to foreign people in
	Chicago find the closest room or place to live that it is near to
	Computer Science Department of Chicago's University, not only based
	in the price but too in other parameters related to security as police coverage
	and number of crimes near.
	The app in principle display all best priced houses, this because the dataset
	used only contains "affordable rental houses".
	The principal objective behind this, is that the application outputs
	the essential information and do not overflow the user that leads
	in the same problem. The secondary objective is deploy de
	application in a way that can be easily extrapolated to another
	cities around the world.

	* Map View:
		1. No, the map when is displayed has as center the Computer Science Departament
		   of University of Illinois.
		2. No, for the development of application (and its easiness)
		   I do not consider the markets location.
		3. No, as I do not use markets, I do not need of market
		   labels.
		4. No, the same as above.
		5. No.
		Markers and additional effects over map are removed due to make better easiness
		of applications

	* Data Visualization:
		1. Yes, a scatterplot is used. The intend of scatterplot is provide and
		   overview of all possible house options (green dots), this because google map
		   is saturated of many visual elements (markers, streets, houses and so forth)
		   and some potential houses in the city may be leave. Also the scatterplot offer
		   a nice security overview, displaying a modest coverage area (blue blurred
		   circles) and crimes (red dots).

		2. Yes, click on a house retrieves contact data.

	* Interaction Form:
		- Information output:
			> Currently selected houses.
			> Best two options.
			> Climate data about these best two options.

		- Filters:
			> In a selection, closest house to a police station.
			> In a selection, house with smaller number of crimes near.
			> Get stations with updated data (1 week).

		- Information input:
			> Select houses in map.
			> Check to work with offline data.
			> Button to get best options.

		- Interaction with map:
			> Yes, select wanted houses.

		- Interaction with data visualization.
			> No.

5. The app was developed only with HTML, CSS and JavaScript.

6. Works in:
		- Mozilla Firefox
		- Google Chrome
	Do no Works in:
		- Internet Explorer

7. Nothing.
