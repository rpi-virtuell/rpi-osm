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
        add_action('wp_enqueue_scripts', function () {

            wp_enqueue_style('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', [], '1.9.4');

            wp_enqueue_style('leaflet_cluster_default', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css', [], '1.4.1');
            wp_enqueue_style('leaflet_cluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css', [], '1.4.1');

            wp_enqueue_script('leaflet', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', [], '1.9.4', true);
            wp_enqueue_script('leaflet_cluster', 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js', [], '1.4.1', true);

            wp_enqueue_script('list', plugins_url('js/list.js', __FILE__), ['jquery', 'leaflet'], '1.0', true);

//                $locations = [];
//                $query = new WP_Query( [
//                    'post_type' => 'location',
//                    'facetwp'=> true,
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
//                   ] */
//                foreach ( $query->posts as $post ) {
//
//                    $location =  get_post_meta($post->ID , 'osm_location', true );
//                    $location['title']   = $post->post_title;
//                    $location['iconUrl']= get_post_meta($post->ID , '_oum_location_image', true );
//
//                    $locations[]         = $location;
//                }
//                wp_localize_script( 'list', 'Locations', $locations );


        });


        add_action('wp_footer', function () {
            ?>
            <script>
                document.addEventListener('facetwp-loaded', function (e, o) {
                    setTimeout(function () {

                        if (map._loaded) {
                            map.remove();

                        }
                        render_rpi_map();
                        console.log('trigger');
                    }, 0);


                });
            </script>
            <?php
        }, 100);

    }
}

new RPI_OSM();
