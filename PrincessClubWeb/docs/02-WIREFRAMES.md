# Wireframes — Princess Club Web 2.0

Especificación de layout para mobile **360px** y desktop **1280px**. Misma estructura; desktop expande columnas sin reordenar secciones.

Previsualización interactiva:
- Mobile: `design/wireframes-mobile.html`
- Desktop: `design/wireframes-desktop.html`

---

## Convenciones

```
[  ] = contenedor / card
─── = separador de sección
▓▓▓ = imagen / media
═══ = CTA primario
··· = CTA secundario
(●) = FAB WhatsApp
```

Medidas en px salvo indicación contraria. Padding container: **16px mobile**, **24px desktop**.

---

## 1. Header sticky

### Mobile 360×64

```
┌──────────────────────────────────────────┐ 64px
│ [Logo sec]     [Logo main]    [≡] [Res]│
└──────────────────────────────────────────┘
     40px           oculto      44  44px
```

- Logo secundario izquierda (40px alto)
- Logo principal: oculto en mobile (solo secundario)
- Hamburger 44×44 + CTA "Reservar" pill 44px alto, min-width 88px
- Sticky top, fondo white, shadow-sm

**Drawer abierto (overlay, NO empuja contenido):**

```
┌──────────────────────────────────────────┐
│ [backdrop rgba overlay 35%]              │
│  ┌────────────────────────────────────┐  │
│  │ ✕  Menú                            │  │
│  │ ─────────────────────────────────  │  │
│  │ Inicio                             │  │
│  │ Quienes somos                      │  │
│  │ Experiencias                       │  │
│  │ Video                              │  │
│  │ Preguntas                          │  │
│  │ Reserva                            │  │
│  │ ─────────────────────────────────  │  │
│  │ [    Reservar ahora    ]           │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- Drawer: 280px ancho, slide desde derecha, z-index 1050
- Backdrop: z-index 1040, click cierra
- Animación: translateX 100% → 0, 250ms ease-out

### Desktop 1280×80

```
┌────────────────────────────────────────────────────────────────────────────┐
│ [Logo main 80px]   Nav links inline gap 24px          [Reservar ahora]    │
└────────────────────────────────────────────────────────────────────────────┘
```

- Sin hamburger ≥ 900px
- Logo principal visible; secundario oculto
- Nav horizontal centrado o entre logo y CTA

---

## 2. Hero

### Mobile 360 — altura ~520px

```
┌──────────────────────────────────────────┐
│ H1 (max 8 palabras)          32px        │
│ Subheadline 1 línea          18px        │
│ Párrafo corto (2 líneas max) 16px        │
│                                          │
│ [═══ Reservar ahora ═══]  full width     │ 44px
│ [··· Ver experiencias ···]  full width   │ 44px
│                                          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ 240px
│     (placeholder show / princesa)        │
└──────────────────────────────────────────┘
     padding-top: 80px (header offset)
     padding-bottom: 48px
```

### Desktop 1280 — altura ~560px

```
┌────────────────────────────────────────────────────────────────────────────┐
│  COPY (55%)                          │  VISUAL (45%)                       │
│  H1 40px                             │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  Sub 20px                            │  border-radius 24px                 │
│  Párrafo 18px                        │  min-height 400px                   │
│  [Reservar] [Ver exp] inline gap 12  │                                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Trust bar

### Mobile — scroll horizontal, altura 72px

```
┌──────────────────────────────────────────┐
│ ○ +3 años  │ ○ CABA │ ○ Actrices │ ○ Seg│ → scroll
└──────────────────────────────────────────┘
   gap 24px entre items, icon 24px, label 12px
```

### Desktop — 4 items centrados, gap 48px

---

## 4. Quienes somos

### Mobile

```
┌──────────────────────────────────────────┐
│ [icon] Quienes somos           H2 28px   │
│ Texto 3 líneas max             16px      │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │ 220px
│ └──────────────────────────────────────┘ │
│        ● ○ ○ ○ ○   dots                  │
└──────────────────────────────────────────┘
   section padding: 48px 0
   fondo: white o alt con pattern 2%
```

### Desktop — 2 columnas 50/50, gap 32px

---

## 5. Catálogo Experiencias

### Mobile — 1 columna, gap 16px

```
┌──────────────────────────────────────────┐
│ [icon] Catálogo de Experiencias          │
│                                          │
│ ┌──────────────────────────────────────┐ │
│ │ [Más elegido]              badge     │ │
│ │ Pack Sueño de Princesa     28px      │ │
│ │ ⏱ 40 min                   pill      │ │
│ │ Show interactivo...        tagline   │ │
│ │ [Reservar] [Ver detalle]   44px ea   │ │
│ └──────────────────────────────────────┘ │
│ ... × 6 cards                            │
└──────────────────────────────────────────┘
```

### Desktop 1280 — grid 3×2, gap 24px, max-width container 1100px

---

## 6. Modal detalle

### Mobile 360 — max-height 90vh, scroll interno

