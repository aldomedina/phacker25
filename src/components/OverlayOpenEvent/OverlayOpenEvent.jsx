import { useEffect, useRef } from "react";
import { useClickAway } from "@uidotdev/usehooks";
import css from "./OverlayOpenEvent.module.css";
import classNames from "classnames";
import { formatDate, formatSala } from "../../utils";

export default function OverlayOpenEvent({ openEvent, setOpenEvent }) {
  const wrapperRef = useRef(null);

  // Close on click outside
  useClickAway(wrapperRef, () => {
    setOpenEvent(null);
  });

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpenEvent(null);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [setOpenEvent]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    // Save current overflow value
    const originalOverflow = document.body.style.overflow;

    // Disable body scroll
    document.body.style.overflow = "hidden";

    // Re-enable body scroll on cleanup
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  if (!openEvent) return null;
  console.log(openEvent);
  return (
    <div className={css.root}>
      <div className={css.overlay} onClick={() => setOpenEvent(null)} />
      <div className={css.wrapper} ref={wrapperRef}>
        <button className={css.closeButton} onClick={() => setOpenEvent(null)}>
          ✕
        </button>
        <div className={css.content}>
          <div
            className={classNames(
              css.eje,
              "text-eyebrow text-uppercase bgGrey200 bgGreenLines"
            )}
          >
            {openEvent.eje}
          </div>
          <h1 className={classNames(css.title, "text-heading-secondary")}>
            {openEvent.titulo}
          </h1>
          <div className={css.details}>
            <span>{formatDate(openEvent.date)}</span>{" "}
            <span>
              <strong>{formatSala(openEvent.sala)}</strong>
            </span>
          </div>
          <p className={css.resumen}>{openEvent.resumen}</p>
          {(openEvent.autor || openEvent.bio) && (
            <div className={css.divider} />
          )}
          <h4 className={css.author}>{openEvent.autor}</h4>
          <p className={css.bio}>{openEvent.author_bio}</p>
        </div>
      </div>
    </div>
  );
}
