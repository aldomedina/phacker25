import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DayTable from "../../components/DayTable";
import OverlayOpenEvent from "../../components/OverlayOpenEvent";
import programs from "../../data/programs";

import css from "./Programa.module.css";

const Programa = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openEvent, setOpenEvent] = useState(null);

  // Read openProject from URL params on mount
  useEffect(() => {
    const openProject = searchParams.get("openProject");
    if (openProject) {
      const event = programs.find((p) => p.slug === openProject);
      if (event) {
        setOpenEvent(event);
      }
    }
  }, [searchParams]);

  // Update URL params when openEvent changes
  useEffect(() => {
    if (openEvent) {
      setSearchParams({ openProject: openEvent.slug });
    } else {
      setSearchParams({});
    }
  }, [openEvent, setSearchParams]);

  const handleEventClick = (event) => {
    setOpenEvent(event);
  };

  return (
    <div className={css.root}>
      <div className={css.stickyHeader}>
        <div className={css.headerHoras} />
        <div className={css.header}>SUBTE</div>
        <div className={css.header}>SALA.01</div>
        <div className={css.header}>SALA.02</div>
      </div>
      <DayTable day="viernes" onEventClick={handleEventClick} noHeading />
      <DayTable day="sabado" noHeading onEventClick={handleEventClick} />
      {openEvent && (
        <OverlayOpenEvent openEvent={openEvent} setOpenEvent={setOpenEvent} />
      )}
    </div>
  );
};

export default Programa;
