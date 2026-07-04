# Princess Club - Shows Infantiles

Sitio web v2.0 para Princess Club, empresa de shows de princesas para eventos infantiles en CABA.

## Deploy (Netlify)

El sitio productivo está en la **raíz del repo** (`index.html`). Netlify usa `netlify.toml` con `publish = "."`.

Tras push a GitHub, Netlify redeploya automáticamente. La v1 archivada está en `v1/`. El handoff de diseño sigue en `PrincessClubWeb/`.

## Características v2.0

- **Mobile-first** — drawer overlay, FAB WhatsApp, trust bar
- **13 secciones** — hero, quienes somos, experiencias, cómo funciona, video, testimonios, FAQ, reserva
- **Conversión WhatsApp** — CTAs en header, hero, cards, modal, formulario
- **Accesibilidad** — skip link, focus visible, prefers-reduced-motion

## Estructura

- `index.html` — Página principal (v2)
- `css/tokens.css` + `css/styles.css` — Design system y estilos
- `js/main.js` — Nav, modal, carousels, WhatsApp
- `experiences.json` — Catálogo de paquetes
- `assets/para-usar/` — Logos e iconografía de marca
- `fonts/` — Garet, Bright Retro
- `v1/` — Sitio anterior (archivado)
- `PrincessClubWeb/` — Documentación UX/UI y mockups

## Uso local

```bash
npx http-server . -p 8080
```

Abrir `http://localhost:8080/`
