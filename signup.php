<?php
/*
Plugin Name: Smoke Mailing List
Plugin URI: https://github.com/jhackett1/smoke-mailing-list
Description: Displays a pretty sign-up box for the mailing list, which can be added via the [smoke-signup] shortcode.
Author: Joshua Hackett
Author URI: http://joshuahackett.com
Version: 1.0.0
*/

function show_signup(){
  // Get plugin CSS
  wp_enqueue_style('yuhh', plugin_dir_url( __FILE__ ) . 'css/style.css');
  // Get script
  wp_enqueue_script('app', plugin_dir_url( __FILE__ ) . 'app.js');
  // Lastly, include the markup template
  ob_start();
  $template = include 'signup-template.php';
  return ob_get_clean();
};

// Register the shortcode
add_shortcode('smoke-signup', 'show_signup');

// Add a new button to the post editor
function smoke_quicktags() {
  ?>
  <script type="text/javascript" charset="utf-8">
  QTags.addButton( 'smoke_signup', 'signup','[smoke-signup]');
  </script>
  <?php
}
add_action('admin_print_footer_scripts','smoke_quicktags');
