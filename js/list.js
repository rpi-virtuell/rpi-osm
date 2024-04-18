function render_rpi_map() {

    window.Locations = JSON.parse(document.getElementById('locations').innerHTML);


    // Initialize the map.

    // var map = L.map('map', {
    //     continuousWorld: false,
    //     noWrap: true
    // });

    const mittelpunkt = mittelpunktDerAdressen(window.Locations);

// Beispielaufruf mit deinem Array von Adressen
    const zoomLevel = berechneZoom(window.Locations);
    console.log(zoomLevel);

    var map = L.map('map').setView(mittelpunkt, zoomLevel);


    // var bounds = map.getBounds();
    // console.log(bounds);
//
// // Calculate the center coordinates
//     var center = Object.values(map.getCenter());
//
//
// // Set the zoom level to fit the entire bounds within the map viewport
//     var zoom = map.getBoundsZoom(bounds);
//
//
//
// // Set the map's view to the calculated center and zoom level
//     map = map.setView(center, zoom);


    window.map = map;
    // Set tile layer for Open Street Map.
    var tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    map.addLayer(tileLayer);


    markers = render_rpi_map_marker()

    map.addLayer(markers);
    mapAusrichten(window.Locations, map);


}

function mittelpunktDerAdressen(adressen) {
    // Initialisiere die Summen für Breitengrad und Längengrad
    let summeLat = 0;
    let summeLng = 0;

    // Iteriere über jede Adresse im Array
    adressen.forEach(function (adresse) {
        // Prüfe, ob die Werte gültige Zahlen sind, bevor sie zur Summe hinzugefügt werden
        if (!isNaN(parseFloat(adresse.lat))) {
            summeLat += parseFloat(adresse.lat);
        }
        if (!isNaN(parseFloat(adresse.lng))) {
            summeLng += parseFloat(adresse.lng);
        }
    });

    // Berechne den Durchschnitt für Breitengrad und Längengrad
    const durchschnittLat = summeLat / adressen.length;
    const durchschnittLng = summeLng / adressen.length;

    // Gib die Koordinaten des Mittelpunkts zurück
    return {lat: durchschnittLat, lng: durchschnittLng};
}

function haversineDistanz(lat1, lon1, lat2, lon2) {
    const erdradius = 6371; // Durchschnittlicher Erdradius in Kilometern
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = erdradius * c;
    return d;
}

// Funktion zur Berechnung des Zooms basierend auf den größten Entfernungen zwischen den Adressen
function berechneZoom(adressen) {
    let maxDistanz = 0;

    // Iteriere über jedes Paar von Adressen und finde die maximale Distanz
    for (let i = 0; i < adressen.length; i++) {
        for (let j = i + 1; j < adressen.length; j++) {
            const distanz = haversineDistanz(
                adressen[i].lat,
                adressen[i].lng,
                adressen[j].lat,
                adressen[j].lng
            );
            if (distanz > maxDistanz) {
                maxDistanz = distanz;
            }
        }
    }

    // Hier kannst du die Logik für die Zuordnung des Zoom-Levels basierend auf der maxDistanz implementieren
    // Ein einfacher Ansatz könnte sein, basierend auf der maxDistanz einen geeigneten Zoom-Level zu wählen

    return Math.floor(8 - Math.log2(maxDistanz)); // Beispiel für eine mögliche Zuordnung
}

/**
 * Map zentrieren
 */
function mapAusrichten(adressen, map) {
    // Initialisiere die Summen für Breitengrad und Längengrad
    let minLat = 100;
    let minLng = 100;
    let maxLat = -100;
    let maxLng = -100;

    // Iteriere über jede Adresse im Array und suche nach der den beiden enferntesten Locations
    adressen.forEach(function (adresse) {
        // Prüfe, ob die Werte gültige Zahlen sind, bevor sie zur Summe hinzugefügt werden
        if (!isNaN(parseFloat(adresse.lat))) {
            if (parseFloat(adresse.lat) < minLat) minLat = parseFloat(adresse.lat);
            if (parseFloat(adresse.lat) > maxLat) maxLat = parseFloat(adresse.lat);
        }
        if (!isNaN(parseFloat(adresse.lng))) {
            if (parseFloat(adresse.lng) < minLng) minLng = parseFloat(adresse.lng);
            if (parseFloat(adresse.lng) > maxLng) maxLng = parseFloat(adresse.lng);
        }
    });
    // Ecken eines Rechteck aus den beiden entferntesten Punkten definieren
    const bounds = [[minLat, minLng], [maxLat, maxLng]];

    // Rechteck in der Map zoomen
    map.fitBounds(bounds);
}


function render_rpi_map_marker() {
    let iconOpt = {
        iconSize: [36, 36],
        iconAnchor: [36, 36],
        popupAnchor: [-18, -36],

    }
    var markers = L.markerClusterGroup();


    // Show marker for each location.
    Locations.forEach(function (location) {

        if ((typeof location.iconUrl !== 'undefined')) {
            iconOpt.iconUrl = location.iconUrl;

        } else {
            iconOpt.iconUrl = '';
        }
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

        //TODO: add popup content

        marker.bindPopup('<p>' + '<a href="' + location.link + '"><b>' + location.title + '</b></a><br>' + location.address + '<hr>' + location.text + '</p>').openPopup();
        markers.addLayer(marker);

    });

    return markers;
}