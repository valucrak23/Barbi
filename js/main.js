/**
 * Princess Club Web 2.0 — main.js
 */
const WA_NUMBER = '5491133942309';
const INSTAGRAM_URL =
  'https://www.instagram.com/princessclubshows?igsh=MWQxeDkxOXNjdjF6aw==';

/** Recorte por show (variante square en cards) */
const SHOW_IMAGES = {
  '1p-15': { crop: 'reina-hielo-1', pos: 'img-pos-reina1', alt: 'Presencia mágica con Elsa (Frozen)' },
  '1p-35': { crop: 'hero-princesas-hielo', pos: 'img-pos-hero', alt: 'Show con Anna y Elsa (Frozen)' },
  '2p-20': { crop: 'reina-hielo-2', pos: 'img-pos-reina2', alt: 'Doble presencia mágica con Anna y Elsa' },
  '2p-45': { crop: 'hero-princesas-hielo', pos: 'img-pos-hero', alt: 'Show especial con Anna y Elsa (Frozen)' },
  '3p-45': { crop: 'show-guerreras-kpop', pos: 'img-pos-kpop-group', alt: 'Show con Rumi, Mira y Zoey — Guerreras K-Pop' },
};

let shows = [];
let selectedShow = null;
let isNavOpen = false;

function buildWaUrl({ type, show, pack, form, character, extra } = {}) {
  const base = `https://wa.me/${WA_NUMBER}`;
  let text = '¡Hola Princess Club! Quiero consultar por un show.';

  if (type === 'show' && show) {
    text = `Hola Princess Club, quiero consultar por el show de ${show.meta} (${show.title}). Mi fecha sería: ____ y el evento es en: ____.`;
  }
  if (type === 'pack' && pack) {
    text = `Hola Princess Club, quiero consultar por ${pack.label} ${pack.title}. Mi fecha sería: ____ y el evento es en: ____.`;
  }
  if (type === 'character') {
    text = `Hola Princess Club, quiero consultar disponibilidad del personaje o temática: ${character || 'a definir'}.`;
  }
  if (type === 'maquillaje') {
    text = 'Hola Princess Club, quiero consultar por maquillaje artístico para mi evento.';
  }
  if (type === 'form' && form) {
    text = [
      '¡Hola Princess Club, quiero consultar por un show!',
      '',
      `Nombre: ${form.name}`,
      `Fecha: ${form.date}`,
      `Zona: ${form.zone}`,
      `Show: ${form.show}`,
      `Personaje o temática: ${form.theme}`,
      `Cantidad aproximada de chicos: ${form.kids}`,
      form.message ? `Mensaje: ${form.message}` : '',
    ]
      .filter(Boolean)
      .join('\n');
  }
  if (extra) {
    text = extra;
  }

  return `${base}?text=${encodeURIComponent(text)}`;
}

