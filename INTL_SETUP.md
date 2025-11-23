# Configuración de react-intl

El sitio web ahora usa `react-intl` para la internacionalización con soporte para URLs localizadas.

## Estructura

- **Mensajes de traducción**: `/src/lang/esp/index.js` y `/src/lang/eng/index.js` (formato flat con claves como `"titles.evento"`)
- **Hook personalizado**: `/src/hooks/useLocale.jsx` - Gestiona el idioma basado en URL
- **Hook de navegación**: `/src/hooks/useLocalizedNavigate.jsx` - Navegación que preserva el idioma
- **Proveedor**: Configurado en `/src/App.jsx` con `IntlProvider`
- **Router**: `/src/components/Router/Router.jsx` - Rutas duplicadas para español e inglés

## URLs

- **Español (default)**: `/`, `/evento`, `/convocatoria`, etc.
- **Inglés**: `/en`, `/en/evento`, `/en/convocatoria`, etc.

El idioma se detecta automáticamente de la URL y se mantiene al navegar.

## Uso básico

### 1. Usar traducciones en componentes

```jsx
import { useIntl } from "react-intl";

const MiComponente = () => {
  const intl = useIntl();

  return (
    <div>
      <h1>{intl.formatMessage({ id: "evento" })}</h1>
      <p>{intl.formatMessage({ id: "titles.evento" })}</p>
    </div>
  );
};
```

### 2. Cambiar idioma (actualiza la URL automáticamente)

```jsx
import { useLocale } from "../hooks/useLocale";

const CambiadorIdioma = () => {
  const { locale, setLocale } = useLocale();

  return (
    <div>
      <button onClick={() => setLocale("es")}>Español</button>
      <button onClick={() => setLocale("en")}>English</button>
      <p>Idioma actual: {locale}</p>
    </div>
  );
};
```

### 3. Navegación (preserva el idioma en la URL)

**Opción A: Usar el hook personalizado**
```jsx
import { useLocalizedNavigate } from "../hooks/useLocalizedNavigate";

const MiComponente = () => {
  const navigate = useLocalizedNavigate();

  return (
    <button onClick={() => navigate("/evento")}>
      Ir al Evento
    </button>
  );
};
```

**Opción B: Usar Link con helper**
```jsx
import { Link } from "react-router-dom";
import { useLocale } from "../hooks/useLocale";

const MiComponente = () => {
  const { locale } = useLocale();

  const getLocalizedPath = (path) => {
    return locale === "en" ? `/en${path}` : path;
  };

  return (
    <Link to={getLocalizedPath("/evento")}>
      Ir al Evento
    </Link>
  );
};
```

### 4. Agregar nuevas traducciones

Edita los archivos de mensajes usando formato flat:

**`/src/lang/esp/index.js`**:
```js
const esp_messages = {
  miNuevoMensaje: "Hola mundo",
  "seccion.titulo": "Mi Título",
  "seccion.descripcion": "Mi descripción",
  // ... más mensajes
};
```

**`/src/lang/eng/index.js`**:
```js
const eng_messages = {
  miNuevoMensaje: "Hello world",
  "seccion.titulo": "My Title",
  "seccion.descripcion": "My description",
  // ... más mensajes
};
```

**Importante**: Usa claves flat con puntos (`"seccion.titulo"`) en lugar de objetos anidados.

## Características

- ✅ URLs localizadas (`/` para español, `/en` para inglés)
- ✅ Detección automática de idioma desde URL
- ✅ Cambio dinámico de idioma con actualización de URL
- ✅ Navegación que preserva el idioma actual
- ✅ Soporte para mensajes con notación de puntos (ej: `titles.evento`)
- ✅ Compatible con todos los hooks de react-intl

## Cómo funciona

1. El usuario visita `/` → idioma español (default)
2. El usuario hace clic en "ENG" → se redirige a `/en`
3. El usuario navega a "evento" → va a `/en/evento`
4. El usuario hace clic en "ESP" → se redirige a `/evento`

## Documentación oficial

Para más información: https://formatjs.github.io/docs/react-intl/
