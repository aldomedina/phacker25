import { Link } from "react-router-dom";
import classNames from "classnames";

import { LogoPHacker25 } from "../Logos";
import { paths } from "../Router/routes";
import { useLocale } from "../../hooks/useLocale";

import css from "./Navbar.module.css";

const SobreMenu = () => {
  const { locale, setLocale } = useLocale();

  const getLocalizedPath = (path) => {
    return locale === "en" ? `/en${path}` : path;
  };

  return (
    <div className={css.sobremenu}>
      <Link to={getLocalizedPath(paths.home)} className={css.logoPhacker25}>
        <LogoPHacker25 />
      </Link>
      <div className={css.blank} />

      <div className={css.lang}>
        <button
          data-active={locale === "es"}
          className={classNames("text-eyebrow", css.langButton)}
          onClick={() => setLocale("es")}
        >
          ESP
        </button>
        <button
          data-active={locale === "en"}
          className={classNames("text-eyebrow", css.langButton)}
          onClick={() => setLocale("en")}
        >
          ENG
        </button>
      </div>
    </div>
  );
};

export default SobreMenu;
