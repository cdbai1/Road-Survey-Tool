/*
map.js
(C) Callum Baird, 2018

A script which handles the display of the embedded Google Map viewport, as well as user inputs.
Also handles creating a Google Static Maps url to pass back to the server.

Libraries used:
Google Maps API, Google 2018 - https://cloud.google.com/maps-platform/maps/
Google Static Maps, Google 2018 - https://developers.google.com/maps/documentation/maps-static/intro
Node.js, Node.js Foundation 2018 - https://nodejs.org/en/
Socket.io (via npm), Socket.io Team 2018 - https://socket.io/

*/

/*initMap()
* initialises the google maps object
* adds click listener to the map and handles clicks
*/
function initMap() { // initialise the google.maps Map object 
      
    var size = 1; // size of the user selected area
    var activeSquare = new google.maps.Polygon({}); // square currently active on map
    var squarePoints = null; // list of points that make up the square
    var clickPoint; // point where user clicks
    
    // Google Maps Object Set Up
    var zoom = 14; // initial zoom level of the map  
    var classroomLatLng = {lat: -37.911223, lng: 145.130768}; // latitude and longitude location/coordinates
    var map = new google.maps.Map(document.getElementById('map'), { // initialise a new Map object
        zoom: zoom,
        center: classroomLatLng
    });
    

    // event listener for Google Map viewport
    // handles click event
    // generates a new square on the map of the size user selects 
    google.maps.event.addListener(map, 'click', function(event) {        
        activeSquare.setMap(null); // clear active square polygon from map
        
        
        clickPoint = event.latLng; // latlng point of user click
        squarePoints = getSquarePath(clickPoint, size*1000); // get the array of latlng for square corners
        activeSquare = generatePolygon(squarePoints, map); // generate the square on the map and store object to clear later

        var lngLatText = document.getElementById("outputText2");
        lngLatText.innerHTML = "lat: " + (Math.round(clickPoint.lat()*1000)/1000) +"<br>lng: " + (Math.round(clickPoint.lng()*1000)/1000);

        var sizeText = document.getElementById("outputText3");
        sizeText.innerHTML = size + "km<sup>2</sup>";
    });
    

    // event listeners for HTML UI elements
    // when a UI element is clicked, a message is emitted to the server
    // data is also sent to the server
    var socket = io.connect('localhost:8080'); // connect to the active socket
        
    var button = document.getElementById("startBtn"); // get button from html
    button.addEventListener("click", function(){
        if(squarePoints != null){ // if there is an existing user selection
            socket.emit('btnClick',{size: size, URL: generateMapURL(squarePoints)}); // emit message, with data elements size and google static maps url
        }else{
            alert("Please enter a selection."); // let the user know to input something first
        }     
    });

    var select = document.getElementById("sizeSelect"); // get size selector from html
        select.value = 1; // set to 1 by default on load
        select.addEventListener("change", function(){ // when size is changed
            socket.emit("sizeChange", size); // emit message and size selected by user
            size = select.options[select.selectedIndex].value; // update size var
    });
};


/* getSquarePath()
* centreLngLat - centre point of the square to derive corners
* metres - number of metres each side of the square will measure
* 
* returns the path of points which enclose a square around the centreLngLat provided
*/
function getSquarePath(centreLngLat, metres) {
    if(centreLngLat.lng()<-180 || centreLngLat.lat()<-180 || centreLngLat.lng()>180 || centreLngLat.lat()>180 || metres<=0){
        return(false);
    }
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
          strokeOpacity: 0.0,
          strokeWeight: 0,
          fillColor: '#4d5bf9',
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
    // first part of url determines colour settings and hides labels
    var URL = "https://maps.googleapis.com/maps/api/staticmap?size=500x500&stle=transit|element:geometry|visibility:off&style=feature:all|element:labels|visibility:off&style=feature:all|element:geometry|color:0x000000&style=feature:road|element:geometry|visibility:simplified|color:0xffffff&path=weight:0|fillcolor:0x4d5bf9";
    for (var i=0; i < polygonPoints.length; i ++){ // for each point in the polygon
        URL = URL + "|" + polygonPoints[i].lat() + "," + polygonPoints[i].lng(); // append to the URL
    }    
    URL += "&key=AIzaSyA9e944TTsuLO4ffAAaBA_1KR6NCHXZKW4"; // API Key
    return URL;
}



