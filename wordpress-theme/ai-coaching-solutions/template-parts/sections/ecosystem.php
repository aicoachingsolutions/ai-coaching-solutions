<?php
/**
 * Ecosystem / coming soon section.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$modules = array(
	__( 'Player development', 'ai-coaching-solutions' ),
	__( 'Team communication', 'ai-coaching-solutions' ),
	__( 'Advanced analytics', 'ai-coaching-solutions' ),
	__( 'Recruiting tools', 'ai-coaching-solutions' ),
	__( 'Culture tracking', 'ai-coaching-solutions' ),
);
?>

<section class="section ecosystem" id="ecosystem" aria-labelledby="ecosystem-title">
	<div class="container">
		<div class="ecosystem__card">
			<header class="section__header section__header--left">
				<span class="section__label"><?php esc_html_e( 'Roadmap', 'ai-coaching-solutions' ); ?></span>
				<h2 class="section__title" id="ecosystem-title">
					<?php esc_html_e( 'An Expanding AI Coaching Ecosystem', 'ai-coaching-solutions' ); ?>
				</h2>
				<p class="section__subtitle">
					<?php esc_html_e( 'The Practice Planner, Free Swing Analyzer, and Break90 Golf are live today. More coaching tools are in development for coaches and athletes.', 'ai-coaching-solutions' ); ?>
				</p>
			</header>

			<ul class="ecosystem__modules">
				<?php foreach ( $modules as $module ) : ?>
					<li class="ecosystem__module">
						<span class="ecosystem__badge"><?php esc_html_e( 'Coming soon', 'ai-coaching-solutions' ); ?></span>
						<span><?php echo esc_html( $module ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>
