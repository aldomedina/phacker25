import { Link } from "react-router-dom";
import cn from "classnames";

import { useLocale } from "../../hooks/useLocale";
import { useIntl } from "react-intl";
import { paths } from "../Router/routes";

import css from "./Footer.module.css";

export default function FloatingNav({ menuOpen, setMenuOpen }) {
  const intl = useIntl();
  const { locale } = useLocale();

  const evento = intl.formatMessage({ id: "evento" });
  const programa = intl.formatMessage({ id: "programa" });
  const manifiesto = intl.formatMessage({ id: "manifiesto" });

  // Helper para crear paths localizados
  const getLocalizedPath = (path) => {
    return locale === "en" ? `/en${path}` : path;
  };

  if (!menuOpen) return null;
  return (
    <div className={css.floatingNav}>
      <button className={css.closeButton} onClick={() => setMenuOpen(false)}>
        X
      </button>
      <nav className={css.nav}>
        <Link className={cn(css.navLink)} to={getLocalizedPath(paths.evento)}>
          {evento}
        </Link>
        <Link className={cn(css.navLink)} to={getLocalizedPath(paths.programa)}>
          {programa}
        </Link>
        <Link
          className={cn(css.navLink)}
          to={getLocalizedPath(paths.manifiesto)}
        >
          {manifiesto}
        </Link>
      </nav>
    </div>
  );
}
