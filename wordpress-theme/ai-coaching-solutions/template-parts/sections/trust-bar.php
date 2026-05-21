<?php
/**
 * Trust / positioning bar.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$items = array(
	__( 'Coaching Tools First', 'ai-coaching-solutions' ),
	__( 'Practice Planner MVP', 'ai-coaching-solutions' ),
	__( 'Coaches & Athletes', 'ai-coaching-solutions' ),
	__( 'Free Swing Analyzer', 'ai-coaching-solutions' ),
);
?>

<section class="trust-bar" aria-label="<?php esc_attr_e( 'Platform highlights', 'ai-coaching-solutions' ); ?>">
	<div class="container trust-bar__inner">
		<ul class="trust-bar__list">
			<?php foreach ( $items as $item ) : ?>
				<li class="trust-bar__item">
					<span class="trust-bar__icon" aria-hidden="true"></span>
					<span><?php echo esc_html( $item ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
