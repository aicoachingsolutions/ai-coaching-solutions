<?php
/**
 * Free Swing Analyzer section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$sports = array(
	array(
		'name' => __( 'Golf', 'ai-coaching-solutions' ),
		'slug' => 'golf',
		'ball' => 'ball-golf.png',
	),
	array(
		'name' => __( 'Baseball', 'ai-coaching-solutions' ),
		'slug' => 'baseball',
		'ball' => 'ball-baseball.png',
	),
	array(
		'name' => __( 'Softball', 'ai-coaching-solutions' ),
		'slug' => 'softball',
		'ball' => 'ball-softball.png',
	),
);

$analyzer_url  = acs_app_url( 'analyzer' );
$analyzer_logo = acs_theme_image_url( 'swing-analyzer-logo.png' );
?>

<section class="section swing-analyzer" id="free-analyzer" aria-labelledby="swing-analyzer-title">
	<div class="container swing-analyzer__inner">
		<div class="swing-analyzer__copy">
			<h2 class="section__title" id="swing-analyzer-title">
				<?php esc_html_e( 'See the Power of AI — Try Our Free Swing Analyzer', 'ai-coaching-solutions' ); ?>
			</h2>
			<p class="section__subtitle">
				<?php esc_html_e( 'Built for athletes and coaches in golf, baseball, and softball. Describe what is happening in your swing — no video required. Tell the analyzer what you are seeing, like “I hit too many ground balls” or “I slice everything,” and it turns that feedback into clear improvement areas for your next practice.', 'ai-coaching-solutions' ); ?>
			</p>
			<ul class="swing-analyzer__examples">
				<li><?php esc_html_e( '“I pull everything foul.”', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( '“My driver keeps slicing right.”', 'ai-coaching-solutions' ); ?></li>
				<li><?php esc_html_e( '“I pop up too many pitches.”', 'ai-coaching-solutions' ); ?></li>
			</ul>
			<a class="btn btn--primary btn--lg" href="<?php echo esc_url( $analyzer_url ); ?>">
				<?php esc_html_e( 'Try the Free Analyzer', 'ai-coaching-solutions' ); ?>
			</a>
		</div>

		<div class="swing-analyzer__visual">
			<div class="logo-panel">
				<img
					class="logo-panel__img"
					src="<?php echo esc_url( $analyzer_logo ); ?>"
					alt="<?php esc_attr_e( 'Swing Analyzer AI', 'ai-coaching-solutions' ); ?>"
					loading="lazy"
					decoding="async"
				>
			</div>

			<div class="sport-pills" role="list">
				<?php foreach ( $sports as $sport ) : ?>
					<a
						class="sport-pill sport-pill--<?php echo esc_attr( $sport['slug'] ); ?>"
						href="<?php echo esc_url( $analyzer_url . '?sport=' . $sport['slug'] ); ?>"
						role="listitem"
					>
						<div class="sport-pill__media">
							<img
								class="sport-ball-img"
								src="<?php echo esc_url( acs_theme_image_url( $sport['ball'] ) ); ?>"
								alt=""
								width="80"
								height="80"
								loading="lazy"
							>
						</div>
						<span class="sport-pill__label"><?php echo esc_html( $sport['name'] ); ?></span>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
