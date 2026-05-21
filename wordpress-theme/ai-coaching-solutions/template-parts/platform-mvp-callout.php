<?php
/**
 * MVP callout for Coaching Tools section (Practice Planner coaches + Break90 golfers).
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$planner_url = acs_app_url( 'practice-planner' );
$break90_url = acs_app_url( 'break90' );
?>

<aside class="mvp-callout mvp-callout--section" aria-label="<?php esc_attr_e( 'MVP early access', 'ai-coaching-solutions' ); ?>">
	<p class="mvp-callout__badge"><?php esc_html_e( 'Early access open', 'ai-coaching-solutions' ); ?></p>
	<p class="mvp-callout__title">
		<?php esc_html_e( 'Founding coach and golfer programs', 'ai-coaching-solutions' ); ?>
	</p>
	<p class="mvp-callout__text">
		<?php esc_html_e( 'Practice Planner and Break90 offer 60 days of Pro free for founding users who test real workflows and share feedback. Free Swing Analyzer is live today on the app hub.', 'ai-coaching-solutions' ); ?>
	</p>
	<div class="mvp-callout__actions">
		<a class="btn btn--primary" href="<?php echo esc_url( $planner_url ); ?>">
			<?php esc_html_e( 'Join Practice Planner as founding coach', 'ai-coaching-solutions' ); ?>
		</a>
		<a class="btn btn--secondary" href="<?php echo esc_url( $break90_url ); ?>">
			<?php esc_html_e( 'Join Break90 as founding golfer', 'ai-coaching-solutions' ); ?>
		</a>
	</div>
</aside>
