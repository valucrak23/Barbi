# UI Kit — Princess Club Web 2.0

Tokens completos en `css/tokens.css`. Esta guía documenta componentes y estados.

---

## 1. Colores

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-soft` | `#aebae1` | Botones primary, acentos, bordes |
| `--color-accent` | `#ae8bbf` | Identidad, títulos decorativos |
| `--color-bg` | `#f9f4fd` | Fondo general |
| `--color-white` | `#ffffff` | Cards, header, inputs |
| `--color-dark` | `#124E78` | Texto legible, links, body copy |

**Regla de texto:** párrafos y links en `--color-dark`. Títulos de sección pueden usar `--color-accent` o `--color-dark` según contraste.

---

## 2. Tipografías

| Rol | Familia | Pesos | Fallback |
|-----|---------|-------|----------|
| Cuerpo | Garet | 400, 700 | system-ui |
| H1–H6 | Bright Retro | 400 | Georgia |
| Paquetes / labels | Sour Gummy | 400, 900 | cursive |

**Carga:**
```html
<link href="https://fonts.googleapis.com/css2?family=Sour+Gummy:wght@400;900&display=swap" rel="stylesheet">
<!-- Garet + Bright Retro: @font-face local en /fonts -->
```

---

## 3. Botones

### Primary
```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: var(--touch-min);
  padding: var(--btn-py) var(--btn-px);
  font-family: var(--font-body);
  font-weight: var(--weight-bold);
  font-size: var(--btn-font-size);
  color: var(--color-text-on-soft);
  background: var(--color-soft);
  border: 1px solid var(--color-soft);
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: filter var(--duration-fast), transform var(--duration-fast), background var(--duration-fast);
}
```

| Estado | Comportamiento |
|--------|----------------|
| Default | bg soft, text white |
| Hover | `filter: brightness(0.95)` |
| Active | `transform: scale(0.98)`, bg accent |
| Focus-visible | outline accent 2px offset 2px |
| Disabled | opacity 0.5, pointer-events none |

### Secondary
- bg white, text dark, border soft
- Hover: bg `#f9f4fd`
- Active: bg soft, text white

### Ghost
- bg transparent, text dark, border transparent
- Hover: bg rgba(174, 186, 225, 0.15)
- Uso: links de acción terciaria, "Ver detalle"

### Tamaños

| Variante | Height | Padding X | Font |
|----------|--------|-----------|------|
| Default | 44px | 20px | 16px |
| Small | 36px | 14px | 14px |
| Large (hero) | 48px | 24px | 16px |

---

## 4. Cards de experiencia

```css
.exp-card {
  background: var(--color-white);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration-normal), transform var(--duration-normal);
}
.exp-card:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}
```

**Anatomía:**
1. Badge (opcional) — top-right o top-left, bg accent, text white, 12px Sour Gummy 900, radius full
2. Título — Sour Gummy 400, 28px mobile / 32px desktop, color accent
3. Duración pill — inline-block, bg rgba(174,186,225,0.25), Sour Gummy 900, 14px, radius full, padding 4px 12px
4. Tagline — Garet 400, 16px, color dark, margin-bottom 16px
5. Actions — flex gap 8px, botones full-width mobile / auto desktop

---

## 5. Inputs

```css
.input {
  width: 100%;
  min-height: var(--touch-min);
  padding: var(--input-py) var(--input-px);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-dark);
  background: var(--color-white);
  border: var(--input-border);
  border-radius: var(--input-radius);
}
.input:focus {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-color: var(--color-accent);
}
.input::placeholder { color: var(--color-soft); }
.input:disabled { opacity: 0.6; background: var(--color-bg); }
.input[aria-invalid="true"] { border-color: #c44; }
```

**Label:** Garet 700, 14px, margin-bottom 6px, color dark.

---

## 6. Accordion (FAQ)

```css
.accordion-item {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.accordion-summary {
  min-height: var(--touch-min);
  padding: 12px 16px;
  font-family: var(--font-body);
  font-weight: var(--weight-bold);
  color: var(--color-dark);
  cursor: pointer;
  list-style: none;
}
.accordion-panel {
  padding: 0 16px 16px;
  color: var(--color-text-muted);
  line-height: var(--leading-relaxed);
}
```

