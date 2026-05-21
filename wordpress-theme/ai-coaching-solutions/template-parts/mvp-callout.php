<?php
/**
 * MVP recruitment callout — golfers (Break90) or coaches (Practice Planner).
 *
 * @package AI_Coaching_Solutions
 *
 * @var array $args {
 *     @type string $product  Product name.
 *     @type string $url      CTA destination URL (app hub MVP page).
 *     @type string $audience golfers|coaches (default coaches).
 * }
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$product  = isset( $args['product'] ) ? $args['product'] : '';
$url      = isset( $args['url'] ) ? $args['url'] : acs_app_url();
$audience = isset( $args['audience'] ) ? $args['audience'] : 'coaches';

if ( '' === $product ) {
	return;
}

$is_golfer = ( 'golfers' === $audience );
$mvp_url   = untrailingslashit( $url );

if ( $is_golfer ) {
	$aria_label = sprintf( __( '%s founding golfer program', 'ai-coaching-solutions' ), $product );
	$badge      = __( 'Founding golfer program', 'ai-coaching-solutions' );
	$title      = __( '60 days of Break90 Pro free', 'ai-coaching-solutions' );
	$text       = __( 'See the full founding golfer program on the app hub — test after real rounds, share feedback, and earn up to 120 days of Pro access when we open.', 'ai-coaching-solutions' );
	$cta        = __( 'See Break90 MVP program', 'ai-coaching-solutions' );
} else {
	$aria_label = sprintf( __( '%s founding coach program', 'ai-coaching-solutions' ), $product );
	$badge      = __( 'Founding coach program', 'ai-coaching-solutions' );
	$title      = __( '60 days of Practice Planner Pro free', 'ai-coaching-solutions' );
	$text       = __( 'See the full founding coach program on the app hub — build real practice plans, share feedback, and earn up to 120 days of Pro access when we open.', 'ai-coaching-solutions' );
	$cta        = __( 'See Practice Planner MVP program', 'ai-coaching-solutions' );
}
?>

<aside class="mvp-callout" aria-label="<?php echo esc_attr( $aria_label ); ?>">
	<p class="mvp-callout__badge"><?php echo esc_html( $badge ); ?></p>
	<p class="mvp-callout__title"><?php echo esc_html( $title ); ?></p>
	<p class="mvp-callout__text"><?php echo esc_html( $text ); ?></p>
	<a class="btn btn--primary mvp-callout__cta" href="<?php echo esc_url( $mvp_url ); ?>">
		<?php echo esc_html( $cta ); ?>
	</a>
</aside>
