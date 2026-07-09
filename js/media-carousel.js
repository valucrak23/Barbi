/**
 * Princess Club — Carrusel genérico (personajes: fotos + videos)
 */
function initMediaCarousel(root) {
  const track = root.querySelector('[data-media-track]');
  const dotsHost = root.querySelector('[data-media-dots]');
  const prevBtn = root.querySelector('.media-carousel__btn--prev');
  const nextBtn = root.querySelector('.media-carousel__btn--next');
  const slides = track ? [...track.children] : [];
  if (!track || !dotsHost || !prevBtn || !nextBtn || !slides.length) return;

  dotsHost.innerHTML = '';
  const dotButtons = slides.map((slide, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'media-carousel__dot';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', slide.getAttribute('aria-label') || `Slide ${index + 1}`);
    btn.dataset.index = String(index);
    dotsHost.appendChild(btn);
    return btn;
  });

  track.querySelectorAll('img[data-media-folder][data-media-base]').forEach((img) => {
    window.PCAssets?.bindResponsiveMediaImg(img);
  });

  let activeIndex = 0;
  let touchStartX = 0;

  function pauseVideos(exceptSlide) {
    track.querySelectorAll('video').forEach((video) => {
      if (!exceptSlide || !exceptSlide.contains(video)) {
        video.pause();
      }
    });
  }

  function setSlide(index) {
    const total = slides.length;
    activeIndex = (index + total) % total;
    track.style.transform = `translateX(-${activeIndex * 100}%)`;

    dotButtons.forEach((dot, i) => {
      const isActive = i === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      dot.tabIndex = isActive ? 0 : -1;
    });

    pauseVideos(slides[activeIndex]);
    prevBtn.disabled = total <= 1;
    nextBtn.disabled = total <= 1;
  }

  prevBtn.addEventListener('click', () => setSlide(activeIndex - 1));
  nextBtn.addEventListener('click', () => setSlide(activeIndex + 1));

  dotButtons.forEach((dot) => {
    dot.addEventListener('click', () => setSlide(Number(dot.dataset.index)));
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setSlide(activeIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setSlide(activeIndex + 1);
    }
  });

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) < 48) return;
    if (delta < 0) setSlide(activeIndex + 1);
    else setSlide(activeIndex - 1);
  }, { passive: true });

  setSlide(0);
}

function buildCharacterSlidePhoto(char, photoBase) {
  const slide = document.createElement('figure');
  slide.className = 'media-carousel__slide media-carousel__slide--photo';
  slide.setAttribute('aria-label', `${char.title} — foto`);

  const img = document.createElement('img');
  img.className = 'media-carousel__img';
  img.dataset.mediaFolder = char.folder;
  img.dataset.mediaBase = photoBase;
  img.alt = `${char.title} — Princess Club`;
  img.loading = 'lazy';
  img.decoding = 'async';

  slide.appendChild(img);
  return slide;
}

function buildCharacterSlideVideo(char, video) {
  const slide = document.createElement('figure');
  slide.className = 'media-carousel__slide media-carousel__slide--video';
  slide.setAttribute('aria-label', video.label || `${char.title} — video`);

  const videoEl = document.createElement('video');
  videoEl.className = 'media-carousel__video';
  videoEl.controls = true;
  videoEl.playsInline = true;
  videoEl.preload = 'metadata';
  videoEl.setAttribute('aria-label', video.label || `Video de ${char.title}`);

  const source = document.createElement('source');
  source.src = (window.pcSafeUrl || ((p) => p))(`${window.PCAssets?.root || 'assets/para-usar'}/${video.src}`);
  source.type = 'video/mp4';
  videoEl.appendChild(source);

  slide.appendChild(videoEl);
  return slide;
}

function renderCharacterBlock(char) {
  const block = document.createElement('details');
  block.className = 'character-accord character-showcase';
  block.id = `personaje-${char.id}`;

  const title = window.pcHeadingMark?.(char.title) || char.title;

  const summary = document.createElement('summary');
  summary.className = 'character-accord__summary';
  summary.innerHTML = `
    <div class="character-accord__head">
      <h3 class="character-showcase__title">${title}</h3>
      <p class="character-showcase__subtitle">${char.subtitle}</p>
    </div>
    <span class="accord-chevron" aria-hidden="true"></span>
  `;
  block.appendChild(summary);

  const body = document.createElement('div');
  body.className = 'character-accord__body';

  const carousel = document.createElement('div');
  carousel.className = 'media-carousel';
  carousel.setAttribute('aria-roledescription', 'carrusel');
  carousel.setAttribute('aria-label', `Fotos y videos de ${char.title}`);
  carousel.tabIndex = 0;

  const track = document.createElement('div');
  track.className = 'media-carousel__track';
  track.dataset.mediaTrack = '';

  char.photos.forEach((photo) => {
    track.appendChild(buildCharacterSlidePhoto(char, photo));
  });

  (char.videos || []).forEach((video) => {
    track.appendChild(buildCharacterSlideVideo(char, video));
  });

  carousel.innerHTML = `
    <div class="media-carousel__viewport">
    </div>
    <div class="media-carousel__controls">
      <button type="button" class="media-carousel__btn media-carousel__btn--prev" aria-label="Anterior">‹</button>
      <div class="media-carousel__dots" data-media-dots role="tablist"></div>
      <button type="button" class="media-carousel__btn media-carousel__btn--next" aria-label="Siguiente">›</button>
    </div>
  `;

  carousel.querySelector('.media-carousel__viewport').appendChild(track);
  body.appendChild(carousel);

  const cta = document.createElement('a');
  cta.className = 'btn btn-secondary character-showcase__cta';
  cta.href = typeof buildWaUrl === 'function'
    ? buildWaUrl({ type: 'character', character: char.waName })
    : '#';
  cta.target = '_blank';
  cta.rel = 'noopener noreferrer';
  cta.textContent = `Consultar ${char.title}`;
  body.appendChild(cta);

  block.appendChild(body);

  return block;
}

async function initCharacterShowcases() {
  const host = document.getElementById('charactersShowcase');
  if (!host) return;

  let characters = [];
  try {
    const res = await fetch('./characters.json');
    if (res.ok) characters = await res.json();
  } catch {
    host.innerHTML = '<p class="error-msg">No pudimos cargar los personajes.</p>';
    return;
  }

  host.innerHTML = '';
  characters.forEach((char) => {
    const block = renderCharacterBlock(char);
    host.appendChild(block);
    initMediaCarousel(block.querySelector('.media-carousel'));
  });

  window.pcInitAccordionGroup?.(host);
  window.pcApplyHeadingMarks?.(host);
}

document.addEventListener('DOMContentLoaded', initCharacterShowcases);
