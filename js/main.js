(() => {
  const carousel = document.querySelector('[data-reel-carousel]');
  if (!carousel) return;

  const reels = [
    {
      id: '9K4l81sEGqQ',
      title: 'AI Host-Led Promotional Reel',
      description: 'An AI-generated presenter combined with hands-on editing, captions, pacing, and quality control.'
    },
    {
      id: 'tJdjFQpZRhw',
      title: 'Trend-Based Meme Reel',
      description: 'A social-first edit using familiar platform conventions, fast pacing, and concise text treatment.'
    },
    {
      id: 'CH_SuSlxSW0',
      title: 'Event Highlight Reel',
      description: 'A compact event recap shaped through footage selection, sequencing, music, and visual momentum.'
    },
    {
      id: 'H6Ylp-J4e-0',
      title: 'Promotional Event Invitation',
      description: 'A vertical invitation video organised around a clear hook, essential details, and direct call to action.'
    }
  ];

  const frame = carousel.querySelector('[data-reel-frame]');
  const title = carousel.querySelector('[data-reel-title]');
  const description = carousel.querySelector('[data-reel-description]');
  const count = carousel.querySelector('[data-reel-index]');
  const progress = carousel.querySelector('[data-reel-progress]');
  const dots = [...carousel.querySelectorAll('[data-reel-dot]')];
  let current = 0;
  let touchStart = 0;

  const show = (next) => {
    current = (next + reels.length) % reels.length;
    const reel = reels[current];
    frame.src = `https://www.youtube-nocookie.com/embed/${reel.id}?rel=0`;
    frame.title = reel.title;
    title.textContent = reel.title;
    description.textContent = reel.description;
    count.textContent = String(current + 1).padStart(2, '0');
    progress.style.width = `${((current + 1) / reels.length) * 100}%`;
    dots.forEach((dot, index) => dot.setAttribute('aria-current', index === current ? 'true' : 'false'));
  };

  carousel.querySelector('[data-reel-prev]').addEventListener('click', () => show(current - 1));
  carousel.querySelector('[data-reel-next]').addEventListener('click', () => show(current + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.reelDot))));
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  carousel.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) < 45) return;
    show(current + (distance < 0 ? 1 : -1));
  }, { passive: true });
})();

(() => {
  const carousel = document.querySelector('[data-pim-carousel]');
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll('[data-pim-slide]')];
  const dots = [...carousel.querySelectorAll('[data-pim-dot]')];
  let current = 0;
  let touchStart = 0;

  const show = (next) => {
    current = (next + slides.length) % slides.length;
    slides.forEach((slide, index) => slide.classList.toggle('is-active', index === current));
    dots.forEach((dot, index) => dot.setAttribute('aria-current', index === current ? 'true' : 'false'));
  };

  carousel.querySelector('[data-pim-prev]').addEventListener('click', () => show(current - 1));
  carousel.querySelector('[data-pim-next]').addEventListener('click', () => show(current + 1));
  dots.forEach((dot) => dot.addEventListener('click', () => show(Number(dot.dataset.pimDot))));
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
  carousel.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].clientX - touchStart;
    if (Math.abs(distance) < 45) return;
    show(current + (distance < 0 ? 1 : -1));
  }, { passive: true });
})();

(() => {
  const evidence = document.querySelector('[data-shopify-evidence]');
  if (!evidence) return;

  const tabs = [...evidence.querySelectorAll('[data-shopify-tab]')];
  const panels = [...evidence.querySelectorAll('[data-shopify-panel]')];
  let current = 0;

  const show = (next) => {
    current = (next + tabs.length) % tabs.length;
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', index === current ? 'true' : 'false');
      tab.tabIndex = index === current ? 0 : -1;
    });
    panels.forEach((panel, index) => panel.classList.toggle('is-active', index === current));
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => show(Number(tab.dataset.shopifyTab))));
  evidence.querySelector('.shopify-tabs').addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
    tabs[current].focus();
  });
  show(0);
})();

(() => {
  const evidence = document.querySelector('[data-fnb-evidence]');
  if (!evidence) return;

  const panels = [...evidence.querySelectorAll('[data-fnb-panel]')];
  const tabs = [...evidence.querySelectorAll('[data-fnb-tab]')];
  let current = 0;

  const show = (next) => {
    current = (next + panels.length) % panels.length;
    panels.forEach((panel, index) => panel.classList.toggle('is-active', index === current));
    tabs.forEach((tab, index) => {
      tab.setAttribute('aria-selected', index === current ? 'true' : 'false');
      tab.tabIndex = index === current ? 0 : -1;
    });
  };

  evidence.querySelector('[data-fnb-prev]').addEventListener('click', () => show(current - 1));
  evidence.querySelector('[data-fnb-next]').addEventListener('click', () => show(current + 1));
  tabs.forEach((tab) => tab.addEventListener('click', () => show(Number(tab.dataset.fnbTab))));
  evidence.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  show(0);
})();
