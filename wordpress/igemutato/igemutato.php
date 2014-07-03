<?php
/*
 Plugin Name: Igemutató
 Description: Az oldal tartalmában található szentírási hivatkozásokat jeleníti meg felugró szövegbuborékban.
 Version: 1.0
 Author: Molnár Márton
 License: GPL
 */

new Igemutato();

class Igemutato {

	/**
	 * Key of stored settings
	 */
	const OPTION_NAME = 'igemutato_options';
	
	/**
	 * Handle of CSS file
	 */
	const STYLE_HANDLE = 'igemutato';
	
	function __construct() {	
		// Activation
		register_activation_hook(__FILE__, array($this, 'activate'));
		// Deactivation
		register_deactivation_hook(__FILE__, array($this, 'deactivate'));
		
		// Custom CSS
		add_action( 'wp_enqueue_scripts', array($this, 'enqueue_styles'));
		// Custom JS
 -		add_action('wp_footer', array($this, 'footer'));
		
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
			'fontSize' => 16,
			// tooltip távolsága a szövegtől / képenyő szélétől
			'tipD'  => 5,
			// tooltip megjelenítési késleltetés
			'tipShow'  => 200,
			// tooltip elrejtési késleltetés
			'tipHide'  => 500,
			// kizárt tagek
			'excludeTags'  => "head,script,input,select,textarea,h1,h2,h3,a",
			// szövegformázás
			'enableFormatting' => true,
			// számok
			'showNumbers' => false
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
	 * Custom CSS
	 */
	public function enqueue_styles(){
		wp_enqueue_style(Igemutato::STYLE_HANDLE, plugins_url('igemutato.min.css', __FILE__));
	}

	/**
	 * Custom JS
	 */
	public function footer() {
 		global $post;
 		if(!is_admin() && !empty($post)): ?>
<script>
var igemutato = {config: <?php echo json_encode(get_option(Igemutato::OPTION_NAME)); ?> },
s = document.getElementsByTagName('script')[0],
e = document.createElement('script');
e.id = 'igemutato-script';
e.src = '<?php echo plugins_url('igemutato.min.js', __FILE__); ?>';
s.parentNode.insertBefore(e, s);
</script>
 		<?php endif;
 	}
	
	/**
	 * Admin settings
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
	 * Validate options
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
		$options['enableFormatting'] = !empty($options['enableFormatting']);
		$options['showNumbers'] = !empty($options['showNumbers']);
	
		return $options;
	}
	
}

?>