const els = {
  navToggle: document.getElementById('navToggle'),
  navClose: document.getElementById('navClose'),
  navDrawer: document.getElementById('nav-drawer'),
  navBackdrop: document.getElementById('navBackdrop'),
  headerReserveBtn: document.getElementById('headerReserveBtn'),
  drawerReserveBtn: document.getElementById('drawerReserveBtn'),
  headerInstagramBtn: document.getElementById('headerInstagramBtn'),
  drawerInstagramBtn: document.getElementById('drawerInstagramBtn'),
  heroReserveBtn: document.getElementById('heroReserveBtn'),
  maquillajeBtn: document.getElementById('maquillajeBtn'),
  packsReserveBtn: document.getElementById('packsReserveBtn'),
  characterBtn: document.getElementById('characterBtn'),
  instagramBtn: document.getElementById('instagramBtn'),
  instagramBtnFooter: document.getElementById('instagramBtnFooter'),
  instagramProfileBtn: document.getElementById('instagramProfileBtn'),
  fabWa: document.getElementById('fabWa'),
  packsContainer: document.getElementById('packsContainer'),
  showsPricing: document.getElementById('showsPricing'),
  staffGrid: document.getElementById('staffGrid'),
  formError: document.getElementById('formError'),
  modal: document.getElementById('modal'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalTitle: document.getElementById('modalTitle'),
  modalMeta: document.getElementById('modalMeta'),
  modalPrice: document.getElementById('modalPrice'),
  modalActivities: document.getElementById('modalActivities'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalReserveBtn: document.getElementById('modalReserveBtn'),
  reserveForm: document.getElementById('reserveForm'),
  year: document.getElementById('year'),
  lightbox: document.getElementById('lightbox'),
  lightboxImg: document.getElementById('lightboxImg'),
  lightboxClose: document.getElementById('lightboxClose'),
};

function openNav() {
  isNavOpen = true;
  els.navDrawer.classList.add('is-open');
  els.navBackdrop.classList.add('is-visible');
  els.navToggle.setAttribute('aria-expanded', 'true');
  els.navDrawer.setAttribute('aria-hidden', 'false');
  els.navBackdrop.setAttribute('aria-hidden', 'false');
  document.body.classList.add('nav-open');
}

function closeNav() {
  isNavOpen = false;
  els.navDrawer.classList.remove('is-open');
  els.navBackdrop.classList.remove('is-visible');
  els.navToggle.setAttribute('aria-expanded', 'false');
  els.navDrawer.setAttribute('aria-hidden', 'true');
  els.navBackdrop.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('nav-open');
}

function toggleNav() {
  if (isNavOpen) closeNav();
  else openNav();
}

function openModal(show) {
  selectedShow = show;
  els.modalTitle.innerHTML = window.pcHeadingMark?.(show.title) || show.title;
  els.modalTitle.dataset.headingMarked = '1';
  els.modalMeta.textContent = show.meta;
  els.modalPrice.textContent = show.price;

  els.modalActivities.innerHTML = '';
  (show.includes || []).forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="include-icon" aria-hidden="true">✦</span>${item}`;
    els.modalActivities.appendChild(li);
  });

  els.modalReserveBtn.href = buildWaUrl({ type: 'show', show });
  els.modal.classList.add('is-open');
  els.modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  els.modalCloseBtn.focus();
}

function closeModal() {
  els.modal.classList.remove('is-open');
  els.modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  selectedShow = null;
}

async function loadShows() {
  try {
    const response = await fetch('./experiences.json');
    if (!response.ok) throw new Error('Network error');
    shows = await response.json();
    renderShows();
  } catch {
    if (els.showsPricing) {
      els.showsPricing.innerHTML =
        '<p class="error-msg">No pudimos cargar los shows. Intentá de nuevo.</p>';
    }
  }
}

function renderIncludeItem(item) {
  return `<li><span class="include-icon" aria-hidden="true">✦</span>${item}</li>`;
}

const SHOW_GROUPS = [
  { title: '1 personaje', ids: ['1p-15', '1p-35'] },
  { title: '2 personajes', ids: ['2p-20', '2p-45'] },
  { title: '3 personajes', ids: ['3p-45'] },
];

function formatShowDuration(meta) {
  const part = meta.split('·').map((s) => s.trim()).pop();
  return part || meta;
}

function formatIncludesList(items) {
  return items.join(', ').replace(/, ([^,]+)$/, ' y $1') + '.';
}

function renderPricingShowcase() {
  if (!els.showsPricing || !shows.length) return;
  els.showsPricing.innerHTML = '';
  els.showsPricing.className = 'pricing-showcase shows-accordion';

  SHOW_GROUPS.forEach((group) => {
    const groupShows = group.ids.map((id) => shows.find((s) => s.id === id)).filter(Boolean);
    if (!groupShows.length) return;

    const details = document.createElement('details');
    details.className = 'show-accord';

    const groupTitle = window.pcHeadingMark?.(group.title) || group.title;
    details.innerHTML = `
      <summary class="show-accord__summary">
        <h3 class="show-accord__title">
          ${groupTitle}
          <span class="pricing-sparkle" aria-hidden="true">✦</span>
        </h3>
        <span class="accord-chevron" aria-hidden="true"></span>
      </summary>
      <div class="show-accord__body"></div>
    `;

    const body = details.querySelector('.show-accord__body');

    groupShows.forEach((show) => {
      const duration = formatShowDuration(show.meta);
      const option = document.createElement('div');
      option.className = 'pricing-option';
      option.innerHTML = `
        <div class="pricing-option__body">
          <p class="pricing-option__text">
            <strong>Opción de ${duration}:</strong>
            incluye ${formatIncludesList(show.includes).replace(/\.$/, '')}.
          </p>
          <p class="pricing-option__note">Este precio incluye el viático dentro de CABA. Consultar por otras localidades.</p>
        </div>
        <div class="pricing-option__aside">
          ${show.featured ? '<span class="pricing-badge">Recomendado</span>' : ''}
          <span class="pricing-pill">${show.price}</span>
          <div class="pricing-option__actions">
            <a class="btn btn-primary btn-sm" href="${buildWaUrl({ type: 'show', show })}" target="_blank" rel="noopener noreferrer">Consultar</a>
            <button class="btn btn-ghost btn-sm" type="button" data-show-id="${show.id}">Ver detalle</button>
          </div>
        </div>
      `;
      body.appendChild(option);
    });

    els.showsPricing.appendChild(details);
  });

  window.pcInitAccordionGroup?.(els.showsPricing);
  window.pcApplyHeadingMarks?.(els.showsPricing);

  els.showsPricing.querySelectorAll('[data-show-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const show = shows.find((s) => s.id === btn.dataset.showId);
      if (show) openModal(show);
    });
  });
}

async function loadPacks() {
  if (!els.packsContainer) return;
  try {
    const response = await fetch('./packs.json');
    if (!response.ok) throw new Error('Network error');
    const packs = await response.json();
    renderPacks(packs);
  } catch {
    els.packsContainer.innerHTML = '<p class="error-msg">No pudimos cargar los packs.</p>';
  }
}

function renderStaff(data) {
  if (!els.staffGrid || !data?.members?.length) return;

  const folder = data.folder || 'Nosotras/Conocenos';
  els.staffGrid.innerHTML = '';
  els.staffGrid.className = 'staff-accordion';

  data.members.forEach((member) => {
    const details = document.createElement('details');
    details.className = 'staff-accord show-accord';

    const title = window.pcHeadingMark?.(member.name) || member.name;
    const subtitle = member.subtitle
      ? `<p class="staff-accord__subtitle">${member.subtitle}</p>`
      : '';

    details.innerHTML = `
      <summary class="show-accord__summary">
        <h3 class="show-accord__title">
          ${title}
          <span class="pricing-sparkle" aria-hidden="true">✦</span>
        </h3>
        <span class="accord-chevron" aria-hidden="true"></span>
      </summary>
      <div class="staff-accord__body">
        ${subtitle}
        <button type="button" class="staff-accord__media" data-lightbox aria-label="Ver foto completa de ${member.name}">
          <img
            class="img-cover-face"
            data-media-folder="${folder}"
            data-media-base="${member.base}"
            data-media-prefer="v"
            data-media-lightbox="v"
            alt="${member.name}, Princess Club"
            width="480"
            height="640"
            loading="lazy"
          >
        </button>
        <button type="button" class="btn btn-secondary btn-sm staff-accord__view" data-lightbox aria-label="Ver foto completa de ${member.name}">
          Ver completa
        </button>
      </div>
    `;

    els.staffGrid.appendChild(details);
  });

  window.pcInitAccordionGroup?.(els.staffGrid);
  window.pcApplyHeadingMarks?.(els.staffGrid);
  window.PCAssets?.initResponsiveMedia(els.staffGrid);

  els.staffGrid.querySelectorAll('details.staff-accord').forEach((details) => {
    details.addEventListener('toggle', () => {
      if (!details.open) return;
      requestAnimationFrame(() => {
        const img = details.querySelector('img[data-media-folder]');
        if (img) window.PCAssets?.bindResponsiveMediaImg(img);
      });
    });
  });

  bindLightbox(els.staffGrid);
}

async function loadStaff() {
  if (!els.staffGrid) return;
  try {
    const response = await fetch('./staff.json');
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    renderStaff(data);
  } catch {
    els.staffGrid.innerHTML = '<p class="error-msg">No pudimos cargar el staff.</p>';
  }
}

function renderPacks(packs) {
  if (!els.packsContainer) return;
  els.packsContainer.innerHTML = '';
  els.packsContainer.className = 'packs-grid packs-accordion';

  packs.forEach((pack) => {
    const details = document.createElement('details');
    details.className = 'pack-accord';

    const includesHtml = pack.includes
      .map((item) => `<li><span class="include-icon" aria-hidden="true">✦</span>${item}</li>`)
      .join('');

    const title = window.pcHeadingMark?.(pack.title) || pack.title;

    details.innerHTML = `
      <summary class="pack-accord__summary">
        <div class="pack-accord__head">
          <p class="pack-accord__label">${pack.label}</p>
          <h3 class="pack-accord__title">${title}</h3>
        </div>
        <span class="accord-chevron" aria-hidden="true"></span>
      </summary>
      <div class="pack-accord__body">
        <div class="pack-accord__divider" aria-hidden="true"><span>✦</span></div>
        <p class="pack-accord__intro">${pack.intro}</p>
        <ul class="pack-accord__includes">${includesHtml}</ul>
        ${pack.duration ? `<p class="pack-accord__duration"><strong>Duración:</strong> aprox. ${pack.duration}.</p>` : ''}
        <p class="pack-accord__ideal"><strong>Ideal para:</strong> ${pack.ideal}</p>
        <a class="btn btn-primary pack-accord__cta" href="${buildWaUrl({ type: 'pack', pack })}" target="_blank" rel="noopener noreferrer">Consultar ${pack.label.toLowerCase()}</a>
      </div>
    `;

    els.packsContainer.appendChild(details);
  });

  window.pcInitAccordionGroup?.(els.packsContainer);
  window.pcApplyHeadingMarks?.(els.packsContainer);
}

function renderShows() {
  renderPricingShowcase();
}

function updateActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  let activeId = 'inicio';

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.35 && rect.bottom > window.innerHeight * 0.2) {
      activeId = section.id;
    }
  });

  document.querySelectorAll('.nav-list li, .nav-drawer-list li').forEach((li) => {
    li.classList.remove('active');
    if (li.querySelector(`a[href="#${activeId}"]`)) li.classList.add('active');
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
      closeNav();
    });
  });

  const sectionEls = document.querySelectorAll('main section[id]');
  const observer = new IntersectionObserver(() => updateActiveNav(), {
    rootMargin: '-10% 0px -60% 0px',
    threshold: 0.1,
  });
  sectionEls.forEach((sec) => observer.observe(sec));

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 100);
  });

  updateActiveNav();
}

function setupScrollReveal() {
  const animated = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  animated.forEach((el) => observer.observe(el));
}

function setupFabScroll() {
  const hero = document.getElementById('inicio');
  if (!hero || !els.fabWa) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      els.fabWa.classList.toggle('is-visible', !entry.isIntersecting);
    },
    { threshold: 0.1 }
  );
  observer.observe(hero);
}

function showFormError(message) {
  if (!els.formError) return;
  els.formError.textContent = message;
  els.formError.hidden = false;
}

function clearFormError() {
  if (!els.formError) return;
  els.formError.textContent = '';
  els.formError.hidden = true;
}

function handleFormSubmit(e) {
  e.preventDefault();
  clearFormError();

  const name = document.getElementById('reserveName');
  const date = document.getElementById('reserveDate');
  const zone = document.getElementById('reserveZone');
  const showField = document.getElementById('reserveShow');
  const theme = document.getElementById('reserveTheme');
  const kids = document.getElementById('reserveKids');
  const message = document.getElementById('reserveMessage');

  const required = [
    { field: name, label: 'nombre' },
    { field: date, label: 'fecha del evento' },
    { field: zone, label: 'zona o barrio' },
    { field: showField, label: 'show' },
    { field: theme, label: 'personaje o temática' },
  ];

  let firstInvalid = null;
  required.forEach(({ field, label }) => {
    if (!field.value.trim()) {
      field.setAttribute('aria-invalid', 'true');
      if (!firstInvalid) firstInvalid = label;
    } else {
      field.removeAttribute('aria-invalid');
    }
  });

  if (firstInvalid) {
    showFormError(`Completá ${firstInvalid === 'nombre' ? 'tu nombre' : 'el campo ' + firstInvalid} para enviar la consulta.`);
    required.find(({ label }) => label === firstInvalid)?.field.focus();
    return;
  }

  const url = buildWaUrl({
    type: 'form',
    form: {
      name: name.value.trim(),
      date: date.value.trim(),
      zone: zone.value.trim(),
      show: showField.value.trim(),
      theme: theme.value.trim(),
      kids: kids.value.trim() || 'A confirmar',
      message: message.value.trim(),
    },
  });
  window.open(url, '_blank', 'noopener');
}

function setupWaLinks() {
  const generic = buildWaUrl();
  if (els.headerReserveBtn) els.headerReserveBtn.href = generic;
  if (els.drawerReserveBtn) els.drawerReserveBtn.href = generic;
  if (els.heroReserveBtn) els.heroReserveBtn.href = generic;
  if (els.fabWa) els.fabWa.href = generic;
  if (els.characterBtn) els.characterBtn.href = buildWaUrl({ type: 'character' });
  if (els.maquillajeBtn) els.maquillajeBtn.href = buildWaUrl({ type: 'maquillaje' });
  if (els.packsReserveBtn) {
    els.packsReserveBtn.href = buildWaUrl({
      extra: '¡Hola Princess Club! Quiero consultar por sus packs y experiencias especiales.',
    });
  }
  if (els.instagramBtn) els.instagramBtn.href = INSTAGRAM_URL;
  if (els.instagramBtnFooter) els.instagramBtnFooter.href = INSTAGRAM_URL;
  if (els.instagramProfileBtn) els.instagramProfileBtn.href = INSTAGRAM_URL;
  if (els.headerInstagramBtn) els.headerInstagramBtn.href = INSTAGRAM_URL;
  if (els.drawerInstagramBtn) els.drawerInstagramBtn.href = INSTAGRAM_URL;
}

function setupCharacterCards() {
  document.querySelectorAll('[data-character]:not(.character-showcase__cta)').forEach((card) => {
    card.addEventListener('click', () => {
      const character = card.dataset.character;
      window.open(buildWaUrl({ type: 'character', character }), '_blank', 'noopener');
    });
  });
}

function openLightbox(img) {
  if (!els.lightbox || !els.lightboxImg || !img) return;
  const normalize = window.pcNormalizeAssetPath || window.pcSafeUrl || ((p) => p);
  const rawSrc = img.currentSrc || img.src || '';
  const resolved =
    window.PCAssets?.resolveMediaForLightbox?.(img) ||
    window.CropImages?.resolveForLightbox(img) ||
    normalize(rawSrc);

  els.lightboxImg.src = resolved;
  els.lightboxImg.onerror = () => {
    const fallback = normalize(rawSrc);
    if (fallback && els.lightboxImg.src !== fallback) {
      els.lightboxImg.src = fallback;
    }
    els.lightboxImg.onerror = null;
  };
  els.lightboxImg.alt = img.alt;
  els.lightboxImg.className = 'lightbox__img';
  els.lightbox.classList.add('is-open');
  els.lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  els.lightboxClose?.focus();
}

function closeLightbox() {
  if (!els.lightbox || !els.lightboxImg) return;
  els.lightbox.classList.remove('is-open');
  els.lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  els.lightboxImg.src = '';
  els.lightboxImg.alt = '';
}

function bindLightbox(root = document) {
  root.querySelectorAll('[data-lightbox]').forEach((trigger) => {
    if (trigger.dataset.lightboxBound) return;
    trigger.dataset.lightboxBound = '1';
    trigger.addEventListener('click', () => {
      const img =
        trigger.querySelector('img') ||
        trigger.closest('.staff-accord__body, .photo-grid__item')?.querySelector('img');
      if (img) openLightbox(img);
    });
  });
}

function setupLightbox() {
  bindLightbox(document);

  els.lightboxClose?.addEventListener('click', closeLightbox);
  els.lightbox?.addEventListener('click', (e) => {
    if (e.target === els.lightbox || e.target.classList.contains('lightbox__stage')) closeLightbox();
  });
}

function setupInstagramEmbed() {
  const wrap = document.getElementById('instagramEmbedWrap');
  const iframe = document.getElementById('instagramEmbed');
  const fallback = document.getElementById('instagramFallback');
  if (!iframe || !wrap) return;

  const embedUrl = iframe.dataset.src || 'https://www.instagram.com/princessclubshows/embed/';

  const showFallback = () => {
    wrap.hidden = true;
    if (fallback) {
      fallback.hidden = false;
      window.PCAssets?.initResponsiveMedia(fallback);
    }
  };

  const loadEmbed = () => {
    if (iframe.src) return;
    iframe.src = embedUrl;

    iframe.addEventListener(
      'load',
      () => {
        window.setTimeout(() => {
          if (iframe.offsetHeight < 120) showFallback();
        }, 3000);
      },
      { once: true }
    );

    window.setTimeout(() => {
      if (!iframe.offsetHeight || iframe.offsetHeight < 120) showFallback();
    }, 6000);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadEmbed();
          observer.disconnect();
        }
      },
      { rootMargin: '240px' }
    );
    observer.observe(wrap);
  } else {
    loadEmbed();
  }
}

function checkLargeText() {
  const probe = document.createElement('span');
  probe.style.cssText = 'position:absolute;visibility:hidden;font-size:1rem';
  probe.textContent = 'M';
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height;
  probe.remove();
  document.body.classList.toggle('a11y-large-text', px >= 20);
}

document.addEventListener('DOMContentLoaded', async () => {
  if (els.year) els.year.textContent = new Date().getFullYear();

  setupWaLinks();
  setupCharacterCards();
  setupLightbox();
  setupInstagramEmbed();
  await loadShows();
  await loadPacks();
  await loadStaff();

  els.navToggle?.addEventListener('click', toggleNav);
  els.navClose?.addEventListener('click', closeNav);
  els.navBackdrop?.addEventListener('click', closeNav);

  els.modalCloseBtn?.addEventListener('click', closeModal);
  els.modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (els.lightbox?.classList.contains('is-open')) closeLightbox();
      if (els.modal?.classList.contains('is-open')) closeModal();
      if (isNavOpen) closeNav();
    }
  });

  els.reserveForm?.addEventListener('submit', handleFormSubmit);

  setupSmoothScroll();
  setupScrollReveal();
  setupFabScroll();
  checkLargeText();

  let a11yTimer;
  const onViewportChange = () => {
    clearTimeout(a11yTimer);
    a11yTimer = setTimeout(checkLargeText, 150);
  };
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', onViewportChange);
});
