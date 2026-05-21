<?php
/**
 * Site footer.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

</main>

<footer class="site-footer">
	<div class="container site-footer__inner">
		<div class="site-footer__brand">
			<?php get_template_part( 'template-parts/brand-logo', null, array( 'context' => 'footer' ) ); ?>
			<p class="site-footer__tagline"><?php esc_html_e( 'Multiple AI coaching solutions for coaches and athletes.', 'ai-coaching-solutions' ); ?></p>
		</div>
		<nav class="site-footer__nav" aria-label="<?php esc_attr_e( 'Footer', 'ai-coaching-solutions' ); ?>">
			<ul>
				<li><a href="#tools"><?php esc_html_e( 'Coaching Tools', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#practice-planner"><?php esc_html_e( 'Practice Planner', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#free-analyzer"><?php esc_html_e( 'Free Analyzer', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="#break90"><?php esc_html_e( 'Break90 Golf', 'ai-coaching-solutions' ); ?></a></li>
				<li><a href="<?php echo esc_url( acs_app_url( 'login' ) ); ?>"><?php esc_html_e( 'Login', 'ai-coaching-solutions' ); ?></a></li>
			</ul>
		</nav>
		<p class="site-footer__copy">
			&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'All rights reserved.', 'ai-coaching-solutions' ); ?>
		</p>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
