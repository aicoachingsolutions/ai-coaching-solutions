<?php
/**
 * Hero section — looping background video + slide-in copy.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$hero_video    = acs_hero_video_url();
$hero_poster   = ACS_THEME_URI . '/assets/images/hero-poster.svg';
$has_video     = acs_has_hero_video();
$planner_mvp   = add_query_arg( 'mvp', 'coach', acs_app_url( 'practice-planner' ) );
$break90_mvp   = add_query_arg( 'mvp', 'golfer', acs_app_url( 'break90' ) );
?>

<section class="hero<?php echo $has_video ? ' hero--has-video' : ''; ?>" id="top" aria-label="<?php esc_attr_e( 'Hero', 'ai-coaching-solutions' ); ?>">
	<div class="hero__media" aria-hidden="true">
		<?php if ( $has_video ) : ?>
		<video
			class="hero__video"
			autoplay
			muted
			loop
			playsinline
			preload="auto"
			poster="<?php echo esc_url( $hero_poster ); ?>"
		>
			<source src="<?php echo esc_url( $hero_video ); ?>" type="video/mp4">
		</video>
		<?php endif; ?>
		<div class="hero__overlay"></div>
		<div class="hero__scrim"></div>
	</div>

	<div class="hero__content container" id="hero-content">
		<p class="hero__eyebrow hero__reveal hero__reveal--left">
			<?php esc_html_e( 'AI Coaching Solutions', 'ai-coaching-solutions' ); ?>
		</p>
		<h1 class="hero__title hero__reveal hero__reveal--left">
			<?php esc_html_e( 'One AI Platform. Multiple Coaching Solutions.', 'ai-coaching-solutions' ); ?>
		</h1>
		<p class="hero__subtitle hero__reveal hero__reveal--right">
			<?php esc_html_e( 'Coaching tools for real programs — practice planning, swing analysis, and more. Built for coaches and athletes on one platform.', 'ai-coaching-solutions' ); ?>
		</p>
		<div class="hero__mvp hero__reveal hero__reveal--left">
			<p class="hero__mvp-badge"><?php esc_html_e( 'Early access open', 'ai-coaching-solutions' ); ?></p>
			<p class="hero__mvp-text">
				<?php esc_html_e( 'Coaches — help shape the Practice Planner MVP. Athletes and coaches — use the Free Swing Analyzer free. Golfers — test Break90 as your AI coach.', 'ai-coaching-solutions' ); ?>
			</p>
			<div class="hero__mvp-actions">
				<a class="btn btn--primary btn--sm" href="<?php echo esc_url( $planner_mvp ); ?>">
					<?php esc_html_e( 'Coaches — Join Practice Planner MVP', 'ai-coaching-solutions' ); ?>
				</a>
				<a class="btn btn--secondary btn--sm" href="<?php echo esc_url( $break90_mvp ); ?>">
					<?php esc_html_e( 'Athletes — Join Break90 Golf MVP', 'ai-coaching-solutions' ); ?>
				</a>
			</div>
		</div>
		<div class="hero__actions">
			<a class="btn btn--primary hero__reveal hero__reveal--left" href="#free-analyzer">
				<?php esc_html_e( 'Try Free Swing Analyzer', 'ai-coaching-solutions' ); ?>
			</a>
			<a class="btn btn--secondary hero__reveal hero__reveal--right" href="#tools">
				<?php esc_html_e( 'Explore Coaching Tools', 'ai-coaching-solutions' ); ?>
			</a>
		</div>
	</div>
</section>
