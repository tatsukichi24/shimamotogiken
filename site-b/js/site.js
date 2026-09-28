/* site.js — 共通の振る舞い（ヘッダー影 / 現在地ナビ / スクロール表示） */
(function () {
  var d = document, html = d.documentElement;
  html.classList.add('js');

  // 1) スクロールでヘッダーに薄い影
  var header = d.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 1b) FV動画：ソース未設定なら video を隠し、ポスター写真（img）だけを見せる
  var fvVideo = d.querySelector('.fv__video');
  if (fvVideo && !fvVideo.querySelector('source[src]:not([src=""])') && !fvVideo.getAttribute('src')) {
    fvVideo.style.display = 'none';
  }

  // 2) 現在地ナビ（PCナビの下線）
  var file = (location.pathname.split('/').pop() || 'index.html').split('?')[0];
  d.querySelectorAll('.header__nav-item').forEach(function (item) {
    var links = item.querySelectorAll('a[href]');
    var hit = Array.prototype.some.call(links, function (a) {
      var f = (a.getAttribute('href') || '').split('#')[0].split('?')[0].split('/').pop();
      return f && f === file;
    });
    if (!hit && file === 'index.html') {
      var top = item.querySelector('.header__nav-link');
      hit = !!top && top.getAttribute('href') === '#' && top.textContent.trim() === 'TOP';
    }
    if (hit) item.classList.add('is-current');
  });

  // 3) スクロール表示（控えめなフェードアップ）。IO非対応・reduced-motion時は即時全表示
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sel = [
    '.section-header', '.section-title', '.page-header .container',
    '.service-hero__content', '.service-hero__image', '.about-hero__content', '.about-hero__image',
    '.feature-block', '.strength-card', '.related-service-card', '.article-card', '.location-card',
    '.for-you-card', '.skill-card', '.education-card', '.value-card', '.guideline-card', '.job-card',
    '.feature-item', '.flow-grid-item', '.flow-vertical__item', '.about-policy__card', '.model-diagram',
    '.model-diagram__result', '.machines__item', '.news-page__item', '.support-section__inner',
    '.machine-doctor__inner', '.used-machine-banner__inner', '.final-cta__group', '.final-cta__bar--contact',
    '.service-card', '.used-machine-cta__inner', '.access-block', '.info-table', '.contact-intro', '.form-section',
    '.person-content', '.why-now-content', '.message-content', '.career-path', '.tel-banner__inner',
    '.application-list', '.service-cta__inner', '.recruit-cta__inner', '.about-company-cta__inner'
  ].join(',');
  if (!reduce) {
    d.querySelectorAll(sel).forEach(function (el) { if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', ''); });
  }
  var targets = d.querySelectorAll('[data-reveal]');
  function showAll() { targets.forEach(function (el) { el.classList.add('is-visible'); }); }
  if (reduce || !('IntersectionObserver' in window)) { showAll(); return; }
  var io = new IntersectionObserver(function (entries) {
    var i = 0;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.style.transitionDelay = Math.min(i++ * 70, 350) + 'ms';
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px 12% 0px' });
  targets.forEach(function (el) { io.observe(el); });
  window.addEventListener('beforeprint', showAll);
})();
