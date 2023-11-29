( function( document, Locations, L ) {
    // Set map center = first restaurant location.
    var center = L.latLng( Locations[0].latitude, Locations[0].longitude );

    console.log('center', center);

    // Map options.
    var options = {
        center: center,
        zoom: 5
    };

    // Initialize the map.
    var map = L.map('map').setView([51.319, 9.4949], 7);

    // Set tile layer for Open Street Map.
    var tileLayer = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    } );
    map.addLayer( tileLayer );

    var markers = L.markerClusterGroup();

    // Show marker for each location.
    Locations.forEach( function( location ) {
        // Marker options.
        var options = {
            title: location.title,
            /*
            icon: L.icon( {
                iconUrl: location.icon
            } )
            */
        };
        var center = L.latLng( location.lat, location.lng )
        var marker = L.marker( center, options );

        // Show name of the restaurant when click on the icon.
        marker.bindPopup( '<b>' + location.title + '</b><br>' + location.address ).openPopup();
        markers.addLayer(marker);
    } );
    map.addLayer(markers);

} )( document, Locations, L );
