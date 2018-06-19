/*Google map resource:
https://developers.google.com/maps/documentation/javascript/geolocation
https://developers.google.com/maps/documentation/javascript/symbols
initMap is not a function:
https://stackoverflow.com/questions/32496382/typeerror-window-initmap-is-not-a-function
W3Schools reource:
https://www.w3schools.com/graphics/google_maps_overlays.asp*/

// Initialize and add the map
var map, infoWindow, marker, myLocation, hcm;
var ncvLat = 10.8797000, ncvLong = 106.7952000;
var suLat = 10.8148859, suLong = 106.6669932;
//lat: -34.397, lng: 150.644;

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

/*    // Set radius to HCMC
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

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                /*lat: position.coords.latitude,
                lng: position.coords.longitude*/
                lat: suLat,
                lng: suLong
            };

            infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            //infoWindow.open(map);
            map.setCenter(pos);

            // Set the marker on user's location
            marker = new google.maps.Marker({
                position: pos,
                //icon: "K-icon.png"
                draggable: true,
                map: map
            });
            //marker.setMap(map);

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

        },
        function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
    // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

/*
// Draw radius on Amsterdam
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
