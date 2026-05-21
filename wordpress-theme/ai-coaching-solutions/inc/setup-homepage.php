<?php
/**
 * One-time homepage setup — runs on theme activation and admin init.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Configure site to use marketing front page; remove Sample Page from homepage.
 */
function acs_setup_marketing_homepage() {
	$sample = get_page_by_path( 'sample-page' );
	if ( $sample instanceof WP_Post ) {
		wp_trash_post( $sample->ID );
	}

	$home = get_page_by_path( 'home' );
	if ( ! $home ) {
		$home_id = wp_insert_post(
			array(
				'post_title'   => 'Home',
				'post_name'    => 'home',
				'post_status'  => 'publish',
				'post_type'    => 'page',
				'post_content' => '',
			),
			true
		);
		if ( is_wp_error( $home_id ) ) {
			return;
		}
	} else {
		$home_id = $home->ID;
	}

	update_option( 'show_on_front', 'page' );
	update_option( 'page_on_front', (int) $home_id );
	update_option( 'page_for_posts', 0 );

	/* Default "Hello world" post is confusing on marketing sites. */
	$hello = get_posts(
		array(
			'name'        => 'hello-world',
			'post_type'   => 'post',
			'post_status' => 'any',
			'numberposts' => 1,
		)
	);
	if ( ! empty( $hello[0] ) ) {
		wp_trash_post( $hello[0]->ID );
	}
}

/**
 * Redirect old sample-page URL to home.
 */
function acs_redirect_sample_page() {
	if ( is_page( 'sample-page' ) ) {
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'acs_redirect_sample_page' );
