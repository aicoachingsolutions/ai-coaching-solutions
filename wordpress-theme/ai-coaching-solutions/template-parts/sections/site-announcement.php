<?php
/**
 * Homepage announcement — new app website coming soon.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$app_hub_url      = acs_app_url();
$marketing_url    = acs_marketing_site_url();
$app_host         = wp_parse_url( $app_hub_url, PHP_URL_HOST ) ?: 'app.aicoachingsolutions.net';
$marketing_host   = wp_parse_url( $marketing_url, PHP_URL_HOST ) ?: 'www.aicoachingsolutions.net';
?>
<section class="site-announcement" id="new-website" aria-label="<?php esc_attr_e( 'New website announcement', 'ai-coaching-solutions' ); ?>">
	<div class="container site-announcement__inner">
		<div class="site-announcement__copy">
			<p class="site-announcement__badge"><?php esc_html_e( 'Coming soon', 'ai-coaching-solutions' ); ?></p>
			<p class="site-announcement__title">
				<?php esc_html_e( 'New app website launching soon', 'ai-coaching-solutions' ); ?>
			</p>
			<p class="site-announcement__text">
				<?php
				printf(
					/* translators: 1: app subdomain host, 2: marketing host */
					esc_html__(
						'We are launching our app hub at %1$s — Free Swing Analyzer, founding MVP programs for Practice Planner and Break90 Golf, and coach sign-in. Full marketing story stays on %2$s.',
						'ai-coaching-solutions'
					),
					esc_html( $app_host ),
					esc_html( $marketing_host )
				);
				?>
			</p>
		</div>
		<div class="site-announcement__actions">
			<a class="btn btn--primary btn--sm" href="#tools">
				<?php esc_html_e( 'See what’s launching', 'ai-coaching-solutions' ); ?>
			</a>
			<a class="btn btn--secondary btn--sm" href="<?php echo esc_url( $app_hub_url ); ?>" target="_blank" rel="noopener noreferrer">
				<?php esc_html_e( 'Preview app hub', 'ai-coaching-solutions' ); ?>
			</a>
		</div>
	</div>
</section>
