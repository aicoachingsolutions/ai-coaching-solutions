<?php

/**

 * Platform overview — tool cards.

 *

 * @package AI_Coaching_Solutions

 */



if ( ! defined( 'ABSPATH' ) ) {

	exit;

}



$tools = array(

	array(

		'title'        => __( 'Practice Planner', 'ai-coaching-solutions' ),

		'description'  => __( 'Founding coach program: full Pro for 60 days free — feedback on real practice plans. Earn up to 120 days.', 'ai-coaching-solutions' ),
		'pro_badge'    => __( '60 days Pro — MVP', 'ai-coaching-solutions' ),

		'link'         => '#practice-planner',

		'icon'         => 'planner',

		'logo'         => 'practice-planner-logo.png',

		'mvp'          => true,

		'mvp_audience' => 'coaches',

		'featured'     => true,

	),

	array(

		'title'       => __( 'Free Swing Analyzer', 'ai-coaching-solutions' ),

		'description' => __( 'Free for athletes and coaches — coaching breakdown in under 60 seconds for golf, baseball, and softball.', 'ai-coaching-solutions' ),
		'free_badge'  => __( 'FREE — No login', 'ai-coaching-solutions' ),

		'link'        => '#free-analyzer',

		'icon'        => 'analyzer',

		'logo'        => 'swing-analyzer-logo.png',

	),

	array(

		'title'        => __( 'Break90 Golf', 'ai-coaching-solutions' ),

		'description'  => __( 'Founding golfer program: full Pro for 60 days free — feedback after real rounds. Earn up to 120 days.', 'ai-coaching-solutions' ),
		'pro_badge'    => __( '60 days Pro — MVP', 'ai-coaching-solutions' ),

		'link'         => '#break90',

		'icon'         => 'golf',

		'logo'         => 'break90-logo.png',

		'mvp'          => true,

		'mvp_audience' => 'golfers',

	),

	array(

		'title'        => __( 'Drill Library', 'ai-coaching-solutions' ),

		'description'  => __( 'Store, tag, and reuse your favorite drills.', 'ai-coaching-solutions' ),

		'icon'         => 'library',

		'logo'         => 'drill-library-logo.png',

		'coming_soon'  => true,

	),

	array(

		'title'        => __( 'Team Development', 'ai-coaching-solutions' ),

		'description'  => __( 'Track growth, communication, and culture.', 'ai-coaching-solutions' ),

		'icon'         => 'team',

		'logo'         => 'team-development-logo.png',

		'coming_soon'  => true,

	),

	array(

		'title'        => __( 'Future Coaching Tools', 'ai-coaching-solutions' ),

		'description'  => __( 'Expanding ecosystem for coaches and athletes.', 'ai-coaching-solutions' ),

		'icon'         => 'future',

		'logo'         => 'future-coaching-tools-logo.png',

		'coming_soon'  => true,

	),

);

?>



