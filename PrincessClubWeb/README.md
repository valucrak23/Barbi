# Princess Club Web 2.0 — Design Handoff

Rediseño mobile-first de la landing de Princess Club. Sitio independiente en esta carpeta; la v1 permanece en la raíz del repo.

## Entregables

| Archivo | Contenido |
|---------|-----------|
| [docs/01-UX-UI-GUIDE.md](docs/01-UX-UI-GUIDE.md) | Guía de diseño UX/UI, personas, flujos, IA |
| [docs/02-WIREFRAMES.md](docs/02-WIREFRAMES.md) | Wireframes mobile (360px) y desktop (1280px) con medidas |
| [docs/03-UI-KIT.md](docs/03-UI-KIT.md) | Componentes, estados, elevación, pattern.png |
| [docs/04-SPEC-SHEET.md](docs/04-SPEC-SHEET.md) | Tokens, breakpoints, animaciones, handoff dev |
| [docs/05-COPY.md](docs/05-COPY.md) | Copy sugerido por bloque (español rioplatense) |
| [css/tokens.css](css/tokens.css) | Variables CSS listas para copiar |
| [design/mockups.html](design/mockups.html) | Mockups high-fidelity: Hero, Card, Modal, FAQ |
| [design/wireframes-mobile.html](design/wireframes-mobile.html) | Wireframe interactivo mobile 360px |
| [design/wireframes-desktop.html](design/wireframes-desktop.html) | Wireframe interactivo desktop 1280px |

## Checklist

- [x] Wireframes mobile completos (HTML + spec en docs)
- [x] Wireframes desktop adaptados
- [x] UI Kit con tokens CSS listos para copiar
- [x] Mockup Hero + Card experiencia + Modal + FAQ
- [x] Spec de animaciones y estados
- [x] Copy sugerido por sección
- [x] Notas de handoff para dev

> **Nota Figma:** Los wireframes y mockups están documentados en HTML/CSS navegable para handoff inmediato. Para replicar en Figma, usar las medidas de `02-WIREFRAMES.md` y los tokens de `tokens.css`.

## Cómo previsualizar

Servir desde la raíz del repo (para assets compartidos):

```bash
npx http-server . -p 8080
```

- Mockups: `http://localhost:8080/PrincessClubWeb/design/mockups.html`
- Wireframes mobile: `http://localhost:8080/PrincessClubWeb/design/wireframes-mobile.html`
- Wireframes desktop: `http://localhost:8080/PrincessClubWeb/design/wireframes-desktop.html`

## Assets

Usar desde `../assets/para-usar/` (relativo a PrincessClubWeb). No modificar paleta ni logos.

## Próximo paso (dev)

**Sitio productivo:** la v2 se sirve desde la raíz del repo (`/index.html`) para Netlify. Esta carpeta conserva el handoff UX/UI y mockups de referencia.

Para desarrollo local de la v2 en producción:

```bash
npx http-server . -p 8080
# http://localhost:8080/
```

Mockups y wireframes siguen en `design/`.
