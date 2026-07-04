# Spec Sheet — Handoff para desarrollo

Carpeta destino: `PrincessClubWeb/`. Stack: HTML / CSS / JS vanilla. Mobile-first.

---

## 1. Breakpoints

```css
/* Mobile first — default: 360px+ */

@media (min-width: 600px) { /* tablet */ }
@media (min-width: 900px) { /* desktop */ }
@media (min-width: 1280px) { /* wide — container más aire, no cambio de IA */ }
```

| Token | Valor | Uso |
|-------|-------|-----|
| Mobile | 360px | Diseño base, wireframes |
| Tablet | 600px | 2 col packages, trust sin scroll |
| Desktop | 900px | Nav inline, hero 2 col, 3 col packages |
| Wide | 1280px | max-width 1100–1200px, section-py 80px |

---

## 2. Z-index stack

| Capa | Valor | Elemento |
|------|-------|----------|
| Decor | 0 | pattern backgrounds |
| Base | 1 | contenido |
| FAB | 1030 | WhatsApp flotante |
| Backdrop nav | 1040 | overlay menú |
| Drawer | 1050 | panel nav mobile |
| Header | 1000 | sticky header |
| Modal | 1100 | dialog + backdrop |
| Skip link | 1200 | focus only |

---

## 3. Animaciones

### Fade-in al scroll

```css
[data-animate] {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--duration-reveal) var(--ease-out),
              transform var(--duration-reveal) var(--ease-out);
}
[data-animate].is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- Trigger: IntersectionObserver, threshold 0.15, rootMargin `0px 0px -40px 0px`
- Secciones: quienes, experiencias, cómo funciona, video, testimonios, FAQ, reserva
- Hero: NO animar (above the fold)

### Nav drawer

| Propiedad | From | To | Duration | Easing |
|-----------|------|-----|----------|--------|
| drawer transform | translateX(100%) | translateX(0) | 250ms | ease-out |
| backdrop opacity | 0 | 1 | 250ms | ease-out |

### Modal

| Propiedad | From | To | Duration |
|-----------|------|-----|----------|
| backdrop opacity | 0 | 1 | 200ms |
| dialog transform + opacity | scale(0.96), opacity 0 | scale(1), opacity 1 | 250ms ease-out |

### Card hover (desktop only)

```css
@media (hover: hover) {
  .exp-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-card-hover);
  }
}
```

### Accordion

- Panel: `grid-template-rows: 0fr → 1fr` o max-height transition 250ms
- Icon rotate: 180deg, 200ms

### prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  [data-animate] { opacity: 1; transform: none; }
}
```

---

## 4. Estados interactivos — resumen

| Componente | Hover | Active | Focus | Disabled |
|------------|-------|--------|-------|----------|
| btn-primary | brightness 0.95 | scale 0.98, bg accent | outline accent | opacity 0.5 |
| btn-secondary | bg bg tint | scale 0.98, bg soft | outline accent | opacity 0.5 |
| btn-ghost | bg soft 15% | bg soft 25% | outline accent | opacity 0.5 |
| exp-card | lift + shadow | — | outline card | — |
| input | — | — | border accent + outline | opacity 0.6 |
| accordion summary | bg soft 10% | — | outline | — |
| fab | scale 1.05 | scale 0.95 | outline white | — |
| nav link | color accent | — | outline | — |

---

## 5. WhatsApp — integración

```javascript
const WA_NUMBER = '5491133942309';

function buildWaUrl({ type, name, duration, form }) {
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
```

**Puntos de salida WA (mínimo 2 taps):**
- Header CTA
- Hero primary
- FAB (siempre)
- Card "Reservar"
- Modal "Reservar"
- Video CTA
- Form submit
- Testimonial "Dejar opinión"

---

## 6. Datos — experiences.json

Reutilizar `../experiences.json`. Campos: `id`, `title`, `duration`, `tagline`, `activities[]`, `extra?`.

**Badge sugerido en render:**
```javascript
const FEATURED_ID = 'sueno-princesa'; // "Más elegido"
```

---

## 7. Estructura HTML sugerida

```
PrincessClubWeb/
├── index.html
├── css/
│   ├── tokens.css
│   └── styles.css
├── js/
│   └── main.js
├── experiences.json      (copia o symlink)
└── assets → ../assets/   (referencia relativa)
```

---

## 8. Semántica y ARIA

| Elemento | Marcado |
|----------|---------|
| Header | `<header role="banner">` |
| Nav | `<nav aria-label="Principal">` |
| Main | `<main id="main">` |
| Drawer | `aria-hidden`, toggle `aria-expanded` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Carousel | `aria-roledescription="carousel"`, slides `role="group"` |
| FAQ | `<details>` nativo o `aria-expanded` en custom |
| FAB | `aria-label="Reservar por WhatsApp"` |

---

## 9. Performance

- Imágenes hero/galería: `loading="lazy"` excepto primera slide
- Fonts: `font-display: swap`
- Pattern.png: una sola carga, CSS backgrounds
- JS: defer, sin frameworks
- Objetivo LCP: hero image o headline < 2.5s en 4G

---

## 10. Checklist pre-deploy

- [ ] Skip link funcional
- [ ] Drawer no desplaza layout
- [ ] FAB no tapa botón Reserva del form
- [ ] Modal cierra con Escape y backdrop
- [ ] 8 FAQ con copy real (no lorem)
- [ ] Contraste body text verificado
- [ ] Touch targets ≥ 44px auditados
- [ ] prefers-reduced-motion respetado
- [ ] OG tags + schema.org (copiar de v1)
- [ ] Todos los WA links con número correcto

---

## 11. Medidas clave (referencia rápida)

| Elemento | Mobile | Desktop |
|----------|--------|---------|
| Header height | 64px | 80px |
| Container px | 16px | 24px |
| Section py | 48px | 80px |
| Hero image height | 240px | 400px |
| Card min-height | auto ~180px | ~200px |
| Modal max-width | 100%-32px | 560px |
| Form max-width | 100% | 560px |
| Gallery slide height | 220px | 320px |
| FAB | 56×56 @ 16px | igual |

---

## 12. Assets — rutas

Desde `PrincessClubWeb/index.html`:

```html
<img src="../assets/para-usar/PRINCESSCLUB_PNG.png" alt="">
<img src="../assets/para-usar/princessclub_logo-secundario.png" alt="">
<!-- Secciones -->
<img src="../assets/para-usar/elementos_Princesas.png" class="section-icon" alt="">
<img src="../assets/para-usar/elementos_Eventos.png" class="section-icon" alt="">
<img src="../assets/para-usar/elementos_Contacto.png" class="section-icon" alt="">
<img src="../assets/para-usar/elementos_Opiniones.png" class="section-icon" alt="">
<img src="../assets/para-usar/preguntas.png" class="section-icon" alt="">
<!-- Pattern en CSS -->
background-image: url('../assets/para-usar/pattern.png');
```

Hero placeholder: imagen de show real en producción; referencia v1 `assets/default.jpg` o stock temporal.

---

## 13. Diferencias obligatorias vs v1

1. Eliminar `body.menu-open main { margin-top: 200px }`
2. Implementar drawer overlay
3. Reducir hero a 1 párrafo
4. Agregar trust bar, cómo funciona, testimonios visibles
5. FAQ con 8 preguntas reales
6. Footer con datos de contacto visibles
7. FAB WhatsApp
8. Header CTA "Reservar" siempre visible
