/**
 * Princess Club — Imágenes del sitio (recortes opcionales + rutas legacy)
 */
const CROP_ROOT = 'assets/para-usar/crops';
const LEGACY_ROOT = 'assets/para-usar';

/** Rutas reales tras reorganización de carpetas */
const LEGACY_MAP = {
  'hero-princesas-hielo': `${LEGACY_ROOT}/Imagenes Princesas/hero-princesas-hielo.jpeg`,
  'reina-hielo-1': `${LEGACY_ROOT}/Imagenes Princesas/reina-hielo-1.jpeg`,
  'reina-hielo-2': `${LEGACY_ROOT}/Imagenes Princesas/reina-hielo-2.jpeg`,
  'show-sirena': `${LEGACY_ROOT}/Imagenes Princesas/show-sirena.jpeg`,
  'show-guerreras-kpop': `${LEGACY_ROOT}/Imagenes Princesas/show-guerreras-kpop.jpeg`,
  'guerreras-kpop-1': `${LEGACY_ROOT}/Imagenes Princesas/guerreras-kpop-1.jpeg`,
  'guerreras-kpop-2': `${LEGACY_ROOT}/Imagenes Princesas/guerreras-kpop-2.jpeg`,
  'maquillaje-artistico': `${LEGACY_ROOT}/Maquillaje/maquillaje-artistico.jpeg`,
  'galeria-evento-1': `${LEGACY_ROOT}/shows/galeria-evento-1.jpeg`,
  'galeria-evento-2': `${LEGACY_ROOT}/shows/galeria-evento-2.jpeg`,
};

const CROP_BY_CONTEXT = {
  hero: { mobile: 'vertical', desktop: 'horizontal' },
  card: { mobile: 'square' },
  gallery: { mobile: 'square' },
  maquillaje: { mobile: 'vertical', desktop: 'horizontal' },
  show: { mobile: 'square' },
  lightbox: { mobile: 'vertical' },
};

/** Codifica espacios y caracteres especiales en rutas (srcset rompe con espacios) */
function pcSafeUrl(path) {
  if (window.PCAssets?.pcSafeUrl) return window.PCAssets.pcSafeUrl(path);
  if (!path) return path;
  if (/^https?:\/\//i.test(path) || path.startsWith('//')) return path;
  return path
    .split('/')
    .map((segment) => (segment ? encodeURIComponent(decodeURIComponent(segment)) : segment))
    .join('/');
}

function srcsetValue(path) {
  /* Sin comillas: pcSafeUrl ya codifica espacios (%20); comillas en srcset
     provocaban 404 en desktop (%22 en la URL). */
  return `${pcSafeUrl(path)} 1x`;
}

function cropUrl(base, variant) {
  return `${CROP_ROOT}/${variant}/${base}.jpeg`;
}

function legacyUrl(base) {
  const mapped = window.PCAssets?.cropLegacy?.[base] || LEGACY_MAP[base];
  if (mapped) return mapped;
  return `${LEGACY_ROOT}/${base}.jpeg`;
}

function variantForContext(context, desktop = false) {
  const cfg = CROP_BY_CONTEXT[context] || CROP_BY_CONTEXT.card;
  if (desktop && cfg.desktop) return cfg.desktop;
  return cfg.mobile || cfg.desktop || 'square';
}

function applyLegacyImg(img, url) {
  if (!img || !url) return;
  img.classList.remove('has-crop');
  img.src = pcSafeUrl(url);
}

function applyLegacyPicture(picture, url) {
  if (!picture || !url) return;
  const source = picture.querySelector('source[media]');
  const img = picture.querySelector('img');
  if (source) source.srcset = srcsetValue(url);
  if (img) applyLegacyImg(img, url);
}

function upgradePicture(picture) {
  const base = picture.dataset.cropBase;
  if (!base) return;

  const legacy = legacyUrl(base);
  const source = picture.querySelector('source[media]');
  const img = picture.querySelector('img');

  if (source) source.srcset = srcsetValue(legacy);
  if (img) applyLegacyImg(img, legacy);
}

function upgradeImg(img) {
  const base = img.dataset.cropBase;
  if (!base) return;
  applyLegacyImg(img, legacyUrl(base));
}

function resolveForLightbox(img) {
  const media = window.PCAssets?.resolveMediaForLightbox?.(img);
  if (media) return media;

  const base = img?.dataset?.cropBase;
  if (!base) {
    const normalize = window.pcNormalizeAssetPath || pcSafeUrl;
    return normalize(img?.currentSrc || img?.src || '');
  }
  return pcSafeUrl(legacyUrl(base));
}

function initCropImages() {
  document.querySelectorAll('picture[data-crop-base]').forEach(upgradePicture);
  document.querySelectorAll('img[data-crop-base]').forEach((img) => {
    if (!img.closest('picture[data-crop-base]')) upgradeImg(img);
  });
}

window.CropImages = {
  cropUrl,
  legacyUrl,
  pcSafeUrl,
  resolveForLightbox,
  variantForContext,
  upgradePicture,
  upgradeImg,
  upgradeAll: initCropImages,
  upgradeIn(root) {
    if (!root) return;
    root.querySelectorAll('picture[data-crop-base]').forEach(upgradePicture);
    root.querySelectorAll('img[data-crop-base]').forEach((img) => {
      if (!img.closest('picture[data-crop-base]')) upgradeImg(img);
    });
  },
  init: initCropImages,
};

window.pcSafeUrl = pcSafeUrl;

document.addEventListener('DOMContentLoaded', initCropImages);
