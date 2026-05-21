<?php
/**
 * Practice Planner module section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$planner_url  = acs_app_url( 'practice-planner' );
$planner_logo = acs_theme_image_url( 'practice-planner-logo.png' );
?>

<section class="section feature-block feature-block--planner" id="practice-planner" aria-labelledby="practice-planner-title">
	<div class="container feature-block__inner feature-block__inner--reverse">
		<div class="feature-block__content">
			<span class="section__label"><?php esc_html_e( 'Lead coaching tool', 'ai-coaching-solutions' ); ?></span>
			<h2 class="section__title" id="practice-planner-title">
				<?php esc_html_e( 'Plan Better Practices in Minutes', 'ai-coaching-solutions' ); ?>
			</h2>
			<p class="section__body">
				<?php esc_html_e( 'The Practice Planner is the coaching tool we are putting first — built to help coaches organize drills, set focus areas, and create structured practices in minutes without replacing your full coaching system.', 'ai-coaching-solutions' ); ?>
			</p>
			<ul class="feature-list">
				<li><?php esc_html_e( 'Drag-and-drop practice structure', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( 'Connect drills from your library', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( 'Share plans with staff and athletes', 'ai-coaching-solutions' ); ?></li>
			</ul>
			<?php
			get_template_part(
				'template-parts/mvp-callout',
				null,
				array(
					'product'  => __( 'Practice Planner', 'ai-coaching-solutions' ),
					'url'      => $planner_url,
					'audience' => 'coaches',
				)
			);
			?>
			<a class="btn btn--secondary feature-block__cta-secondary" href="<?php echo esc_url( $planner_url ); ?>">
				<?php esc_html_e( 'View Practice Planner', 'ai-coaching-solutions' ); ?>
			</a>
		</div>

		<div class="feature-block__visual logo-panel">
			<img
				class="logo-panel__img logo-panel__img--planner"
				src="<?php echo esc_url( $planner_logo ); ?>"
				alt="<?php esc_attr_e( 'Practice Planner', 'ai-coaching-solutions' ); ?>"
				width="320"
				height="360"
				loading="lazy"
			>
		</div>
	</div>
</section>
