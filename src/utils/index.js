export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Format date to "SABADO.14 — 18:30"
export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Convert to Chile time (UTC-3)
  const chileOffset = -3 * 60;
  const chileDate = new Date(date.getTime() + chileOffset * 60 * 1000);

  // Get day of week
  const dayOfWeek = chileDate.getUTCDay();
  const days = [
    "DOMINGO",
    "LUNES",
    "MARTES",
    "MIERCOLES",
    "JUEVES",
    "VIERNES",
    "SABADO",
  ];
  const dayName = days[dayOfWeek];

  // Get day number
  const dayNumber = chileDate.getUTCDate().toString().padStart(2, "0");

  // Get time
  const hours = chileDate.getUTCHours().toString().padStart(2, "0");
  const minutes = chileDate.getUTCMinutes().toString().padStart(2, "0");

  return `${dayName}.${dayNumber} — ${hours}:${minutes}`;
}

// Format sala to "SALA.01", "SALA.02", or "SUBTE"
export function formatSala(sala) {
  if (!sala) return "";

  const salaLower = sala.toLowerCase().trim();

  if (salaLower.includes("subte")) {
    return "SUBTE";
  } else if (salaLower.includes("piso 1") || salaLower === "piso 1") {
    return "SALA.01";
  } else if (salaLower.includes("piso 2") || salaLower === "piso 2") {
    return "SALA.02";
  }

  return sala.toUpperCase();
}
