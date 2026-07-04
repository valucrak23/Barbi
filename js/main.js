/**
 * Princess Club Web 2.0 — main.js
 */
const WA_NUMBER = '5491133942309';
const INSTAGRAM_URL = 'https://www.instagram.com/princessclubshows';

let shows = [];
let selectedShow = null;
let isNavOpen = false;

function buildWaUrl({ type, show, form, character, extra } = {}) {
  const base = `https://wa.me/${WA_NUMBER}`;
  let text = '¡Hola Princess Club! Quiero consultar por un show.';

  if (type === 'show' && show) {
    text = `Hola Princess Club, quiero consultar por el show de ${show.meta} (${show.title}). Mi fecha sería: ____ y el evento es en: ____.`;
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
  heroReserveBtn: document.getElementById('heroReserveBtn'),
  maquillajeBtn: document.getElementById('maquillajeBtn'),
  characterBtn: document.getElementById('characterBtn'),
  instagramBtn: document.getElementById('instagramBtn'),
  instagramBtnFooter: document.getElementById('instagramBtnFooter'),
  fabWa: document.getElementById('fabWa'),
  showsContainer: document.getElementById('showsContainer'),
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
  els.modalTitle.textContent = show.title;
  els.modalMeta.textContent = show.meta;
  els.modalPrice.textContent = show.price;

  els.modalActivities.innerHTML = '';
  (show.includes || []).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
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
    if (els.showsContainer) {
      els.showsContainer.innerHTML =
        '<p class="error-msg">No pudimos cargar los shows. Intentá de nuevo.</p>';
    }
  }
}

function renderShows() {
  if (!els.showsContainer) return;
  els.showsContainer.innerHTML = '';

  shows.forEach((show) => {
    const article = document.createElement('article');
    article.className = 'show-card';
    const previewIncludes = show.includes.slice(0, 3).map((i) => `<li>${i}</li>`).join('');
    const moreCount = show.includes.length - 3;

    article.innerHTML = `
      ${show.featured ? '<span class="badge">Recomendado</span>' : ''}
      <p class="show-card__meta">${show.meta}</p>
      <h3 class="show-card__title">${show.title}</h3>
      <p class="show-card__price">${show.price}</p>
      <ul class="show-card__includes">${previewIncludes}${moreCount > 0 ? `<li class="show-card__more">+ ${moreCount} más</li>` : ''}</ul>
      <div class="show-card__actions">
        <a class="btn btn-primary" href="${buildWaUrl({ type: 'show', show })}" target="_blank" rel="noopener noreferrer">Consultar este show</a>
        <button class="btn btn-secondary" type="button" data-show-id="${show.id}">Ver detalle</button>
      </div>
    `;

    els.showsContainer.appendChild(article);
  });

  els.showsContainer.querySelectorAll('[data-show-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const show = shows.find((s) => s.id === btn.dataset.showId);
      if (show) openModal(show);
    });
  });
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
  if (els.instagramBtn) els.instagramBtn.href = INSTAGRAM_URL;
  if (els.instagramBtnFooter) els.instagramBtnFooter.href = INSTAGRAM_URL;
}

function setupCharacterCards() {
  document.querySelectorAll('[data-character]').forEach((card) => {
    card.addEventListener('click', () => {
      const character = card.dataset.character;
      window.open(buildWaUrl({ type: 'character', character }), '_blank', 'noopener');
    });
  });
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
  await loadShows();

  els.navToggle?.addEventListener('click', toggleNav);
  els.navClose?.addEventListener('click', closeNav);
  els.navBackdrop?.addEventListener('click', closeNav);

  els.modalCloseBtn?.addEventListener('click', closeModal);
  els.modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
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
