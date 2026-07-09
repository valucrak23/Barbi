# Recortes de imágenes — Princess Club

Subí acá **3 versiones por foto** (10 fotos × 3 = 30 archivos).

## Carpetas

| Carpeta | Proporción | Cuándo se usa en el sitio |
|---------|------------|---------------------------|
| `vertical/` | **4:5** | Hero en celular, maquillaje mobile, lightbox |
| `square/` | **1:1** | Cards de shows, personajes, galería |
| `horizontal/` | **16:9** | Hero en desktop, maquillaje desktop |

## Cómo recortar (tu marca en la foto)

Usá la foto original y dibujá:

- **Recorte VERDE (vertical)** → exportar a `vertical/`
  - Desde justo arriba de la cabeza hasta los pies.
  - Sin pared/techo vacío arriba.

- **Entre las líneas ROJAS (cuadrado + horizontal)** → exportar a `square/` y `horizontal/`
  - Caras en el **tercio superior** del recorte.
  - Cuadrado: mismo alto y ancho.
  - Horizontal: mismo alto que el cuadrado, más ancho (16:9).

## Nombre del archivo

**Mismo nombre en las 3 carpetas.** Ejemplo:

```
vertical/hero-princesas-hielo.jpeg
square/hero-princesas-hielo.jpeg
horizontal/hero-princesas-hielo.jpeg
```

## Tamaño sugerido al exportar

| Variante | Píxeles |
|----------|---------|
| vertical | 800 × 1000 |
| square | 800 × 800 |
| horizontal | 1280 × 720 |

Formato: **JPEG**, calidad 80–85%.

## Lista de archivos a enviar

Marcá en `manifest.json` cuando subas cada uno (`received: true`).

1. `hero-princesas-hielo`
2. `reina-hielo-1`
3. `reina-hielo-2`
4. `show-sirena`
5. `show-guerreras-kpop`
6. `guerreras-kpop-1`
7. `guerreras-kpop-2`
8. `galeria-evento-1`
9. `galeria-evento-2`
10. `maquillaje-artistico`

## Fallback

Si falta un recorte, el sitio sigue usando la foto de `assets/para-usar/` (original) hasta que la subas.
