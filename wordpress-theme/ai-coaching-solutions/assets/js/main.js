/**
 * AI Coaching Solutions — theme interactions.
 */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Mobile navigation --- */
  const header = document.getElementById('site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-nav');

  if (header && toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute('aria-expanded', 'false');
      header.classList.remove('site-header--nav-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      header.classList.toggle('site-header--nav-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 991px)').matches) {
          closeNav();
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener(
      'scroll',
      () => {
        header.classList.toggle('site-header--scrolled', window.scrollY > 40);
      },
      { passive: true }
    );
  }

  /* --- Hero background video --- */
  const heroVideo = document.querySelector('.hero__video');

  if (heroVideo) {
    if (prefersReducedMotion) {
      heroVideo.pause();
      heroVideo.removeAttribute('autoplay');
    } else {
      const playVideo = () => {
        const playPromise = heroVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            /* Autoplay blocked — poster/overlay still visible */
          });
        }
      };

      if (heroVideo.readyState >= 2) {
        playVideo();
      } else {
        heroVideo.addEventListener('loadeddata', playVideo, { once: true });
      }
    }
  }

  /* --- Hero text slide-in on load --- */
  const heroContent = document.getElementById('hero-content');

  if (heroContent) {
    const showHero = () => {
      heroContent.classList.add('is-visible');
    };

    if (prefersReducedMotion) {
      showHero();
    } else {
      requestAnimationFrame(() => {
        requestAnimationFrame(showHero);
      });
    }
  }
})();
