/**
 * Bright Retro no incluye tildes — vocal base + acento en Garet encima.
 */
const PC_ACCENT_BASE = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ñ: 'n',
  Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ñ: 'N',
};

function pcHeadingMark(text) {
  if (!text) return '';
  return String(text).replace(/[áéíóúñÁÉÍÓÚÑ]/g, (ch) => {
    const base = PC_ACCENT_BASE[ch] || ch;
    const isEnye = ch === 'ñ' || ch === 'Ñ';
    const tick = isEnye ? '~' : '´';
    const cls = isEnye ? 'mark-vowel mark-vowel--enye' : 'mark-vowel mark-vowel--accent';
    return `<span class="${cls}"><span class="mark-vowel__base">${base}</span><span class="mark-vowel__tick" aria-hidden="true">${tick}</span></span>`;
  });
}

function pcMarkHeadingElement(el) {
  if (!el || el.dataset.headingMarked) return;

  const original = el.textContent.replace(/\s+/g, ' ').trim();
  if (original && /[áéíóúñÁÉÍÓÚÑ]/.test(original)) {
    el.setAttribute('aria-label', original);
  }

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach((node) => {
    const raw = node.textContent;
    if (!raw || !/[áéíóúñÁÉÍÓÚÑ]/.test(raw)) return;
    const wrapper = document.createElement('span');
    wrapper.innerHTML = pcHeadingMark(raw);
    node.replaceWith(wrapper);
  });

  el.dataset.headingMarked = '1';
}

function pcApplyHeadingMarks(root = document) {
  root.querySelectorAll(
    '.section-title, .hero-title, .pricing-group__title, .show-accord__title, .pack-accord__title, .character-showcase__title, .modal-title'
  ).forEach(pcMarkHeadingElement);
}

window.pcHeadingMark = pcHeadingMark;
window.pcApplyHeadingMarks = pcApplyHeadingMarks;

document.addEventListener('DOMContentLoaded', () => pcApplyHeadingMarks());
