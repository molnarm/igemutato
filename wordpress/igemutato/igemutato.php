<?php
/*
 Plugin Name: Igemutató
 Description: Felismeri az oldal szövegében a szentírási hivatkozásokat és felugró ablakba megjeleníti az idézett szöveget.
 Version: 2014.06.09.
 Author: Molnár Márton
 License: GPL
 */

new Igemutato();

class Igemutato {

	/**
	 * Key of stored settings
	 */
	const OPTION_NAME = 'igemutato_options';
	
	function __construct() {	
		// Activation
		register_activation_hook(__FILE__, array($this, 'activate'));
		// Deactivation
		register_deactivation_hook(__FILE__, array($this, 'deactivate'));
		
		// Custom JS
		add_action('wp_footer', array($this, 'wp_footer'));
		
		// Admin init
		add_action('admin_init',array($this,'admin_init'));
		// Options
		add_action('admin_menu', array($this, 'admin_menu'));
	}
	
	/**
	 * Default settings
	 */
	function get_default_settings() {
		return array(
			// fordítás
			'forditas' => 'SZIT',
			// tooltip szélesség
			'tipW'  => 300,
			// tooltip magasság
			'tipH'  => 200,
			// betűméret,
			'fontSize' => 13,
			// tooltip távolsága a szövegtől / képenyő szélétől
			'tipD'  => 5,
			// tooltip megjelenítési késleltetés
			'tipShow'  => 200,
			// tooltip elrejtési késleltetés
			'tipHide'  => 500,
			// kizárt tagek
			'excludeTags'  => "head,script,input,select,textarea,h1,h2,h3,a"			
		);
	}
	
	/**
	 * Activation
	 */
	public function activate(){
		// Add options if not already present
		$options = get_option(Igemutato::OPTION_NAME);
		if(empty($options)) {
			$options = Igemutato::get_default_settings();
			add_option(Igemutato::OPTION_NAME, $options);
		}
	}
	
	/**
	 * Deactivation
	 */
	public function deactivate(){
		// Delete option
		delete_option(Igemutato::OPTION_NAME);
	}

	/**
	 * Custom JS
	 */
	public function wp_footer() {
		global $post;
		if(!is_admin() && !empty($post)): ?>
<script>
var igemutato = {config: <?php echo json_encode(get_option(Igemutato::OPTION_NAME)); ?> },
s = document.getElementsByTagName('script')[0],
e = document.createElement('script');
e.src = 'http://molnarm.github.io/igemutato.min.js';
s.parentNode.insertBefore(e, s);
</script>
		<?php endif;
	}
	
	/**
	 * Admin JS
	 */
	public function admin_init() {
		// Add settings
		register_setting('igemutato-settings', Igemutato::OPTION_NAME, array($this, 'validate_options'));
	}

	/**
	 * Register settings page
	 */
	public function admin_menu() {
		add_options_page('Igemutató beállítások', 'Igemutató', 'manage_options', 'igemutato-options', array($this, 'admin_options'));
	}
	
	/**
	 * Display settings page
	 */
	public function admin_options() {
		require_once(dirname(__FILE__).'/settings.php');
	}

	/**
	 * Save options
	 */
	public function validate_options($options) {
		$defaults = Igemutato::get_default_settings();
		
		$options['tipW'] = (!is_numeric($options['tipW']) || $options['tipW'] < 100) ? $defaults['tipW'] : $options['tipW'];
		$options['tipH'] = (!is_numeric($options['tipH']) || $options['tipH'] < 50) ? $defaults['tipH'] : $options['tipH'];
		$options['fontSize'] = (!is_numeric($options['fontSize']) || $options['fontSize'] < 5) ? $defaults['fontSize'] : $options['fontSize'];
		$options['tipShow'] = (!is_numeric($options['tipShow']) || $options['tipShow'] < 0) ? $defaults['tipShow'] : $options['tipShow'];
		$options['tipHide'] = (!is_numeric($options['tipHide']) || $options['tipHide'] < 0) ? $defaults['tipHide'] : $options['tipHide'];
		$options['forditas'] = (!in_array($options['forditas'], array('SZIT', 'KNB', 'KG', 'UF'))) ? $defaults['forditas'] : $options['forditas'];
		$options['excludeTags'] = isset($options['excludeTags']) ? $options['excludeTags'] : $defaults['excludeTags'];

		return $options;
	}
	
}

?>