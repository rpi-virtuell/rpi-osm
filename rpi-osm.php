<?php

/**
 * Plugin Name:       rpi Open Street Maps
 * Plugin URI:        https://github.com/rpi-virtuell/rpi-osm
 * Description:       OSM Maps. Nutzt das Plugin Open User Maps für Locations
 * Author:            Joachim Happel
 * Version:           0.0.3
 * Domain Path:       /languages
 * Text Domain:       rpi-osm
 * Licence:           GPLv3
 * GitHub Plugin URI: https://github.com/rpi-virtuell/rpi-osm
 * GitHub Branch:     master
 */
class RPI_OSM
{
    public function __construct()
    {
        add_shortcode('rpi_location_filter', array($this, 'display_rpi_location_filter'));

        add_action('wp_enqueue_scripts', function () {

            wp_enqueue_style('leaflet', plugin_dir_url(__FILE__) . 'js/leaflet/leaflet.css');
            wp_enqueue_script('leaflet', plugin_dir_url(__FILE__) . 'js/leaflet/leaflet.js', [], false, true);
//            wp_enqueue_script('leaflet-src-esm', plugin_dir_url(__FILE__) . 'js/leaflet/leaflet-src.esm.js', [], false, true);
//            wp_enqueue_script('leaflet-src', plugin_dir_url(__FILE__) . 'js/leaflet/leaflet-src.js', [], false, true);

            //markercluster
            wp_enqueue_style('leaflet_markercluster_default', plugin_dir_url(__FILE__) . 'js/leaflet/MarkerCluster.Default.css');
            wp_enqueue_style('leaflet_markercluster', plugin_dir_url(__FILE__) . 'js/leaflet/MarkerCluster.css');

            wp_enqueue_script('leaflet-src', plugin_dir_url(__FILE__) . 'js/leaflet/leaflet.markercluster.js', [], false, true);


            wp_enqueue_script('jquery', 'https://code.jquery.com/jquery-3.6.0.min.js', [], '3.6.0');


//
//            wp_enqueue_style('leaflet_cluster_default', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css');
//            wp_enqueue_style('leaflet_cluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css');
//
//            wp_enqueue_script('leaflet_cluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', [], false, true);

            wp_enqueue_script('list', plugins_url('js/list.js', __FILE__), ['jquery', 'leaflet'], '1.0', true);

//todo used for debugging purposes

//                $locations = [];
//                $query = new WP_Query( [
//                    'post_type' => 'location',
//                ] );
//                /** Beispiel Post Meta einer Open User Map Location:
//                   $location =  get_post_meta($post->ID , '_oum_location_key', true );
//                   [
//                     'address' => 'Das CI',
//                     'lat' => 51.96604085,
//                     'lng' => 7.59554464469681,
//                     'text' => 'Inhalt',
//                     'author_name' => '',
//                     'author_email' => '',
//                   ]
//                 */
//                foreach ( $query->posts as $post ) {
//
//                    $location =  get_post_meta($post->ID , 'osm_location', true );
//                    var_dump($location);
//
//                }
//                wp_localize_script( 'list', 'Locations', $locations );

            //todo end

        });

        add_action('wp_footer', function () {
            ?>
            <script>
                document.addEventListener('facetwp-refresh', function (e, o) {
                    setTimeout(function () {
                        if (map._loaded) {
                            map.remove();

                        }
                        render_rpi_map();
                    }, 0);

                });


                var querystring = location.search;
                document.addEventListener('facetwp-loaded', function () {
                    if (location.search != querystring)
                        setTimeout(() => {
                            location.reload();
                        }, 150);
                });


            </script>
            <script>
                let circle;

                function show_proximity_on_map() {


                    const proxy_address = document.getElementById('address').value;
                    const radius = document.getElementById('radius').value;

                    if (!proxy_address) {
                        alert('Please enter an address');
                        return;
                    }
                    // Use OpenStreetMap
                    // map = L.map('map').setView([0, 0], 13);
                    //
                    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    //     maxZoom: 19,
                    // }).addTo(map);

                    jQuery.ajax({
                        url: `https://nominatim.openstreetmap.org/search`,
                        data: {
                            q: proxy_address,
                            format: 'json',
                        },
                        method: 'GET',
                        success: function (data) {
                            const {lat, lon} = data[0];
                            const proxy_location = [lat, lon];

                            if (circle) {
                                map.removeLayer(circle);
                            }


                            circle = L.circle(proxy_location, {
                                color: 'red',
                                fillColor: '#f03',
                                fillOpacity: 0.3,
                                radius: radius
                            });
                            circle.addTo(map);

                            var view_zoom = 12;

                            switch (radius) {
                                case '500':
                                    view_zoom = 15;
                                    break;
                                case '1000':
                                    view_zoom = 14;
                                    break;
                                case '5000':
                                    view_zoom = 12;
                                    break;
                                case '10000':
                                    view_zoom = 10;
                                    break;
                                default:
                                    break

                            }

                            map.setView(proxy_location, view_zoom);
                        },
                        error: function (error) {
                            console.error('Error:', error);
                            alert('Error fetching location. Please try again.');
                        },
                    });
                }

            </script>
            <?php
        }, 100);

    }

    public function display_rpi_location_filter()
    {
        ob_start();
        ?>
        <div class="rpi-location-filter">
            <?php
            echo facetwp_display('facet', 'search');
            echo facetwp_display('facet', 'age_groups');
            echo facetwp_display('facet', 'languages');
            echo facetwp_display('facet', 'continents');
            echo facetwp_display('facet', 'countries');
            echo facetwp_display('facet', 'placetypes');
            ?>
        </div>
        <?php
        return ob_get_clean();
    }
}


new RPI_OSM();
