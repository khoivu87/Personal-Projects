/*
*Google map resources:
-> https://developers.google.com/maps/documentation/javascript/geolocation
-> https://developers.google.com/maps/documentation/javascript/symbols
-> https://developers.google.com/maps/documentation/javascript/examples/marker-remove
-> https://www.w3schools.com/graphics/google_maps_reference.asp
*W3Schools resources:
-> https://www.w3schools.com/graphics/google_maps_overlays.asp
-> https://www.w3schools.com/graphics/google_maps_events.asp
-> https://www.w3schools.com/graphics/google_maps_events.asp
*Stack Overflow:
-> https://stackoverflow.com/questions/8521766/google-maps-api-3-remove-selected-marker-only
-> https://stackoverflow.com/questions/32496382/typeerror-window-initmap-is-not-a-function
*/

// Initialize and add the map
var map, infoWindow, myMarker, myLocation, hcm;
var ncvLat = 10.879720633951425, ncvLong = 106.79515600204468;
var suLat = 10.8148859, suLong = 106.6669932;

/**
 * Global marker object that holds all markers.
 * @type {Object.<string, google.maps.LatLng>}
 */
var newMarkers = {};

/**
 * Concatenates given lat and lng with an underscore and returns it.
 * This id will be used as a key of marker to cache the marker in markers object.
 * @param {!number} lat Latitude.
 * @param {!number} lng Longitude.
 * @return {string} Concatenated marker id.
 */
var getMarkerUniqueId= function(lat, lng) {
    return lat + '_' + lng;
}

/**
 * Creates an instance of google.maps.LatLng by given lat and lng values and returns it.
 * This function can be useful for getting new coordinates quickly.
 * @param {!number} lat Latitude.
 * @param {!number} lng Longitude.
 * @return {google.maps.LatLng} An instance of google.maps.LatLng object
 */
var getLatLng = function(lat, lng) {
    return new google.maps.LatLng(lat, lng);
};

function initMap() {
/*  // The location of Uluru
  var uluru = {lat: -25.344, lng: 131.036};
  // The map, centered at Uluru
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru});
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});*/

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: ncvLat, lng: ncvLong},
        zoom: 14,
        gestureHandling: 'greedy',
        zoomControl: true,
        mapTypeId: 'terrain'

        /*1) roadmap displays the default road map view. This is the default map type.
        2) satellite displays Google Earth satellite images.
        3) hybrid displays a mixture of normal and satellite views.
        4) terrain displays a physical map based on terrain information.*/
    });

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                /*lat: position.coords.latitude,
                lng: position.coords.longitude*/
                lat: ncvLat,
                lng: ncvLong
            };
            map.setCenter(pos);

            // Set the marker on user's location
            myMarker = new google.maps.Marker({
                position: pos,
                //icon: "K-icon.png"
                draggable: true,
                map: map
            });
            //myMarker.setMap(map);

            // Set radius
            myCity = new google.maps.Circle({
                center: pos,
                radius: 600,
                strokeColor: "#0000FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#0000FF",
                fillOpacity: 0.2,
                map: map
            });

            //infoWindow.setPosition(pos);
            infoWindow.setContent('Latitude: ' + pos.lat +
                                  '<br>Longitude: ' + pos.lng);
            infoWindow.open(map, myMarker);

            // Double click on myMarker to zoom out -> level 8 and zoom back in after 10 seconds
            google.maps.event.addListener(myMarker,'dblclick',function() {
                var currentPos = map.getZoom();
                map.setZoom(8);
                map.setCenter(myMarker.getPosition());
                window.setTimeout(function() {
                        map.setZoom(currentPos);
                    },
                    10000
                );
            });

            // Right click on myMarker to remove marker and add back after 5 seconds
            google.maps.event.addListener(myMarker, 'rightclick', function() {
                myMarker.setMap(null);
                window.setTimeout(function() {
                        myMarker.setMap(map);
                    },
                    5000
                );
            });

            google.maps.event.addListener(infoWindow, 'mouseover', function() {
                infoWindow.close(map);
            });
        },

        function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
    // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // Call placeMarker() when the map is clicked
    google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(map, event.latLng);
    });
}

// Throw error if location not found
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

/**
 * Binds click event to given map and invokes a callback that appends a new marker to clicked location.
 */
function placeMarker(map, location) {
    var lat = location.lat(); // lat of clicked point
    var lng = location.lng(); // lng of clicked point
    var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
    var marker = new google.maps.Marker({
        position: getLatLng(lat, lng),
        map: map,
        id: 'marker_' + markerId
    });
    newMarkers[markerId] = marker; // push new marker in markers object
    bindMarkerEvents(marker); // bind right click event to marker

    var infoMarker = new google.maps.InfoWindow({
        content: 'Latitude: ' + location.lat() +
                 '<br>Longitude: ' + location.lng()
    });
    infoMarker.open(map,marker);

/*  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infoMarker = new google.maps.InfoWindow({
    content: 'Latitude: ' + location.lat() + '<br>Longitude: ' + location.lng()
  });
  infoMarker.open(map,marker);*/
}

/**
 * Binds right click event to given marker and invokes a callback function that will remove the marker from map.
 * @param {!google.maps.Marker} marker A google.maps.Marker instance that the handler will binded.
 */
function bindMarkerEvents(specificMarker) {
    google.maps.event.addListener(specificMarker, 'rightclick', function(point) {
        var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
        var marker = newMarkers[markerId]; // find marker
        removeMarker(marker, markerId); // remove it
    });
};

/**
 * Removes given marker from map.
 * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
 * @param {!string} markerId Id of marker.
 */
function removeMarker(marker, markerId) {
    marker.setMap(null); // set markers setMap to null to remove it from map
    delete newMarkers[markerId]; // delete marker instance from markers object
};

/*// Draw radius on Amsterdam
function myMap() {
  var amsterdam = new google.maps.LatLng(52.395715,4.888916);

  var mapCanvas = document.getElementById("map");
  var mapOptions = {center: amsterdam, zoom: 7};
  var map = new google.maps.Map(mapCanvas,mapOptions);

  var myCity = new google.maps.Circle({
    center: amsterdam,
    radius: 50000,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.4
  });
  myCity.setMap(map);
}*/

/*// Set radius to HCMC
hcm = new google.maps.LatLng(10.7546664, 106.4150394);
myLocation = new google.maps.Circle({
    center: hcm,
    radius: 50000,
    strokeColor: "#0000FF",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#0000FF",
    fillOpacity: 0.4,
    map: map
});*/
