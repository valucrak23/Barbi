/**
 * Princess Club Web 2.0 — main.js
 */
const WA_NUMBER = '5491133942309';
const FEATURED_ID = 'sueno-princesa';

let experiences = [];
let selectedExp = null;
let isNavOpen = false;

function buildWaUrl({ type, name, duration, form } = {}) {
  const base = `https://wa.me/${WA_NUMBER}`;
  let text = '¡Hola! Quiero reservar con Princess Club.';

  if (type === 'pkg') {
    text = `¡Hola! Quiero reservar el ${name}${duration ? ` (${duration})` : ''}.`;
  }
  if (type === 'video') {
    text = '¡Hola! Quiero encargar un Video de Felicitación personalizado.';
  }
  if (type === 'form' && form) {
    text = `¡Hola! Soy ${form.name}. Email: ${form.email}. ${form.message}`;
  }
  if (type === 'opinion') {
    text = '¡Hola! Quiero dejar mi opinión sobre el show de Princess Club.';
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
  videoReserveBtn: document.getElementById('videoReserveBtn'),
  opinionBtn: document.getElementById('opinionBtn'),
  fabWa: document.getElementById('fabWa'),
  experiencesContainer: document.getElementById('experiencesContainer'),
  modal: document.getElementById('modal'),
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalTitle: document.getElementById('modalTitle'),
  modalDuration: document.getElementById('modalDuration'),
  modalActivities: document.getElementById('modalActivities'),
  modalExtra: document.getElementById('modalExtra'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalReserveBtn: document.getElementById('modalReserveBtn'),
  reserveForm: document.getElementById('reserveForm'),
  galleryTrack: document.getElementById('galleryTrack'),
  galleryPrev: document.getElementById('galleryPrev'),
  galleryNext: document.getElementById('galleryNext'),
  galleryDots: document.getElementById('galleryDots'),
  testimonialsTrack: document.getElementById('testimonialsTrack'),
  testimonialsDots: document.getElementById('testimonialsDots'),
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

function openModal(exp) {
  selectedExp = exp;
  els.modalTitle.textContent = exp.title;
  els.modalDuration.textContent = exp.duration ? `Duración: ${exp.duration}` : '';
  els.modalDuration.hidden = !exp.duration;

  els.modalActivities.innerHTML = '';
  (exp.activities || []).forEach((activity) => {
    const li = document.createElement('li');
    li.textContent = activity;
    els.modalActivities.appendChild(li);
  });

  if (exp.extra) {
    els.modalExtra.textContent = exp.extra;
    els.modalExtra.hidden = false;
  } else {
    els.modalExtra.textContent = '';
    els.modalExtra.hidden = true;
  }

  els.modalReserveBtn.href = buildWaUrl({ type: 'pkg', name: exp.title, duration: exp.duration });
  els.modal.classList.add('is-open');
  els.modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  els.modalCloseBtn.focus();
}

function closeModal() {
  els.modal.classList.remove('is-open');
  els.modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  selectedExp = null;
}

async function loadExperiences() {
  try {
    const response = await fetch('./experiences.json');
    if (!response.ok) throw new Error('Network error');
    experiences = await response.json();
    renderExperiences();
  } catch {
    if (els.experiencesContainer) {
      els.experiencesContainer.innerHTML =
        '<p class="error-msg">No pudimos cargar las experiencias. Intentá de nuevo.</p>';
    }
  }
}

function renderExperiences() {
  if (!els.experiencesContainer) return;
  els.experiencesContainer.innerHTML = '';

  experiences.forEach((exp) => {
    const article = document.createElement('article');
    article.className = 'exp-card';
    const isFeatured = exp.id === FEATURED_ID;
    const durationHtml = exp.duration
      ? `<span class="duration-pill">⏱ ${exp.duration}</span>`
      : '';

    article.innerHTML = `
      ${isFeatured ? '<span class="badge">Más elegido</span>' : ''}
      <h3 class="exp-card__title">${exp.title}</h3>
      ${durationHtml}
      <p class="exp-card__tagline">${exp.tagline}</p>
      <div class="exp-card__actions">
        <a class="btn btn-primary" href="${buildWaUrl({ type: 'pkg', name: exp.title, duration: exp.duration })}" target="_blank" rel="noopener noreferrer">Reservar</a>
        <button class="btn btn-secondary" type="button" data-exp-id="${exp.id}">Ver detalle</button>
      </div>
    `;

    els.experiencesContainer.appendChild(article);
  });

  els.experiencesContainer.querySelectorAll('[data-exp-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const exp = experiences.find((e) => e.id === btn.dataset.expId);
      if (exp) openModal(exp);
    });
  });
}

function createCarousel({ track, dotsContainer, prevBtn, nextBtn, slideSelector }) {
  if (!track) return null;

  const slides = track.querySelectorAll(slideSelector);
  const count = slides.length;
  if (count === 0) return null;

  let index = 0;

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot${i === index ? ' is-active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }
  }

  function goTo(i) {
    index = ((i % count) + count) % count;
    update();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  renderDots();
  update();

  let startX = 0;
  let tracking = false;
  const wrapper = track.parentElement;

  wrapper.addEventListener(
    'touchstart',
    (e) => {
      tracking = true;
      startX = e.touches[0].clientX;
    },
    { passive: true }
  );

  wrapper.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return;
      tracking = false;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) next();
        else prev();
      }
    },
    { passive: true }
  );

  return { next, prev, goTo };
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

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('reserveName');
  const email = document.getElementById('reserveEmail');
  const message = document.getElementById('reserveMessage');

  let valid = true;
  [name, email, message].forEach((field) => {
    if (!field.value.trim()) {
      field.setAttribute('aria-invalid', 'true');
      valid = false;
    } else {
      field.removeAttribute('aria-invalid');
    }
  });

  if (!valid) return;

  const url = buildWaUrl({
    type: 'form',
    form: {
      name: name.value.trim(),
      email: email.value.trim(),
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
  if (els.videoReserveBtn) els.videoReserveBtn.href = buildWaUrl({ type: 'video' });
  if (els.opinionBtn) els.opinionBtn.href = buildWaUrl({ type: 'opinion' });
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
  await loadExperiences();

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

  createCarousel({
    track: els.galleryTrack,
    dotsContainer: els.galleryDots,
    prevBtn: els.galleryPrev,
    nextBtn: els.galleryNext,
    slideSelector: '.gallery-slide',
  });

  createCarousel({
    track: els.testimonialsTrack,
    dotsContainer: els.testimonialsDots,
    prevBtn: null,
    nextBtn: null,
    slideSelector: '.testimonial',
  });

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
