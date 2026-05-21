<?php
/**
 * Break90 Golf feature section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$break90_url = acs_app_url( 'break90' );
$break90_logo = acs_theme_image_url( 'break90-logo.png' );
?>

<section class="section feature-block feature-block--break90" id="break90" aria-labelledby="break90-title">
	<div class="container feature-block__inner">
		<div class="feature-block__content">
			<span class="section__label"><?php esc_html_e( 'Athlete golf tool', 'ai-coaching-solutions' ); ?></span>
			<h2 class="section__title" id="break90-title">
				<?php esc_html_e( 'Break90 Golf: Your AI Golf Coach', 'ai-coaching-solutions' ); ?>
			</h2>
			<p class="section__body">
				<?php esc_html_e( 'Break90 coaches you through improvement — helping you spot scoring leaks, focus practice, and move closer to breaking 90 with guidance built around your game.', 'ai-coaching-solutions' ); ?>
			</p>
			<ul class="feature-list">
				<li><?php esc_html_e( 'Pinpoint what is costing you strokes', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( 'AI-guided priorities for your next practice', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( 'Clear coaching feedback you can act on between rounds', 'ai-coaching-solutions' ); ?></li>
			</ul>
			<?php
			get_template_part(
				'template-parts/mvp-callout',
				null,
				array(
					'product'  => __( 'Break90 Golf', 'ai-coaching-solutions' ),
					'url'      => $break90_url,
					'audience' => 'golfers',
				)
			);
			?>
			<a class="btn btn--secondary feature-block__cta-secondary" href="<?php echo esc_url( $break90_url ); ?>">
				<?php esc_html_e( 'Explore Break90', 'ai-coaching-solutions' ); ?>
			</a>
		</div>

		<div class="feature-block__visual logo-panel">
			<img
				class="logo-panel__img logo-panel__img--break90"
				src="<?php echo esc_url( $break90_logo ); ?>"
				alt="<?php esc_attr_e( 'Break90 Golf', 'ai-coaching-solutions' ); ?>"
				width="320"
				height="320"
				loading="lazy"
			>
		</div>
	</div>
</section>