```
┌──────────────────────────────────────────┐
│ ░░░░░░░ backdrop ░░░░░░░░░░░░░░░░░░░░░░ │
│  ┌────────────────────────────────────┐  │
│  │ Pack Sueño de Princesa        [✕]  │ 56px header
│  ├────────────────────────────────────┤  │
│  │ Duración: 40 min                   │  │
│  │ • actividad 1 (icon princesa)      │  │
│  │ • actividad 2                      │  │ scroll
│  │ • ...                              │  │
│  │ texto extra opcional               │  │
│  ├────────────────────────────────────┤  │
│  │ [══════ Reservar ══════]           │ 56px footer
│  └────────────────────────────────────┘  │
│         margin 16px, radius 16px           │
└──────────────────────────────────────────┘
```

- Ancho: calc(100% - 32px), max 560px
- pattern body 3–5% opacity

---

## 7. Cómo funciona

### Mobile — stack vertical, gap 24px

```
┌──────────────────────────────────────────┐
│ Cómo funciona                  H2        │
│                                          │
│  (1)  Elegí tu experiencia               │
│  (2)  Reservá por WhatsApp               │
│  (3)  Disfrutá la magia en tu evento     │
│                                          │
│  círculo número: 48px, bg soft           │
└──────────────────────────────────────────┘
```

### Desktop — 3 columnas iguales, conector línea punteada opcional

---

## 8. Video felicitación

### Mobile — bloque gradiente, padding 40px 20px

```
┌──────────────────────────────────────────┐
│ ░ gradient soft → accent ░░░░░░░░░░░░░░░ │
│         🎥 o icon                        │
│   Video personalizado de tu princesa    │
│   Copy 1 línea                           │
│   [═══ Reservar Video ═══]               │
└──────────────────────────────────────────┘
   radius 16px, max-width 600px centered
```

---

## 9. Testimonios

### Mobile — 1 card visible, swipe

```
┌──────────────────────────────────────────┐
│ [icon] Lo que dicen las familias         │
│                                          │
│  "  texto testimonio...  "               │
│  ★★★★★                                   │
│  María, mamá de Sofía                    │
│                                          │
│  ○ ● ○                                   │
│  [Dejar tu opinión]                      │
└──────────────────────────────────────────┘
```

### Desktop — 3 cards en fila o carousel con 3 visibles

---

## 10. FAQ

### Mobile

```
┌──────────────────────────────────────────┐
│ [icon] Preguntas frecuentes              │
│                                          │
│ ▼ ¿Desde qué edad...?        [abierto]   │
│   Respuesta expandida...                 │
│ ▶ ¿Cubren toda CABA?                     │
│ ▶ ¿Cuánto tiempo antes...?               │
│ ... 8 total                              │
└──────────────────────────────────────────┘
   accordion item: min-height 44px summary
   gap entre items: 8px
```

---

## 11. Reserva

### Mobile

```
┌──────────────────────────────────────────┐
│ [icon] Reservá tu magia                  │
│                                          │
│ Nombre    [________________________]     │
│ Email     [________________________]     │
│ Mensaje   [________________________]     │
│           [________________________]     │
│                                          │
│ [══════ Reservar ══════]                 │
│ Respondemos en menos de 24 hs.           │
└──────────────────────────────────────────┘
```

### Desktop — form max-width 560px centrado

---

## 12. Footer

### Mobile — stack centrado

```
┌──────────────────────────────────────────┐
│ [Logo secundario 50px]                   │
│ © 2026 Princess Club                     │
│ Contacto  |  Opiniones                   │
│ WhatsApp: +54 9 11 3394-2309             │
│ info@princessclub.com                    │
│ CABA · Lun–Vie 9–18 hs                   │
└──────────────────────────────────────────┘
   padding 32px 16px
```

### Desktop — 3 columnas: logo+© | links | contacto

---

## 13. FAB WhatsApp

```
                                    (●)
                              56×56px
                         bottom: 16px
                          right: 16px
```

- Icono WA verde `#25D366` sobre círculo white + shadow-fab
- Ocultar cuando modal o drawer abiertos (opcional)
- Body padding-bottom mobile: 80px en última sección para no overlap

---

## Mapa de alturas aproximadas (mobile scroll total ~4500px)

| Sección | Altura aprox. |
|---------|---------------|
| Header | 64 (fixed) |
| Hero | 520 |
| Trust bar | 72 |
| Quienes somos | 380 |
| Experiencias | 1400 (6 cards) |
| Cómo funciona | 320 |
| Video | 280 |
| Testimonios | 340 |
| FAQ | 520 |
| Reserva | 420 |
| Footer | 240 |

---

## Breakpoints de adaptación

| Breakpoint | Cambios layout |
|------------|----------------|
| 360px | Base mobile |
| 600px | Trust bar sin scroll; packages 2 col; nav aún drawer |
| 900px | Hero 2 col; packages 3 col; nav inline; quienes 2 col |
| 1280px | Container max 1100–1200px centrado; más aire vertical |
