function initMap() { // initialise the Google Map object 
    var zoom = 14;
    var ourClassroom = {lat: -37.911223, lng: 145.130768}; // latitude and longitude location/coordinates
    var map = new google.maps.Map(document.getElementById('map'), { // initialise a new Map object
        zoom: zoom,
        center: ourClassroom
    });
    var marker = new google.maps.Marker({ // initialise a new marker
        position: ourClassroom,
        map: map // map object to place marker
    });

    google.maps.event.addListener(map, 'click', function(event) { // click listener
        var marker = new google.maps.Marker({ // initialise a new marker
            position: {lat: event.latLng.lat(), lng: event.latLng.lng()}, // click point long and lat
            map: map // map object to place marker
        });
    });

}
