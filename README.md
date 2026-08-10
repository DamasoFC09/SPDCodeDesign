# SPD CodeDesign

**SPD: Servicio de Programación y Diseño.** Sitio institucional del estudio.
Rediseño del sitio original conservando su identidad: fondo oscuro, tipografía
Orbitron en el logotipo y la estructura de páginas de siempre.

---

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Página principal: hero, servicios, proceso, tecnologías y contacto |
| `paginas.html` | Índice de la información de la empresa |
| `valores.html` | Los cinco valores |
| `mision.html` | Misión |
| `vision.html` | Visión |
| `styles.css` | **Toda** la hoja de estilos del sitio |
| `main.js` | Tema claro/oscuro, menú móvil, apariciones y terminal |
| `SPDimages/` | Imágenes |

Se sube tal cual al servidor. No hay que compilar nada.

---

## Sistema de diseño

### Color

La paleta sale del propio logotipo (`SDP3.jpg`): azul noche de fondo y un
degradado cian → verde. Reemplaza al `#004f88` plano de la versión anterior.

| Variable | Oscuro | Claro |
| --- | --- | --- |
| `--bg` | `#0b111f` | `#f4f7fc` |
| `--surface` | `#131b2c` | `#ffffff` |
| `--text` | `#e8eef8` | `#0c1424` |
| `--brand-cyan` | `#22d3ee` | — |
| `--brand-green` | `#34d399` | — |
| `--brand-blue` | `#3b9be8` | — |

Los colores viven en variables CSS al principio de `styles.css`, agrupados por
tema. Para cambiar un color se toca ahí y cambia en todo el sitio.

### Tipografía

| Uso | Fuente |
| --- | --- |
| Logotipo | Orbitron 900 — se conserva de la versión original |
| Títulos y texto | Space Grotesk |
| Etiquetas, rutas, terminal | JetBrains Mono |

Orbitron quedó reservada solo para el logotipo. En títulos largos se lee mal, y
usarla en todos lados era lo que más envejecía el sitio.

### El elemento que lo distingue: la ventana

Los bloques de contenido del sitio anterior tenían bordes gruesos a los lados y
esquinas muy redondeadas. Ese marco se convirtió en el motivo central del
rediseño: **cada bloque es una ventana de escritorio**, con su barra de título,
sus tres puntos y una ruta en monoespaciado (`~/servicios/sistemas`).

Encaja con lo que ahora hace la empresa: si programamos para Linux y Windows,
la ventana es el objeto propio del oficio. Y el filo degradado superior de cada
ventana es el mismo borde azul de antes, ahora con el cian → verde del logo.

---

## Cómo cambiar cosas

### El tema por defecto

El sitio abre en **modo oscuro** siempre. Si alguien pulsa el botón del sol, se
guarda su elección en el navegador y la próxima visita abre en claro.

Para que en cambio respete la configuración del sistema operativo del visitante,
en el `<script>` del `<head>` de cada página:

```js
var theme = 'dark';
try {
  var saved = localStorage.getItem('spd-theme');
  if (saved === 'light' || saved === 'dark') theme = saved;
  // añadir esta línea:
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
} catch (e) {}
```

### El texto de la terminal

Está en `main.js`, en el arreglo `script`. Cada línea tiene un tipo:

- `cmd` — se escribe letra por letra, con el prompt delante
- `out` — aparece de golpe (una máquina no teclea sus propias respuestas)
- `raw` — HTML tal cual, para colorear nombres de carpeta
- `gap` — una línea en blanco

### Los servicios

Cada tarjeta en `index.html` es un `<article class="window service">`. Para
agregar una cuarta se copia el bloque completo y se cambia la ruta del
`window__path`. La rejilla se reacomoda sola.

La etiqueta `Nuevo` sobre «Sistemas y automatización» es
`<span class="window__tag">`. Conviene quitarla en unos meses, cuando el
servicio deje de ser noticia.

---

## Antes de publicar

- [ ] **Reemplazar `SPD1PRO.png`.** Es el favicon y hoy es gris claro sobre
      transparente: en la pestaña del navegador casi no se ve. Sirve una versión
      del logo en cian/verde sobre fondo oscuro, de 512×512.
- [ ] **Comprimir las imágenes.** `section_design.png` pesa 2 MB, que es casi
      todo el peso del sitio. Convertida a `.webp` debería bajar a menos de
      200 KB sin diferencia visible, porque se usa desenfocada de fondo.
- [ ] Confirmar el número de WhatsApp: el enlace apunta a
      `wa.me/573128137199`.

---

## Cambios respecto a la versión anterior

**Estructura**

- El CSS estaba repetido dentro de cada `.html`, con reglas distintas para lo
  mismo (cinco definiciones de `footer`, tres de `section`). Ahora hay un solo
  `styles.css`, y `main.js` para el comportamiento.
- Los nombres con tilde (`MISIÓN.html`, `PÁGINAS.html`, `VISIÓN.html`) pasaron a
  `mision.html`, `paginas.html`, `vision.html`. Muchos servidores devuelven 404
  con caracteres acentuados en la URL, o los convierten a `%C3%93` al
  compartirlos.
- Cabecera y pie ahora son iguales en todas las páginas, y hay navegación real
  entre ellas en vez de un solo enlace de vuelta.

**Comportamiento**

- El modo claro funciona en todo el sitio y se recuerda entre visitas. Antes
  existían algunas reglas `body.dark` pero nada las activaba.
- Las apariciones al hacer scroll usan `IntersectionObserver`. Antes se
  recalculaba la posición de cada elemento en cada píxel de scroll, lo que hacía
  trabajar al navegador de más.
- Se quitó la animación que agrandaba y encogía el `font-size` de los enlaces en
  bucle: movía el texto alrededor mientras se estaba leyendo. Los enlaces ahora
  se subrayan con una línea que crece, sin desplazar nada.
- El menú móvil es un desplegable. Antes los enlaces crecían al pasar el cursor,
  y eso empujaba el contenido de abajo.

**Contenido**

- Sección de servicios reescrita en tres frentes: web, sistemas y diseño.
- «Sistemas y automatización» es nuevo: scripts en Python, Bash y PowerShell,
  herramientas de línea de comandos, respaldos y tareas programadas.
- Sección de contacto propia, con WhatsApp, correo y Telegram. Antes los datos
  estaban solo en el pie.
- Corregido el enlace de Telegram: era `te.me`, debía ser `t.me`.
- Corregidas erratas de la versión anterior («a la ves», «aportanto»).

**Accesibilidad**

- Enlace para saltar al contenido, marcas semánticas (`header`, `main`, `nav`,
  `footer`), foco visible al navegar con teclado, `aria-label` en los botones de
  icono y texto alternativo en las imágenes.
- Se respeta `prefers-reduced-motion`: quien tenga desactivadas las animaciones
  en su sistema ve la terminal escrita de una vez y sin transiciones.

---

© SPD — Servicio de Programación y Diseño. Fundado por Dámaso Figueredo.
