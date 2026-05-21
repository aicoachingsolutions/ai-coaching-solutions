<?php
/**
 * Multi-sport grid section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$sports = array(
	'basketball'   => __( 'Basketball', 'ai-coaching-solutions' ),
	'football'     => __( 'Football', 'ai-coaching-solutions' ),
	'baseball'     => __( 'Baseball', 'ai-coaching-solutions' ),
	'softball'     => __( 'Softball', 'ai-coaching-solutions' ),
	'golf'         => __( 'Golf', 'ai-coaching-solutions' ),
	'lacrosse'     => __( 'Lacrosse', 'ai-coaching-solutions' ),
	'hockey'       => __( 'Hockey', 'ai-coaching-solutions' ),
	'track-field'  => __( 'Track & Field', 'ai-coaching-solutions' ),
	'soccer'       => __( 'Soccer', 'ai-coaching-solutions' ),
	'volleyball'   => __( 'Volleyball', 'ai-coaching-solutions' ),
);
?>

<section class="section multi-sport" aria-labelledby="multi-sport-title">
	<div class="container">
		<header class="section__header">
			<h2 class="section__title" id="multi-sport-title">
				<?php esc_html_e( 'Built for Coaches and Athletes Across Sports', 'ai-coaching-solutions' ); ?>
			</h2>
			<p class="section__subtitle section__subtitle--center">
				<?php esc_html_e( 'One platform philosophy — multiple coaching solutions that adapt to how you coach and how athletes train, whatever sport you play or lead.', 'ai-coaching-solutions' ); ?>
			</p>
		</header>

		<div class="sport-grid">
			<?php foreach ( $sports as $slug => $label ) : ?>
				<?php
				$image_url = acs_sport_image_url( $slug );
				$has_image = ! empty( $image_url );
				?>
				<article class="sport-card sport-card--<?php echo esc_attr( $slug ); ?><?php echo $has_image ? ' sport-card--has-photo' : ''; ?>">
					<?php if ( $has_image ) : ?>
						<img
							class="sport-card__photo"
							src="<?php echo esc_url( $image_url ); ?>"
							alt=""
							loading="lazy"
							decoding="async"
						>
					<?php else : ?>
						<div class="sport-card__bg" aria-hidden="true"></div>
					<?php endif; ?>
					<div class="sport-card__shade" aria-hidden="true"></div>
					<h3 class="sport-card__title"><?php echo esc_html( $label ); ?></h3>
				</article>
			<?php endforeach; ?>
		</div>

		<p class="multi-sport__more">
			<?php esc_html_e( 'And More', 'ai-coaching-solutions' ); ?>
		</p>
	</div>
</section>
