import { useState } from "react";
import { useLocation } from "react-router-dom";
import cn from "classnames";
import { useIntl } from "react-intl";

import SobreMenu from "./SobreMenu";
import { LogoPHacker25 } from "../Logos";
import { useLocalizedNavigate } from "../../hooks/useLocalizedNavigate";
import MobileMenuDrawer from "./MobileMenuDrawer";

import { paths } from "../Router/routes";
import css from "./Navbar.module.css";

const Nav = () => {
  const navigate = useLocalizedNavigate();
  const location = useLocation();
  const intl = useIntl();

  // Detectar si estamos en home considerando el idioma
  const isHome = location.pathname === "/" || location.pathname === "/en";
  const [menuOpen, setMenuOpen] = useState();

  const cerrar = intl.formatMessage({ id: "cerrar" });

  // Helper para crear paths localizados

  return (
    <>
      <header className={css.root}>
        <SobreMenu />

        <nav className={css.menuMobile}>
          <div className={cn(css.rect, "bgGrey900")} style={{ flex: 1 }} />
          <div className={cn(css.rect, "bgGrey900 ")} style={{ flex: 5 }} />

          {!isHome && (
            <button
              className={cn(css.logoMobile)}
              onClick={() => {
                setMenuOpen(false);
                navigate(paths.home);
              }}
            >
              <LogoPHacker25 />
            </button>
          )}
          <button
            onClick={() => setMenuOpen((state) => !state)}
            className={cn("text-link-primary px4XS bgRed", css.primaryLink)}
          >
            {menuOpen ? cerrar : "MENU"}
          </button>
        </nav>
      </header>
      <MobileMenuDrawer
        isOpen={menuOpen}
        closeDrawer={() => setMenuOpen(false)}
      />
    </>
  );
};

export default Nav;
