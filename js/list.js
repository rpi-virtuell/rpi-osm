function render_rpi_map() {

    window.Locations = JSON.parse(document.getElementById('locations').innerHTML);
    console.log(Locations);

    // Initialize the map.
    var map = L.map('map').setView([51.319, 9.4949], 7);

    window.map = map;
    // Set tile layer for Open Street Map.
    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    map.addLayer(tileLayer);


    markers = render_rpi_map_marker()

    map.addLayer(markers);

}

function render_rpi_map_marker() {
    let iconOpt = {
        iconSize: [36, 36],
        iconAnchor: [36, 36],
        popupAnchor: [-18, -36],

    }
    var markers = L.markerClusterGroup();

    console.log(Locations);

    // Show marker for each location.
    Locations.forEach(function (location) {

        iconOpt.iconUrl = location.iconUrl;
        // Marker options.

        var options = {
            title: location.title,
        };

        if (iconOpt.iconUrl.length > 0) {
            options.icon = L.icon(iconOpt);

        }

        var center = L.latLng(location.lat, location.lng)
        var marker = L.marker(center, options);

        // Show name of the restaurant when click on the icon.
        marker.bindPopup('<b>' + location.title + '</b><br>' + location.address + '<hr>' + location.text).openPopup();
        markers.addLayer(marker);

    });

    return markers;
}