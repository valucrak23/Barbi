/**
 * Princess Club — Rutas de assets reorganizados + imágenes h/v/c
 */
const PC_ASSETS = 'assets/para-usar';

const PC_FRAME_SELECTORS = [
  '.photo-grid__item',
  '.aspect-hero',
  '.aspect-gallery',
  '.aspect-card',
  '.aspect-card--wide',
  '.staff-accord__media',
  '.media-carousel__slide',
  '.show-card__media',
  '.pricing-option__media',
];

function pcSafeUrl(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) return path;
  if (path.startsWith('data:') || path.startsWith('blob:')) return path;
  return path
    .split('/')
    .map((segment) => {
      if (!segment) return segment;
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join('/');
}

/** Convierte URL absoluta del mismo origen a ruta relativa segura */
function pcNormalizeAssetPath(path) {
  if (!path) return path;
  if (/^https?:\/\//i.test(path)) {
    try {
      const u = new URL(path, window.location.origin);
      if (u.origin === window.location.origin) {
        const relative = decodeURIComponent(u.pathname).replace(/^\//, '');
        return pcSafeUrl(relative);
      }
      return path;
    } catch {
      return path;
    }
  }
  return pcSafeUrl(path);
}

const PC_PATHS = {
  logos: {
    secondary: pcSafeUrl(`${PC_ASSETS}/Logos/princessclub_logo-secundario.png`),
    main: pcSafeUrl(`${PC_ASSETS}/Logos/PRINCESSCLUB_PNG.png`),
    white: pcSafeUrl(`${PC_ASSETS}/Logos/PRINCESSCLUB_BLANCO.png`),
  },
  iconos: {
    eventos: pcSafeUrl(`${PC_ASSETS}/Iconos/elementos_Eventos.png`),
    princesas: pcSafeUrl(`${PC_ASSETS}/Iconos/elementos_Princesas.png`),
    opiniones: pcSafeUrl(`${PC_ASSETS}/Iconos/elementos_Opiniones.png`),
    contacto: pcSafeUrl(`${PC_ASSETS}/Iconos/elementos_Contacto.png`),
    preguntas: pcSafeUrl(`${PC_ASSETS}/Iconos/preguntas.png`),
    pattern: pcSafeUrl(`${PC_ASSETS}/Iconos/pattern.png`),
  },
  fotos: {
    hero: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/hero-princesas-hielo.jpeg`),
    reina1: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/reina-hielo-1.jpeg`),
    reina2: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/reina-hielo-2.jpeg`),
    sirena: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/show-sirena.jpeg`),
    kpop: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/show-guerreras-kpop.jpeg`),
    kpop1: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/guerreras-kpop-1.jpeg`),
    kpop2: pcSafeUrl(`${PC_ASSETS}/Imagenes Princesas/guerreras-kpop-2.jpeg`),
    maquillaje: pcSafeUrl(`${PC_ASSETS}/Maquillaje/maquillaje-artistico.jpeg`),
    evento1: pcSafeUrl(`${PC_ASSETS}/shows/galeria-evento-1.jpeg`),
    evento2: pcSafeUrl(`${PC_ASSETS}/shows/galeria-evento-2.jpeg`),
  },
};

const PC_CROP_LEGACY = {
  'hero-princesas-hielo': `${PC_ASSETS}/Imagenes Princesas/hero-princesas-hielo.jpeg`,
  'reina-hielo-1': `${PC_ASSETS}/Imagenes Princesas/reina-hielo-1.jpeg`,
  'reina-hielo-2': `${PC_ASSETS}/Imagenes Princesas/reina-hielo-2.jpeg`,
  'show-sirena': `${PC_ASSETS}/Imagenes Princesas/show-sirena.jpeg`,
  'show-guerreras-kpop': `${PC_ASSETS}/Imagenes Princesas/show-guerreras-kpop.jpeg`,
  'guerreras-kpop-1': `${PC_ASSETS}/Imagenes Princesas/guerreras-kpop-1.jpeg`,
  'guerreras-kpop-2': `${PC_ASSETS}/Imagenes Princesas/guerreras-kpop-2.jpeg`,
  'maquillaje-artistico': `${PC_ASSETS}/Maquillaje/maquillaje-artistico.jpeg`,
  'galeria-evento-1': `${PC_ASSETS}/shows/galeria-evento-1.jpeg`,
  'galeria-evento-2': `${PC_ASSETS}/shows/galeria-evento-2.jpeg`,
};

const PC_MEDIA_DESKTOP_BP = 1024;
const PC_MEDIA_TABLET_BP = 768;

/** Fallback por viewport si no hay marco medible */
function pcMediaVariant() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const landscape = w >= h;

  if (w >= PC_MEDIA_DESKTOP_BP) return 'h';
  if (landscape && w >= 640) return 'h';
  if (w >= PC_MEDIA_TABLET_BP) return 'c';
  if (landscape && w >= 480) return 'c';
  return 'v';
}

function pcAspectRatioFromElement(el) {
  if (!el) return null;
  const style = getComputedStyle(el);
  const ar = style.aspectRatio;
  if (ar && ar !== 'auto') {
    const parts = ar.split('/').map((part) => parseFloat(part.trim()));
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
      return parts[0] / parts[1];
    }
  }
  return null;
}

