<?php
/**
 * Fallback template — redirects marketing layout on blog index.
 *
 * @package AI_Coaching_Solutions
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<section class="section section--page">
	<div class="container">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : ?>
				<?php the_post(); ?>
				<article <?php post_class( 'page-content' ); ?>>
					<h1 class="section__title"><?php the_title(); ?></h1>
					<div class="page-content__body">
						<?php the_content(); ?>
					</div>
				</article>
			<?php endwhile; ?>
		<?php else : ?>
			<p><?php esc_html_e( 'No content found.', 'ai-coaching-solutions' ); ?></p>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
