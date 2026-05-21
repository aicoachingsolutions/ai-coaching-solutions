<?php
/**
 * Marketing homepage template.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

acs_section( 'site-announcement' );
acs_section( 'hero' );
acs_section( 'trust-bar' );
acs_section( 'platform-overview' );
acs_section( 'practice-planner' );
acs_section( 'swing-analyzer' );
acs_section( 'break90' );
acs_section( 'multi-sport' );
acs_section( 'why-coaches' );
acs_section( 'ecosystem' );
acs_section( 'final-cta' );

get_footer();