/** h = marco apaisado, v = vertical, c = cuadrado */
function pcVariantFromRatio(ratio) {
  if (ratio > 1.1) return 'h';
  if (ratio < 0.92) return 'v';
  return 'c';
}

function pcFindMediaFrame(img) {
  if (!img) return null;
  for (const selector of PC_FRAME_SELECTORS) {
    const frame = img.closest(selector);
    if (frame) return frame;
  }
  return img.parentElement;
}

function pcMediaVariantFromFrame(frameEl) {
  if (!frameEl) return pcMediaVariant();

  const cssRatio = pcAspectRatioFromElement(frameEl);
  const w = frameEl.clientWidth;
  const h = frameEl.clientHeight;

  if (w > 0 && h > 0) {
    return pcVariantFromRatio(w / h);
  }

  if (cssRatio) {
    return pcVariantFromRatio(cssRatio);
  }

  return pcMediaVariant();
}

function pcMediaUrl(folder, base, variant) {
  return pcSafeUrl(`${PC_ASSETS}/${folder}/${base}-${variant}.jpeg`);
}

function pcMediaFallbackOrder(preferred) {
  if (preferred === 'h') return ['h', 'c', 'v'];
  if (preferred === 'c') return ['c', 'v', 'h'];
  return ['v', 'c', 'h'];
}

function pcMediaCandidateUrls(folder, base, preferredVariant) {
  const order = pcMediaFallbackOrder(preferredVariant ?? pcMediaVariant());
  const urls = order.map((variant) => pcMediaUrl(folder, base, variant));
  urls.push(pcSafeUrl(`${PC_ASSETS}/${folder}/${base}-original.jpeg`));
  urls.push(pcSafeUrl(`${PC_ASSETS}/${folder}/${base}.jpeg`));
  return [...new Set(urls)];
}

function resolveMediaForLightbox(img) {
  const folder = img?.dataset?.mediaFolder;
  const base = img?.dataset?.mediaBase;
  if (!folder || !base) return null;
  const prefer = img.dataset.mediaLightbox || img.dataset.mediaPrefer || 'h';
  const variant = ['h', 'v', 'c'].includes(prefer) ? prefer : 'h';
  return pcMediaCandidateUrls(folder, base, variant)[0];
}

function bindResponsiveMediaImg(img) {
  const folder = img.dataset.mediaFolder;
  const base = img.dataset.mediaBase;
  if (!folder || !base) return;

  if (img._mediaApply) {
    img._mediaApply(true);
    return;
  }

  const frame = pcFindMediaFrame(img);
  let activeVariant = null;
  let loadingToken = 0;

  const apply = (forceReload = false) => {
    const forcedPrefer = img.dataset.mediaPrefer;
    const variant =
      forcedPrefer && ['h', 'v', 'c'].includes(forcedPrefer)
        ? forcedPrefer
        : pcMediaVariantFromFrame(frame);

    if (!forceReload && variant === activeVariant && img.classList.contains('is-loaded') && img.src) {
      return;
    }

    activeVariant = variant;
    img.dataset.mediaVariant = variant;

    const candidates = pcMediaCandidateUrls(folder, base, variant);
    let index = 0;
    const token = ++loadingToken;

    const tryNext = () => {
      if (token !== loadingToken) return;
      if (index >= candidates.length) return;

      const url = candidates[index];
      img.onload = () => {
        if (token !== loadingToken) return;
        img.onerror = null;
        img.classList.add('is-loaded');
      };

      img.onerror = () => {
        if (token !== loadingToken) return;
        img.onload = null;
        index += 1;
        tryNext();
      };

      img.classList.remove('is-loaded');
      img.src = url;
    };

    tryNext();
  };

  img._mediaApply = apply;
  apply();

  if (img.dataset.mediaResizeBound) return;
  img.dataset.mediaResizeBound = '1';

  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(() => apply(true), 80);
  };

  window.addEventListener('resize', schedule);
  window.addEventListener('orientationchange', schedule);

  if (frame && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(schedule);
    observer.observe(frame);
    img._mediaFrameObserver = observer;
  }
}

function initResponsiveMedia(root = document) {
  root.querySelectorAll('img[data-media-folder][data-media-base]').forEach(bindResponsiveMediaImg);
}

window.PCAssets = {
  root: PC_ASSETS,
  paths: PC_PATHS,
  cropLegacy: PC_CROP_LEGACY,
  pcSafeUrl,
  normalizePath: pcNormalizeAssetPath,
  mediaUrl: pcMediaUrl,
  mediaVariant: pcMediaVariant,
  mediaVariantFromFrame: pcMediaVariantFromFrame,
  mediaCandidates: pcMediaCandidateUrls,
  resolveMediaForLightbox,
  bindResponsiveMediaImg,
  initResponsiveMedia,
};

window.pcSafeUrl = pcSafeUrl;
window.pcNormalizeAssetPath = pcNormalizeAssetPath;

document.addEventListener('DOMContentLoaded', () => initResponsiveMedia());
