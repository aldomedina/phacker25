import React from "react";
import EventCard from "../EventCard";
import programs from "../../data/programs";
import css from "./DayTable.module.css";

const DayTable = ({ day, noHeading, onEventClick }) => {
  // Filtrar eventos del día
  const dayEvents = programs.filter(({ date }) => {
    if (!date) return false;

    const eventDate = new Date(date);
    const chileOffset = -3 * 60;
    const eventTimeInChile = new Date(
      eventDate.getTime() + chileOffset * 60 * 1000
    );
    const dayOfWeek = eventTimeInChile.getUTCDay();

    if (day.toLowerCase() === "viernes") {
      return dayOfWeek === 5;
    } else if (
      day.toLowerCase() === "sabado" ||
      day.toLowerCase() === "sábado"
    ) {
      return dayOfWeek === 6;
    }
    return false;
  });

  // Si no hay eventos, no mostrar nada
  if (dayEvents.length === 0) {
    return null;
  }

  // Encontrar hora inicial y final
  const eventTimes = dayEvents.map(({ date }) => {
    const eventDate = new Date(date);
    const chileOffset = -3 * 60;
    const eventTimeInChile = new Date(
      eventDate.getTime() + chileOffset * 60 * 1000
    );
    return eventTimeInChile.getUTCHours();
  });

  const startHour = Math.min(...eventTimes);
  const endHour = Math.max(...eventTimes);

  // Generar array de horas
  const hours = [];
  for (let h = startHour; h <= endHour; h++) {
    hours.push(h);
  }

  // Organizar eventos por sala
  const salas = ["subte", "piso 1", "piso 2"];

  // Función para obtener la hora de un evento
  const getEventHour = (date) => {
    const eventDate = new Date(date);
    const chileOffset = -3 * 60;
    const eventTimeInChile = new Date(
      eventDate.getTime() + chileOffset * 60 * 1000
    );
    return eventTimeInChile.getUTCHours();
  };

  return (
    <div className={css.root}>
      <div className={css.daymarquee}>{day}</div>
      <div className={css.grid}>
        {/* Header */}
        {!noHeading && (
          <>
            <div className={css.headerHoras} />
            <div className={css.header}>SUBTE</div>
            <div className={css.header}>SALA.01</div>
            <div className={css.header}>SALA.02</div>
          </>
        )}
        {/* Mobile header - always render but hidden on desktop */}

        {/* Rows por cada hora */}
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            {/* Columna de horas */}
            <div className={css.hourCell}>
              {hour.toString().padStart(2, "0")}:00
            </div>

            {/* Columnas de salas - Desktop */}
            {salas.map((sala) => {
              const eventsInSlot = dayEvents.filter(
                (event) =>
                  event.sala.toLowerCase().includes(sala.toLowerCase()) &&
                  getEventHour(event.date) === hour
              );

              return (
                <div key={`${hour}-${sala}`} className={css.eventCell}>
                  {eventsInSlot.map((event) => (
                    <EventCard
                      key={event.slug}
                      {...event}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                </div>
              );
            })}

            {/* Columna de eventos - Mobile */}
            <div className={css.mobileEventCell}>
              {dayEvents
                .filter((event) => getEventHour(event.date) === hour)
                .map((event) => (
                  <EventCard
                    key={event.slug}
                    {...event}
                    onClick={() => onEventClick(event)}
                  />
                ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DayTable;
