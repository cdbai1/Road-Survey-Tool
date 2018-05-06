/*initMap()
* initialises the google maps object
* adds click listener to the map and handles clicks
*/
function initMap() { // initialise the google.maps Map object 
    var zoom = 14; // zoom level of the map
    var dist = 1; // distance in km one side of the square
    var ourClassroom = {lat: -37.911223, lng: 145.130768}; // latitude and longitude location/coordinates
    var map = new google.maps.Map(document.getElementById('map'), { // initialise a new Map object
        zoom: zoom,
        center: ourClassroom
    });
    var activeMarkers = []; // list of markers active on the map, used for clearing map on new selection
    var activeSquare = new google.maps.Polygon({}); // square currently active on map

    // event listener for user clicking a location on the map
    // clears existing markers and polygon
    // generates a square and places markers in each corner    
    google.maps.event.addListener(map, 'click', function(event) {
        
        activeMarkers = deleteMarkers(activeMarkers); // remove all markers and clear list
        activeSquare.setMap(null); // clear active square polygon from map

        var squarePoints = []; // list of points that make up the square
        var clickPoint = event.latLng; // latlng point of user click

        var squarePoints = getSquarePath(clickPoint, dist*1000); // get the array of latlng for square corners

        
        activeMarkers = generateMarkers(squarePoints, map); // generate the markers on the map and store object to clear later       
        activeSquare = generatePolygon(squarePoints, map); // generate the square on the map and store object to clear later
    });


};


/* getSquarePath()
* centreLngLat - centre point of the square to derive corners
* metres - number of metres each side of the square will measure
* 
* returns the path of points which enclose a square around the centreLngLat provided
*/
function getSquarePath(centreLngLat, metres) {
    // find nw corner by going west 1/2 dist and north 1/2 dist
    var nw = google.maps.geometry.spherical.computeOffset(centreLngLat, metres/2, 270);// west of centre
    nw = google.maps.geometry.spherical.computeOffset(nw, metres/2, 0); // nw of centre

    // find remaining points by going around in a circuit of the given distance
    var ne = google.maps.geometry.spherical.computeOffset(nw, metres, 90); // east of nw
    var se = google.maps.geometry.spherical.computeOffset(ne, metres, 180); // south of ne
    var sw = google.maps.geometry.spherical.computeOffset(se, metres, 270); // west of se

    return [nw, ne, se, sw]; // return the path which encloses the new square
}


/* generatePolygon()
* polygonPoints - path of points around the edge of the polygon
* map - google.maps Map object to render the polygon to
*
* returns the polygon object which has been rendered
*/
function generatePolygon(polygonPoints, map){
    var poly = new google.maps.Polygon({ // make a new square on map
          paths: polygonPoints, // using points from list argument
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#FF0000',
          fillOpacity: 0.35
        });
    poly.setMap(map); // activate on map
    return poly;
}


/* generateMarkers()
* points - list of points that will have markers created at
* map - google.maps Map object to render markers to 
*
* returns a list of the created marker objects
*/
function generateMarkers(points, map){
    var outputMarkers = [];
    for (var i = 0; i < points.length; i++) { // for each point in the square, make a marker
        var marker = new google.maps.Marker({ // initialise a new marker
            position: points[i], // at pos from list argument
            map: map // map object to render marker in
        });
        outputMarkers.push(marker);// add new marker to list of markers for clearing map later
    }
    return outputMarkers; // return list of markers created
}


/* deleteMarkers()
* markerList - a list of marker objects to be deleted
*
* returns empty list
*/
function deleteMarkers(markerList){
    for (var i = 0; i < markerList.length; i++) {
          markerList[i].setMap(null); // null hides marker from current map
    }
    return []; // return a clear list
}