<?php
/**
 * Brand logo — circle crest + AI Coaching Solutions.
 *
 * @package AI_Coaching_Solutions
 *
 * @var string $args['context'] header|footer
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$context = isset( $args['context'] ) ? $args['context'] : 'header';
$logo    = acs_logo_url();
$home    = home_url( '/' );
$label   = __( 'AI Coaching Solutions — Home', 'ai-coaching-solutions' );
?>
<a class="brand-logo brand-logo--<?php echo esc_attr( $context ); ?>" href="<?php echo esc_url( $home ); ?>" aria-label="<?php echo esc_attr( $label ); ?>">
	<span class="brand-logo__crest-wrap">
		<img
			class="brand-logo__crest"
			src="<?php echo esc_url( $logo ); ?>"
			alt=""
			loading="<?php echo 'header' === $context ? 'eager' : 'lazy'; ?>"
			decoding="async"
		>
	</span>
	<span class="brand-logo__text">AI Coaching Solutions</span>
</a>
