<?php
/**
 * AI Coaching Solutions theme functions.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ACS_THEME_VERSION', '1.7.2' );
define( 'ACS_THEME_DIR', get_template_directory() );
define( 'ACS_THEME_URI', get_template_directory_uri() );

/**
 * App URLs — update these when Vercel routes are live.
 */
function acs_app_url( $path = '' ) {
	$base = defined( 'ACS_VERCEL_APP_URL' ) ? ACS_VERCEL_APP_URL : 'https://app.aicoachingsolutions.net';
	$path = ltrim( (string) $path, '/' );
	return $path ? trailingslashit( $base ) . $path : untrailingslashit( $base );
}

/**
 * Public marketing site (WordPress).
 *
 * @return string
 */
function acs_marketing_site_url() {
	return defined( 'ACS_MARKETING_SITE_URL' ) ? ACS_MARKETING_SITE_URL : 'https://www.aicoachingsolutions.net';
}

/**
 * Hero background video URL (hero-coaches.mp4 only).
 * Appends file modification time so browsers fetch a new copy after you replace the video.
 *
 * @return string
 */
function acs_hero_video_url() {
	$file = ACS_THEME_DIR . '/assets/video/hero-coaches.mp4';
	$url  = ACS_THEME_URI . '/assets/video/hero-coaches.mp4';

	if ( file_exists( $file ) ) {
		$url = add_query_arg( 'v', (string) filemtime( $file ), $url );
	}

	return $url;
}

/**
 * Whether hero-coaches.mp4 exists on disk.
 *
 * @return bool
 */
function acs_has_hero_video() {
	return file_exists( ACS_THEME_DIR . '/assets/video/hero-coaches.mp4' );
}

/**
 * Circle brand logo URL (cache-busted on file change).
 *
 * @return string
 */
function acs_logo_url() {
	$file = ACS_THEME_DIR . '/assets/images/coach-v-circle-logo.png';
	$url  = ACS_THEME_URI . '/assets/images/coach-v-circle-logo.png';

	if ( file_exists( $file ) ) {
		$url = add_query_arg( 'v', (string) filemtime( $file ), $url );
	}

	return $url;
}

/**
 * Theme image URL with cache-busting.
 *
 * @param string $filename File name inside assets/images/.
 * @return string
 */
function acs_theme_image_url( $filename ) {
	$file = ACS_THEME_DIR . '/assets/images/' . ltrim( $filename, '/' );
	$url  = ACS_THEME_URI . '/assets/images/' . ltrim( $filename, '/' );

	if ( file_exists( $file ) ) {
		$url = add_query_arg( 'v', (string) filemtime( $file ), $url );
	}

	return $url;
}

/**
 * Sport ball/equipment image for multi-sport grid (if file exists).
 *
 * @param string $slug Sport slug, e.g. golf, baseball.
 * @return string Empty when no image yet.
 */
function acs_sport_image_url( $slug ) {
	$map = array(
		'golf'       => 'ball-golf.png',
		'baseball'   => 'ball-baseball.png',
		'softball'   => 'ball-softball.png',
	);

	$candidates = array();
	if ( isset( $map[ $slug ] ) ) {
		$candidates[] = $map[ $slug ];
	}
	$candidates[] = 'ball-' . $slug . '.png';

	foreach ( array_unique( $candidates ) as $file ) {
		$path = ACS_THEME_DIR . '/assets/images/' . $file;
		if ( file_exists( $path ) ) {
			return acs_theme_image_url( $file );
		}
	}

	return '';
}

/**
 * Theme setup.
 */
function acs_theme_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'custom-logo', array(
		'height'      => 48,
		'width'       => 180,
		'flex-height' => true,
		'flex-width'  => true,
	) );

	register_nav_menus( array(
		'primary' => __( 'Primary Navigation', 'ai-coaching-solutions' ),
	) );
}
add_action( 'after_setup_theme', 'acs_theme_setup' );

/**
 * Enqueue styles and scripts.
 */
function acs_enqueue_assets() {
	wp_enqueue_style(
		'acs-fonts',
		'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
		array(),
		null
	);

	wp_enqueue_style(
		'acs-main',
		ACS_THEME_URI . '/assets/css/main.css',
		array( 'acs-fonts' ),
		ACS_THEME_VERSION
	);

	wp_enqueue_script(
		'acs-main',
		ACS_THEME_URI . '/assets/js/main.js',
		array(),
		ACS_THEME_VERSION,
		true
	);
}
add_action( 'wp_enqueue_scripts', 'acs_enqueue_assets' );

/**
 * Load section partial.
 *
 * @param string $slug Section file name without .php.
 */
function acs_section( $slug ) {
	get_template_part( 'template-parts/sections/' . $slug );
}

require_once ACS_THEME_DIR . '/inc/setup-homepage.php';

/**
 * Run homepage setup once after install or theme switch.
 */
function acs_maybe_setup_homepage() {
	if ( get_option( 'acs_homepage_configured' ) ) {
		return;
	}
	acs_setup_marketing_homepage();
	update_option( 'acs_homepage_configured', 1 );
}
add_action( 'after_switch_theme', 'acs_maybe_setup_homepage' );
