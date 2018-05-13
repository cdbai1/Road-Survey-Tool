/*initMap()
* initialises the google maps object
* adds click listener to the map and handles clicks
*/
function initMap() { // initialise the google.maps Map object 
    var zoom = 14; // zoom level of the map    
    var dist = 1;
    var squarePoints = null;
    var classroomLatLng = {lat: -37.911223, lng: 145.130768}; // latitude and longitude location/coordinates
    var map = new google.maps.Map(document.getElementById('map'), { // initialise a new Map object
        zoom: zoom,
        center: classroomLatLng
    });
    var activeSquare = new google.maps.Polygon({}); // square currently active on map

    // event listener for user clicking a location on the map
    // clears existing polygon
    // generates a square on the map of size user selects 
    google.maps.event.addListener(map, 'click', function(event) {        
        activeSquare.setMap(null); // clear active square polygon from map
        
        // list of points that make up the square
        var clickPoint = event.latLng; // latlng point of user click
        squarePoints = getSquarePath(clickPoint, dist*1000); // get the array of latlng for square corners
        console.log(dist);

        activeSquare = generatePolygon(squarePoints, map); // generate the square on the map and store object to clear later
    });
    
    // event listener for the size selecter being changed
    var select = document.getElementById("sizeSelect");
    select.addEventListener("change", function(){
        dist = select.options[select.selectedIndex].value;
    });

    // event listener for start button being clicked
    var button = document.getElementById("startBtn");
    button.addEventListener("click", function(){
        console.log("Button Clicked");
        if(squarePoints != null){
            generateMapURL(squarePoints);
        }        
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

    console.log(nw.lat(),nw.lng());
    console.log(ne.lat(),ne.lng());
    console.log(se.lat(),se.lng());
    console.log(sw.lat(),sw.lng());

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

    return poly; // return the polygon object
}

/* generateMapURL()
* polygonPoints - path of points around the edge of the selection
*
* returns the url for a Google Static Maps API image, containing a polygon with the dimensions provided
*/
function generateMapURL(polygonPoints){
    var URL = "https://maps.googleapis.com/maps/api/staticmap?size=500x500&style=feature:all|element:labels|visibility:off&path=weight:0|fillcolor:0x000000";
    for (var i=0; i < polygonPoints.length; i ++){
        URL = URL + "|" + polygonPoints[i].lat() + "," + polygonPoints[i].lng();
    }    
    URL += "&key=AIzaSyA9e944TTsuLO4ffAAaBA_1KR6NCHXZKW4"; // API Key
    console.log(URL);
    return URL;
}



