/**
 * @author      : Fatih Acet <fatih@fatihacet.com>
 * @date        : Dec 15, 2011
 * @description : An easy and quick demonstation about marker management in Google Maps.
 *                This demo creates a new map and binds click event to map.
 *                In every click event new marker appends to map. To remove the marker simply right click it.
 */

/**
 * Create new map
 */
var map;
var myOptions = {
    zoom: 7,
    center: new google.maps.LatLng(46.87916, -3.32910),
    mapTypeId: 'roadmap'
};
map = new google.maps.Map($('#map')[0], myOptions);

/**
 * Global marker object that holds all markers.
 * @type {Object.<string, google.maps.LatLng>}
 */
var markers = {};

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

/**
 * Binds click event to given map and invokes a callback that appends a new marker to clicked location.
 */
var addMarker = google.maps.event.addListener(map, 'click', function(e) {
    var lat = e.latLng.lat(); // lat of clicked point
    var lng = e.latLng.lng(); // lng of clicked point
    var markerId = getMarkerUniqueId(lat, lng); // an that will be used to cache this marker in markers object.
    var marker = new google.maps.Marker({
        position: getLatLng(lat, lng),
        map: map,
        id: 'marker_' + markerId
    });
    markers[markerId] = marker; // cache marker in markers object
    bindMarkerEvents(marker); // bind right click event to marker
});

/**
 * Binds right click event to given marker and invokes a callback function that will remove the marker from map.
 * @param {!google.maps.Marker} marker A google.maps.Marker instance that the handler will binded.
 */
var bindMarkerEvents = function(marker) {
    google.maps.event.addListener(marker, "rightclick", function (point) {
        var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng()); // get marker id by using clicked point's coordinate
        var marker = markers[markerId]; // find marker
        removeMarker(marker, markerId); // remove it
    });
};

/**
 * Removes given marker from map.
 * @param {!google.maps.Marker} marker A google.maps.Marker instance that will be removed.
 * @param {!string} markerId Id of marker.
 */
var removeMarker = function(marker, markerId) {
    marker.setMap(null); // set markers setMap to null to remove it from map
    delete markers[markerId]; // delete marker instance from markers object
};
