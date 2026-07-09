/**
 * Princess Club — Tema claro/oscuro
 * Default: preferencia del sistema (sin data-theme en html)
 * Toggle manual: guarda en localStorage y setea data-theme
 */
const THEME_STORAGE_KEY = 'pc-theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY);
}

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') return stored;
  return getSystemTheme();
}

function applyThemeAttribute() {
  const stored = getStoredTheme();
  const root = document.documentElement;
  if (stored === 'light' || stored === 'dark') {
    root.setAttribute('data-theme', stored);
  } else {
    root.removeAttribute('data-theme');
  }
}

function updateThemeToggleButtons() {
  const effective = getEffectiveTheme();
  const label =
    effective === 'dark'
      ? 'Activar modo claro'
      : 'Activar modo oscuro';

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.setAttribute('aria-pressed', effective === 'dark' ? 'true' : 'false');
    btn.setAttribute('title', label);
  });
}

function toggleTheme() {
  const next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyThemeAttribute();
  updateThemeToggleButtons();
}

function initTheme() {
  applyThemeAttribute();
  updateThemeToggleButtons();

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!getStoredTheme()) {
      updateThemeToggleButtons();
    }
  });
}

/* Aplicar preferencia guardada antes del primer paint (anti-FOUC) */
(function applyThemeEarly() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }
})();

document.addEventListener('DOMContentLoaded', initTheme);
