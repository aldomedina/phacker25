import { useRef } from "react";
import cn from "classnames";
import { useIntl } from "react-intl";

import MarkdownFromFile from "../../components/MakdownFromFile/MarkdownFromFile";

import css from "./Evento.module.css";

const Evento = () => {
  const ref = useRef();
  const intl = useIntl();
  const lang = intl.locale === "es" ? "esp" : "eng";

  const handleScrollToFechas = () => {
    if (!ref.current) return;

    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <div className="page-container">
      <h1 className="text-heading-primary mt2XL mb4XL">
        Primavera Hacker 2025 :: <br />
        {intl.formatMessage({ id: "titles.evento" })}
      </h1>

      <button className={css.irButton} onClick={handleScrollToFechas}>
        {intl.formatMessage({ id: "dates.cta" })}
      </button>
      <div className="mbXL">
        <MarkdownFromFile file={`/content/${lang}/evento.md`} />
      </div>
      <div className={css.fechasWrapper} ref={ref}>
        <h3 className={cn(css.fechasTitle, "text-heading-secondary")}>
          {intl.formatMessage({ id: "dates.title" })}
        </h3>
        <div className={css.fechas}>
          <div className={css.fechaItem}>
            <h4 className="text-body-semibold">
              {intl.formatMessage({ id: "dates.notification.date" })}
            </h4>
            <p className="text-body-light">
              {intl.formatMessage({ id: "dates.notification.label" })}
            </p>
          </div>
          <div className={css.fechaItem}>
            <h4 className="text-body-semibold">
              {intl.formatMessage({ id: "dates.closing.date" })}
            </h4>
            <p className="text-body-light">
              {intl.formatMessage({ id: "dates.closing.label" })}
            </p>
          </div>
          <div className={css.fechaItem}>
            <h4 className="text-body-semibold">
              {intl.formatMessage({ id: "dates.event.date" })}
            </h4>
            <p className="text-body-light">
              {intl.formatMessage({ id: "dates.event.label" })}
            </p>
          </div>
        </div>
      </div>
      <div className="bottom-blank" />
    </div>
  );
};

export default Evento;
