document.documentElement.classList.add('js');

(() => {
  const canvas = document.querySelector('[data-energy-particles]');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let size = 0;
  let dpr = 1;
  let particles = [];

  const reset = () => {
    const rect = canvas.getBoundingClientRect();
    size = Math.max(1, Math.min(rect.width, rect.height));
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: 48 }, (_, index) => ({
      radius: size * (.12 + Math.random() * .32),
      angle: Math.random() * Math.PI * 2,
      speed: (.00008 + Math.random() * .00018) * (index % 2 ? 1 : -1),
      size: .45 + Math.random() * 1.15,
      alpha: .16 + Math.random() * .4,
      colour: index % 3 === 0 ? '205,144,255' : index % 3 === 1 ? '90,229,255' : '255,180,245'
    }));
  };

  const draw = time => {
    ctx.clearRect(0, 0, size, size);
    const centre = size / 2;
    particles.forEach((particle, index) => {
      const wobble = Math.sin(time * .00035 + index) * size * .012;
      const angle = particle.angle + time * particle.speed;
      const x = centre + Math.cos(angle) * (particle.radius + wobble);
      const y = centre + Math.sin(angle) * (particle.radius * .72 + wobble * .45);
      const twinkle = .72 + Math.sin(time * .0012 + index * 1.7) * .28;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${particle.colour},${particle.alpha * twinkle})`;
      ctx.shadowColor = `rgba(${particle.colour},.65)`;
      ctx.shadowBlur = 5;
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    if (!reduced) requestAnimationFrame(draw);
  };

  reset();
  draw(0);
  addEventListener('resize', reset, { passive: true });
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const canvas = document.querySelector('#space');
  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let stars = [];
  let pointerX = innerWidth / 2;
  let pointerY = innerHeight / 2;

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.min(150, Math.floor(width / 8)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * .9 + .1,
      size: Math.random() * 1.2 + .2,
      phase: Math.random() * Math.PI * 2
    }));
  };

  const draw = (time = 0) => {
    ctx.clearRect(0, 0, width, height);
    const driftX = (pointerX / Math.max(1, width) - .5) * 20;
    const driftY = (pointerY / Math.max(1, height) - .5) * 14;
    stars.forEach(star => {
      const alpha = .12 + (Math.sin(time * .001 + star.phase) + 1) * .12;
      ctx.beginPath();
      ctx.fillStyle = `rgba(170,232,242,${alpha})`;
      ctx.arc((star.x + driftX * star.z + width) % width, (star.y + driftY * star.z + height) % height, star.size * star.z, 0, Math.PI * 2);
      ctx.fill();
    });
    if (!reduced) requestAnimationFrame(draw);
  };

  resize();
  draw();
  addEventListener('resize', resize, { passive: true });
  addEventListener('pointermove', event => { pointerX = event.clientX; pointerY = event.clientY; }, { passive: true });
})();

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer:fine)').matches;
  const root = document.documentElement;
  const meter = document.querySelector('.scroll-meter span');
  const topbar = document.querySelector('.topbar');
  const aura = document.querySelector('.cursor-light');
  const hero = document.querySelector('.hero');
  const heroVideo = document.querySelector('.hero-background-video');
  const heroCopy = document.querySelector('.hero-copy');
  const heroVisual = document.querySelector('.hero-visual-depth');
  const projects = [...document.querySelectorAll('.project')];
  const reveals = [...document.querySelectorAll('.reveal')];
  let scrollFrame = 0;

  if (reduced) reveals.forEach(item => item.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(item => observer.observe(item));
  }

  const updateScroll = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const ratio = Math.min(1, scrollY / max);
    meter.style.transform = `scaleX(${ratio})`;
    topbar.classList.toggle('is-scrolled', scrollY > 30);
    if (!reduced) {
      const heroProgress = Math.min(1, Math.max(0, scrollY / (innerHeight * .9)));
      hero.style.setProperty('--hero-scroll', heroProgress.toFixed(3));
      hero.style.setProperty('--hero-video-opacity', String(1 - heroProgress * .38));
      hero.style.setProperty('--hero-copy-opacity', String(1 - heroProgress * .72));
      hero.style.setProperty('--hero-module-opacity', String(1 - heroProgress * .58));
      hero.style.setProperty('--hero-shade-opacity', String(1 - heroProgress * .18));
      hero.style.setProperty('--hero-copy-y', `${heroProgress * 90}px`);
      hero.style.setProperty('--hero-copy-scale', String(1 - heroProgress * .045));
      hero.style.setProperty('--hero-module-y', `${heroProgress * 145}px`);
      hero.style.setProperty('--hero-module-scale', String(1 - heroProgress * .08));
      root.style.setProperty('--hero-band-lift', `${heroProgress * -18}px`);
      root.style.setProperty('--hero-shadow-opacity', String(heroProgress * .9));
      if (heroVideo) heroVideo.style.transform = `scale(${1 + heroProgress * .09}) translateY(${heroProgress * 2.5}%)`;

      projects.forEach((project, index) => {
        const rect = project.getBoundingClientRect();
        const centreOffset = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
        const shift = Math.max(-1, Math.min(1, centreOffset));
        project.style.setProperty('--scroll-shift', `${shift * 54 + index * .6}px`);
        project.style.setProperty('--copy-shift', `${shift * -22}px`);
        project.style.setProperty('--scroll-glow', String(Math.max(0, 1 - Math.abs(centreOffset)) * .22));
      });
    }
    scrollFrame = 0;
  };
  updateScroll();
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });

  if (!reduced && finePointer) {
    addEventListener('pointermove', event => {
      const x = event.clientX / innerWidth - .5;
      const y = event.clientY / innerHeight - .5;
      root.style.setProperty('--hero-x', `${x * -16}px`);
      root.style.setProperty('--hero-y', `${y * -12}px`);
      root.style.setProperty('--reactor-x', `${x * 36}px`);
      root.style.setProperty('--reactor-y', `${y * 28}px`);
      root.style.setProperty('--reactor-rx', `${y * -6}deg`);
      root.style.setProperty('--reactor-ry', `${x * 8}deg`);
      aura.style.transform = `translate(${event.clientX - 260}px,${event.clientY - 260}px)`;
    }, { passive: true });

    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        card.style.setProperty('--rx', `${y * -2.4}deg`);
        card.style.setProperty('--ry', `${x * 3.2}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
})();

