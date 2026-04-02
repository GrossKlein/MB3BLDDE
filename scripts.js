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

    // Tier staging: hide context-dependent claims until reader passes the hero
    const tier2Items = $$('[data-tier="2"]', tickerTrack);
    tier2Items.forEach(el => { el.style.display = 'none'; });

    const heroEl = document.getElementById('hero');
    if (heroEl && tier2Items.length && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          // Reader has scrolled past the hero — unlock tier 2 claims
          tier2Items.forEach(el => { el.style.display = ''; });
          revealObserver.disconnect();
        }
      }, { threshold: 0 });
      revealObserver.observe(heroEl);
    }
  };

  const initSourceFilter = () => {
    const filterBtns = $$('.filter-btn');
    const sourceCards = $$('.source-card');
    if (!filterBtns.length || !sourceCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        const filter = btn.dataset.filter;

        sourceCards.forEach(card => {
          const show = filter === 'all' || card.dataset.type === filter;
          card.classList.toggle('hidden', !show);
          card.setAttribute('aria-hidden', String(!show));
          if (!show) {
            card.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
          } else {
            card.querySelectorAll('a, button').forEach(el => el.removeAttribute('tabindex'));
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

  const initPenaltyChart = () => {
    const btns = $$('.penalty-chart-btn');
    const batsBar = $('#batsBar');
    const totalEl = $('#penaltyTotal');
    const bars = $('#penaltyBars');
    if (!btns.length || !bars) return;

    const DIRECT_TOTAL = '$3,313,368';
    const ALL_TOTAL = '$17,313,368';

    // Bar widths for "direct only" (relative to FINRA as 100%)
    const DIRECT_WIDTHS = { finra: '100%', cboe: '0.7%' };
    // Bar widths for "all" (relative to $14M SEC as 100%)
    const ALL_WIDTHS = { finra: '23.5%', cboe: '1%', sec: '100%' };

    const update = (view) => {
      const isDirect = view === 'direct';
      if (batsBar) batsBar.classList.toggle('hidden', isDirect);

      const finraFill = bars.querySelector('.bar-finra');
      const cboeFill = bars.querySelector('.bar-cboe');
      if (finraFill) finraFill.style.width = isDirect ? DIRECT_WIDTHS.finra : ALL_WIDTHS.finra;
      if (cboeFill) cboeFill.style.width = isDirect ? DIRECT_WIDTHS.cboe : ALL_WIDTHS.cboe;

      if (totalEl) totalEl.textContent = isDirect ? DIRECT_TOTAL : ALL_TOTAL;
    };

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        update(btn.dataset.view);
      });
    });

    // Initialize to the active button's view
    const activeBtn = btns.find(b => b.classList.contains('active'));
    if (activeBtn) update(activeBtn.dataset.view);
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
    initPenaltyChart();
    initLoadAnimation();
  });
})();