| Estado | Indicador |
|--------|-----------|
| Cerrado | chevron ▶ o + |
| Abierto | chevron ▼ o −, border-left 3px accent opcional |
| Focus | outline en summary |

---

## 7. Modal

```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  z-index: var(--z-modal);
}
.modal-dialog {
  width: calc(100% - 32px);
  max-width: var(--modal-max-width);
  max-height: 90vh;
  background: var(--color-white);
  border-radius: var(--modal-radius);
  box-shadow: var(--shadow-modal);
  display: flex;
  flex-direction: column;
}
.modal-body {
  overflow-y: auto;
  padding: var(--modal-padding);
  /* pattern 3% opcional */
}
```

**Bullets actividades:** `padding-left: 45px`, background-image princesa 30×30px.

---

## 8. Carousel / Slider

- Track: `display: flex`, `scroll-snap-type: x mandatory`
- Slide: `scroll-snap-align: center`, `flex: 0 0 100%` (mobile) o `33.33%` (desktop)
- Nav arrows: 44×44, circular, bg white, shadow-sm
- Dots: 8px circle, active accent, inactive soft 40% opacity

---

## 9. Trust bar item

```
[icon 24px] + [label 12px bold]
flex column, align center, min-width 80px
```

---

## 10. Step (Cómo funciona)

- Círculo 48px, bg soft, número white Sour Gummy 900 20px
- Título step: Garet 700 16px
- Descripción: Garet 400 14px muted

---

## 11. Testimonial card

- bg white, radius md, padding 24px, shadow-card
- Comillas decorativas accent 48px opacity 20%
- Texto italic Garet 16px
- Estrellas: 16px, color `--color-star`
- Autor: Garet 400 14px dark

---

## 12. FAB WhatsApp

```css
.fab-wa {
  position: fixed;
  bottom: var(--fab-offset);
  right: var(--fab-offset);
  width: var(--fab-size);
  height: var(--fab-size);
  border-radius: var(--radius-full);
  background: #25D366;
  box-shadow: var(--shadow-fab);
  z-index: var(--z-fab);
}
```

Hover: scale 1.05. Active: scale 0.95.

---

## 13. Badge

```css
.badge {
  display: inline-block;
  padding: 4px 10px;
  font-family: var(--font-display);
  font-weight: var(--weight-display);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-badge-text);
  background: var(--color-badge-bg);
  border-radius: var(--radius-full);
}
```

---

## 14. Elevación y radius

| Elemento | Radius | Shadow |
|----------|--------|--------|
| Botón | 6px | none |
| Card | 10px | shadow-card |
| Card hover | 10px | shadow-card-hover |
| Modal | 16px | shadow-modal |
| Video block | 16px | shadow-lg |
| Input | 6px | none |
| FAB | 50% | shadow-fab |
| Pill duración | full | none |

---

## 15. Drawer nav mobile

```css
.nav-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100dvh;
  background: var(--color-white);
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  transition: transform var(--duration-normal) var(--ease-out);
  z-index: var(--z-drawer);
}
.nav-drawer.is-open { transform: translateX(0); }
.nav-backdrop {
  position: fixed;
  inset: 0;
  background: var(--color-overlay);
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--duration-normal);
  z-index: var(--z-drawer-backdrop);
}
.nav-backdrop.is-visible { opacity: 1; visibility: visible; }
```

**Importante:** NO modificar `margin-top` de `main` al abrir (fix v1).

---

## 16. Section title

```css
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-heading);
  font-size: var(--text-2xl);
  color: var(--color-dark);
  margin-bottom: var(--space-6);
}
.section-icon { width: 48px; height: auto; }
```

Assets por sección — ver restricciones de marca en README.

---

## 17. Copy-paste: clases sugeridas para dev

```
.btn .btn-primary .btn-secondary .btn-ghost .btn-sm .btn-lg
.exp-card .exp-card__badge .exp-card__title .exp-card__duration .exp-card__tagline
.input .input-label .input-group
.accordion .accordion-item .accordion-summary .accordion-panel
.modal .modal-backdrop .modal-dialog .modal-header .modal-body .modal-footer
.carousel .carousel-track .carousel-slide .carousel-dot
.trust-bar .trust-item
.step .step-number .step-content
.testimonial .testimonial-stars .testimonial-author
.fab-wa
.section .section--alt .section-title
.skip-link
```