(() => {
  const modules = [...document.querySelectorAll('[data-module]')];
  const readout = document.querySelector('[data-readout]');
  const content = {
    web: ['WEB SYSTEMS', 'Landing pages, Shopify customisation, and responsive portfolio experiences.'],
    growth: ['GROWTH SUPPORT', 'Audience-focused pages, foundational SEO, campaign assets, and enquiry flows.'],
    content: ['CONTENT ENGINE', 'Short-form editing, AIGC production, visual storytelling, and social assets.'],
    product: ['PRODUCT PROTOTYPES', 'Internal tools and early concepts shaped around practical business workflows.']
  };
  const show = module => {
    const item = content[module.dataset.module];
    modules.forEach(button => button.classList.toggle('active', button === module));
    readout.querySelector('small').textContent = 'MODULE ACTIVE';
    readout.querySelector('strong').textContent = item[0];
    readout.querySelector('p').textContent = item[1];
  };
  modules.forEach(module => {
    module.addEventListener('mouseenter', () => show(module));
    module.addEventListener('focus', () => show(module));
    module.addEventListener('click', () => show(module));
  });
})();

(() => {
  const system = document.querySelector('[data-reels]');
  if (!system) return;
  const frame = system.querySelector('iframe');
  const buttons = [...system.querySelectorAll('[data-reel]')];
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.setAttribute('aria-current', item === button ? 'true' : 'false'));
    frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.reel}?rel=0`;
  }));
})();

(() => {
  const viewer = document.querySelector('[data-image-viewer]');
  if (!viewer) return;
  const viewerImage = viewer.querySelector('[data-viewer-image]');
  const viewerCaption = viewer.querySelector('[data-viewer-caption]');
  const closeButton = viewer.querySelector('[data-viewer-close]');
  const openViewer = preview => {
    viewerImage.src = preview.currentSrc || preview.src;
    viewerImage.alt = preview.alt || 'Project preview';
    viewerCaption.textContent = preview.alt || '';
    viewer.showModal();
  };
  document.querySelectorAll('.projects .project-screen img').forEach(preview => {
    preview.closest('.project-screen')?.classList.add('has-zoom');
    preview.tabIndex = 0;
    preview.setAttribute('role', 'button');
    preview.setAttribute('aria-label', `Enlarge ${preview.alt || 'project preview'}`);
    preview.addEventListener('click', () => openViewer(preview));
    preview.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openViewer(preview);
      }
    });
  });
  closeButton.addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
})();
