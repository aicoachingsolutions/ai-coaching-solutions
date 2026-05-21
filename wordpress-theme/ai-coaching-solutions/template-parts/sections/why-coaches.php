<?php
/**
 * Why coaches use it — benefits.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$benefits = array(
	array(
		'title' => __( 'Save Planning Time', 'ai-coaching-solutions' ),
		'desc'  => __( 'Build structured practices in minutes instead of hours — so you spend more time coaching on the floor.', 'ai-coaching-solutions' ),
		'icon'  => 'time',
		'logo'  => 'saving-time-logo.png',
	),
	array(
		'title' => __( 'Organize Your Coaching System', 'ai-coaching-solutions' ),
		'desc'  => __( 'Centralize drills, plans, and development notes in one place your staff can actually use.', 'ai-coaching-solutions' ),
		'icon'  => 'organize',
		'logo'  => 'coaching-system-logo.png',
	),
	array(
		'title' => __( 'Get AI-Powered Feedback', 'ai-coaching-solutions' ),
		'desc'  => __( 'Athletes get instant swing feedback; coaches get clear insights to guide development — golf, baseball, and softball.', 'ai-coaching-solutions' ),
		'icon'  => 'ai',
		'logo'  => 'ai-powered-feedback-logo.png',
	),
	array(
		'title' => __( 'Build Better Player Development Habits', 'ai-coaching-solutions' ),
		'desc'  => __( 'Consistent planning and tracking create a culture of growth across your entire program.', 'ai-coaching-solutions' ),
		'icon'  => 'growth',
		'logo'  => 'build-better-player-development-logo.png',
	),
);
?>

<section class="section why-coaches" aria-labelledby="why-coaches-title">
	<div class="container">
		<header class="section__header">
			<h2 class="section__title" id="why-coaches-title">
				<?php esc_html_e( 'Why Coaches Use AI Coaching Solutions', 'ai-coaching-solutions' ); ?>
			</h2>
		</header>

		<div class="card-grid card-grid--2">
			<?php foreach ( $benefits as $benefit ) : ?>
				<article class="benefit-card<?php echo ! empty( $benefit['logo'] ) ? ' benefit-card--has-logo' : ''; ?>">
					<?php if ( ! empty( $benefit['logo'] ) ) : ?>
						<div class="logo-panel">
							<img
								class="logo-panel__img"
								src="<?php echo esc_url( acs_theme_image_url( $benefit['logo'] ) ); ?>"
								alt=""
								width="140"
								height="100"
								loading="lazy"
							>
						</div>
					<?php else : ?>
						<div class="benefit-card__icon benefit-card__icon--<?php echo esc_attr( $benefit['icon'] ); ?>" aria-hidden="true"></div>
					<?php endif; ?>
					<h3 class="benefit-card__title"><?php echo esc_html( $benefit['title'] ); ?></h3>
					<p class="benefit-card__desc"><?php echo esc_html( $benefit['desc'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
