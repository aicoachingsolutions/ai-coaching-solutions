<?php
/**
 * Final CTA section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$planner_url  = acs_app_url( 'practice-planner' );
$analyzer_url = acs_app_url( 'analyzer' );
?>

<section class="section final-cta" id="pricing" aria-labelledby="final-cta-title">
	<div class="final-cta__bg" aria-hidden="true"></div>
	<div class="container final-cta__inner">
		<h2 class="final-cta__title" id="final-cta-title">
			<?php esc_html_e( 'Smarter Coaching Solutions for Coaches and Athletes', 'ai-coaching-solutions' ); ?>
		</h2>
		<p class="final-cta__subtitle">
			<?php esc_html_e( 'Coaches — start with the Practice Planner. Athletes and coaches — try the Free Swing Analyzer. Golfers — explore Break90 when you are ready.', 'ai-coaching-solutions' ); ?>
		</p>
		<div class="final-cta__actions">
			<a class="btn btn--primary btn--lg" href="<?php echo esc_url( $planner_url ); ?>">
				<?php esc_html_e( 'Explore Practice Planner', 'ai-coaching-solutions' ); ?>
			</a>
			<a class="btn btn--secondary btn--lg" href="#tools">
				<?php esc_html_e( 'All Coaching Tools', 'ai-coaching-solutions' ); ?>
			</a>
		</div>
	</div>
</section>
