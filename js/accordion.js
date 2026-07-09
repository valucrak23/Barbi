/**
 * Acordeón con límite: 1 abierto en mobile, 2 en desktop (≥1024px).
 */
function pcAccordionMaxOpen() {
  return 1;
}

function pcInitAccordionGroup(container) {
  if (!container || container.dataset.accordionBound) return;
  container.dataset.accordionBound = '1';

  const enforce = (except) => {
    const max = pcAccordionMaxOpen();
    let open = [...container.querySelectorAll('details[open]')];
    while (open.length > max) {
      const toClose = open.find((d) => d !== except);
      if (!toClose) break;
      toClose.open = false;
      open = [...container.querySelectorAll('details[open]')];
    }
  };

  container.addEventListener(
    'toggle',
    (event) => {
      const target = event.target;
      if (!(target instanceof HTMLDetailsElement) || !target.open) return;
      enforce(target);
    },
    true
  );

  pcSyncAccordionDefaults(container);
}

function pcSyncAccordionDefaults(container) {
  if (!container) return;
  const items = [...container.querySelectorAll('details')];
  const max = pcAccordionMaxOpen();
  items.forEach((item, index) => {
    item.open = index < max;
  });
}

window.pcInitAccordionGroup = pcInitAccordionGroup;
window.pcSyncAccordionDefaults = pcSyncAccordionDefaults;
