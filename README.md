# PHACKER:25

Sitio web oficial para Primavera Hacker 2025 - Encuentro anual de pensamiento crítico, tecnologías libres y prácticas hacker en Santiago de Chile.

## Tecnologías

- **Frontend**: React + Vite
- **3D Experience**: Three.js
- **Routing**: React Router
- **Styling**: CSS Modules

## Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

- `/src/pages/` - Páginas de la aplicación
- `/src/components/` - Componentes reutilizables
- `/src/experience/` - Sistema 3D con Three.js
- `/public/` - Contenido estático y textos

## Actualizar Programa de Eventos

Para actualizar la programación de eventos:

1. Abrir la [planilla de Google Sheets](https://docs.google.com/spreadsheets/d/1BQEFI09zx2WL6KDMA-IXL421dYRjuKZHP5oFAgNPzns/edit?gid=1694252080#gid=1694252080)
2. Ir a la pestaña `web_programa`
3. Descargar como CSV: `Archivo > Descargar > Valores separados por comas (.csv)`
4. Guardar el archivo descargado como `data.csv` en `scripts/data/`
5. Ejecutar el script de conversión:

```bash
npm run generate:programs
```

Este script convertirá el CSV a JSON y generará el archivo `src/data/programs.js` automáticamente.

## Créditos

**3D Experience**: [@armdz](https://github.com/armdz)

**TODO:**

-⁠ ⁠Feature: add dog model
-⁠ ⁠Bug: onreload 404
-⁠ ⁠UX enhance: pausar three on menu open