<section class="section platform-overview" id="tools" aria-labelledby="platform-overview-title">

	<div class="container">

		<header class="section__header">

			<h2 class="section__title section__title--single-line" id="platform-overview-title">
				<?php esc_html_e( 'Coaching Tools Built for Your Program', 'ai-coaching-solutions' ); ?>
			</h2>

			<p class="section__subtitle section__subtitle--center">

				<?php esc_html_e( 'Free Swing Analyzer is live for athletes and coaches. Practice Planner and Break90 founding programs include 60 days of Pro free when access opens — up to 120 days with milestones.', 'ai-coaching-solutions' ); ?>

			</p>

		</header>



		<?php get_template_part( 'template-parts/platform-mvp-callout' ); ?>



		<div class="card-grid card-grid--3">

			<?php foreach ( $tools as $tool ) : ?>

				<?php

				$is_coming_soon = ! empty( $tool['coming_soon'] );

				$card_class     = 'tool-card' . ( $is_coming_soon ? ' tool-card--coming-soon' : '' );

				if ( ! empty( $tool['featured'] ) ) {

					$card_class .= ' tool-card--featured';

				}

				$logo_class = 'logo-panel__img';

				if ( ! empty( $tool['logo'] ) && 'break90-logo.png' === $tool['logo'] ) {

					$logo_class .= ' logo-panel__img--break90';

				}

				if ( ! empty( $tool['logo'] ) && 'swing-analyzer-logo.png' === $tool['logo'] ) {

					$logo_class .= ' logo-panel__img--analyzer';

				}

				?>

				<?php if ( $is_coming_soon ) : ?>

					<div class="<?php echo esc_attr( $card_class ); ?>">

				<?php else : ?>

					<a class="<?php echo esc_attr( $card_class ); ?>" href="<?php echo esc_url( $tool['link'] ); ?>">

				<?php endif; ?>



					<div class="tool-card__badge-slot<?php echo ( ! empty( $tool['featured'] ) && ! empty( $tool['pro_badge'] ) ) || ( ! empty( $tool['free_badge'] ) && ! empty( $tool['pro_badge'] ) ) ? ' tool-card__badge-slot--multi' : ''; ?>">
						<?php if ( ! empty( $tool['featured'] ) ) : ?>
							<span class="tool-card__badge tool-card__badge--featured"><?php esc_html_e( 'Lead tool', 'ai-coaching-solutions' ); ?></span>
						<?php endif; ?>
						<?php if ( ! empty( $tool['free_badge'] ) ) : ?>
							<span class="tool-card__badge tool-card__badge--featured"><?php echo esc_html( $tool['free_badge'] ); ?></span>
						<?php endif; ?>
						<?php if ( ! empty( $tool['pro_badge'] ) ) : ?>
							<span class="tool-card__badge tool-card__badge--mvp"><?php echo esc_html( $tool['pro_badge'] ); ?></span>
						<?php elseif ( ! empty( $tool['mvp'] ) ) : ?>
							<?php
							$mvp_badge = ( ! empty( $tool['mvp_audience'] ) && 'golfers' === $tool['mvp_audience'] )
								? __( 'MVP golfers', 'ai-coaching-solutions' )
								: __( 'MVP coaches', 'ai-coaching-solutions' );
							?>
							<span class="tool-card__badge tool-card__badge--mvp"><?php echo esc_html( $mvp_badge ); ?></span>
						<?php elseif ( $is_coming_soon ) : ?>
							<span class="tool-card__badge"><?php esc_html_e( 'Coming soon', 'ai-coaching-solutions' ); ?></span>
						<?php endif; ?>
						<?php if ( ! empty( $tool['pro_badge'] ) && empty( $tool['coming_soon'] ) ) : ?>
							<span class="tool-card__badge"><?php esc_html_e( 'Opening soon', 'ai-coaching-solutions' ); ?></span>
						<?php endif; ?>
					</div>



					<?php if ( ! empty( $tool['logo'] ) ) : ?>

						<div class="logo-panel">

							<img

								class="<?php echo esc_attr( $logo_class ); ?>"

								src="<?php echo esc_url( acs_theme_image_url( $tool['logo'] ) ); ?>"

								alt=""

								width="120"

								height="72"

								loading="lazy"

							>

						</div>

					<?php else : ?>

						<div class="tool-card__icon tool-card__icon--<?php echo esc_attr( $tool['icon'] ); ?>" aria-hidden="true"></div>

					<?php endif; ?>



					<h3 class="tool-card__title"><?php echo esc_html( $tool['title'] ); ?></h3>

					<p class="tool-card__desc"><?php echo esc_html( $tool['description'] ); ?></p>



					<?php if ( $is_coming_soon ) : ?>

						<span class="tool-card__status"><?php esc_html_e( 'Coming soon', 'ai-coaching-solutions' ); ?></span>

					<?php else : ?>

						<span class="tool-card__link"><?php esc_html_e( 'Learn more', 'ai-coaching-solutions' ); ?> &rarr;</span>

					<?php endif; ?>



				<?php if ( $is_coming_soon ) : ?>

					</div>

				<?php else : ?>

					</a>

				<?php endif; ?>

			<?php endforeach; ?>

		</div>

	</div>

</section>

