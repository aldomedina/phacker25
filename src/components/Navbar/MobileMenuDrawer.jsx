import cn from "classnames";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { paths } from "../Router/routes";
import { LogoPrimaveraHacker } from "../Logos";
import { useLocale } from "../../hooks/useLocale";
import { useLocalizedNavigate } from "../../hooks/useLocalizedNavigate";

import css from "./Navbar.module.css";

const MobileMenuDrawer = ({ isOpen, closeDrawer }) => {
  const navigate = useLocalizedNavigate();
  const intl = useIntl();
  const { locale, setLocale } = useLocale();

  const evento = intl.formatMessage({ id: "evento" });
  const programa = intl.formatMessage({ id: "programa" });
  const manifiesto = intl.formatMessage({ id: "manifiesto" });
  const codigo = intl.formatMessage({ id: "codigo" });

  // Helper para crear paths localizados
  const getLocalizedPath = (path) => {
    return locale === "en" ? `/en${path}` : path;
  };

  if (!isOpen) return null;
  return (
    <div className={css.drawer}>
      <div className={css.drawerMenu}>
        <button
          onClick={() => {
            navigate(paths.home);
            closeDrawer();
          }}
        >
          <LogoPrimaveraHacker />
        </button>
        <Link
          onClick={closeDrawer}
          to={getLocalizedPath(paths.evento)}
          className={cn("text-link-primary", css.primaryLink)}
        >
          {evento}
        </Link>
        <Link
          onClick={closeDrawer}
          to={getLocalizedPath(paths.programa)}
          className={cn("text-link-primary", css.primaryLink)}
        >
          {programa}
        </Link>
        <Link
          onClick={closeDrawer}
          to={getLocalizedPath(paths.manifiesto)}
          className={cn("text-link-primary", css.primaryLink)}
        >
          {manifiesto}
        </Link>
        <Link
          onClick={closeDrawer}
          to={getLocalizedPath(paths.conducta)}
          className={cn("text-link-primary", css.primaryLink)}
        >
          {codigo}
        </Link>
      </div>
      <div className={css.lang}>
        <button
          data-active={locale === "es"}
          className={cn("text-link-primary", css.primaryLink)}
          onClick={() => setLocale("es")}
        >
          {locale === "es" && "→"} ESP
        </button>
        <button
          data-active={locale === "en"}
          className={cn("text-link-primary", css.primaryLink)}
          onClick={() => setLocale("en")}
        >
          {locale === "en" && "→"} ENG
        </button>
      </div>
    </div>
  );
};

export default MobileMenuDrawer;
