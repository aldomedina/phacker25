import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar idioma desde URL
  const getLocaleFromPath = () => {
    const pathParts = location.pathname.split("/").filter(Boolean);
    return pathParts[0] === "en" ? "en" : "es";
  };

  const [locale, setLocaleState] = useState(getLocaleFromPath);

  // Sincronizar cuando cambia la URL
  useEffect(() => {
    const newLocale = getLocaleFromPath();
    if (newLocale !== locale) {
      setLocaleState(newLocale);
    }
  }, [location.pathname]);

  const setLocale = (newLocale) => {
    const currentPath = location.pathname;
    const currentLocale = getLocaleFromPath();

    // Construir la nueva ruta
    let newPath;
    if (newLocale === "es") {
      // Español es default, remover /en del path
      newPath = currentPath.replace(/^\/en(\/|$)/, "/");
    } else {
      // Inglés, agregar /en al path
      if (currentLocale === "es") {
        newPath = currentPath === "/" ? "/en" : `/en${currentPath}`;
      } else {
        newPath = currentPath;
      }
    }

    // Normalizar path
    if (newPath === "") newPath = "/";

    navigate(newPath, { replace: true });
    setLocaleState(newLocale);
  };

  const toggleLocale = () => {
    setLocale(locale === "es" ? "en" : "es");
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale debe ser usado dentro de LocaleProvider");
  }
  return context;
};
