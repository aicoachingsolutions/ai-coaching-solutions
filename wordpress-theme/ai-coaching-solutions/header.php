<?php
/**
 * Site header.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
	<div class="site-header__inner container">
		<div class="site-logo">
			<?php if ( has_custom_logo() ) : ?>
				<?php the_custom_logo(); ?>
			<?php else : ?>
				<?php get_template_part( 'template-parts/brand-logo', null, array( 'context' => 'header' ) ); ?>
			<?php endif; ?>
		</div>

		<button
			class="nav-toggle"
			type="button"
			aria-expanded="false"
			aria-controls="primary-nav"
			aria-label="<?php esc_attr_e( 'Toggle navigation menu', 'ai-coaching-solutions' ); ?>"
		>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
			<span class="nav-toggle__bar"></span>
		</button>

		<nav class="primary-nav" id="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'ai-coaching-solutions' ); ?>">
			<ul class="primary-nav__list">
				<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#tools"><?php esc_html_e( 'Coaching Tools', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#practice-planner"><?php esc_html_e( 'Practice Planner', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#free-analyzer"><?php esc_html_e( 'Free Analyzer', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#break90"><?php esc_html_e( 'Break90 Golf', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#pricing"><?php esc_html_e( 'Pricing', 'ai-coaching-solutions' ); ?></a></li>
			</ul>
			<a class="btn btn--login" href="<?php echo esc_url( acs_app_url( 'login' ) ); ?>"><?php esc_html_e( 'Login', 'ai-coaching-solutions' ); ?></a>
		</nav>
	</div>
</header>

<main id="main-content" class="site-main">
