/**
   Función para calcular tamaño de Canvas, considerando tamaños
   definidos en /src/styles/tokens.css

  --element-height-sobremenu: 15px;
  --element-height-menu: 28px;
  --element-height-footer: 28px;
  --element-padding-y-main: var(--space-3xs); -> 6px * 2
  --element-padding-x-main: var(--space-3xs); -> 6px * 2
 */

const breakpoint = 680;
const footer = 28;
const nav_desktop = 15;
const nav_mobile = 28;

export default function getCanvasSize() {
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight - footer;

  let isMobile = window.innerWidth < breakpoint;
  if (isMobile) {
    canvasHeight -= nav_mobile;
  } else {
    canvasHeight -= nav_desktop;
  }

  return { canvasWidth, canvasHeight };
}
