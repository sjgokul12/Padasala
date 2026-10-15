import { useEffect } from 'react';

const SELECTOR = '.reveal, .reveal-stagger';

/**
 * Scroll-in animations. Elements with `reveal` rise into view; children of `reveal-stagger` follow one after another.
 * Works for content added later (route changes, filters) and is skipped when the user prefers reduced motion.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    );

    const watch = (node: ParentNode) => {
      if (node instanceof Element && node.matches(SELECTOR) && !node.classList.contains('is-visible')) io.observe(node);
      node.querySelectorAll?.(SELECTOR).forEach((el) => !el.classList.contains('is-visible') && io.observe(el));
    };
    watch(document.body);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) m.addedNodes.forEach((n) => n instanceof Element && watch(n));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);
}
