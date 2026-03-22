(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const initHamburger = () => {
    const hamburger = $('#hamburger');
    const navDrawer = $('#navDrawer');
    if (!hamburger || !navDrawer) return;

    const closeMenu = () => {
      hamburger.classList.remove('open');
      navDrawer.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = hamburger.classList.toggle('open');
      navDrawer.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navDrawer.contains(e.target)) closeMenu();
    });

    $$('.nav-link', navDrawer).forEach(link => link.addEventListener('click', closeMenu));
  };

  const initTicker = () => {
    const tickerPause = $('#tickerPause');
    const tickerTrack = $('#tickerTrack');
    if (!tickerPause || !tickerTrack) return;

    let paused = false;
    const sync = () => {
      tickerTrack.classList.toggle('paused', paused);
      tickerPause.setAttribute('aria-label', paused ? 'Play ticker' : 'Pause ticker');
      tickerPause.setAttribute('title', paused ? 'Play ticker' : 'Pause ticker');
      tickerPause.textContent = paused ? '▶' : '❚❚';
    };

    tickerPause.addEventListener('click', () => {
      paused = !paused;
      sync();
    });

    sync();
  };

  const initSourceFilter = () => {
    const filterBtns = $$('.filter-btn');
    const sourceCards = $$('.source-card');
    if (!filterBtns.length || !sourceCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        sourceCards.forEach(card => {
          const show = filter === 'all' || card.dataset.type === filter;
          card.classList.toggle('hidden', !show);
          if (show) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          }
        });
      });
    });
  };

  const initLoadAnimation = () => {
    const animatedCards = $$('.source-card');
    if (!animatedCards.length) return;

    window.addEventListener('load', () => {
      animatedCards.forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 80 + i * 40);
      });
    }, { once: true });
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHamburger();
    initTicker();
    initSourceFilter();
    initLoadAnimation();
  });
})();