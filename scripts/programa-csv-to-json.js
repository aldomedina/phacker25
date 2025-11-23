import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import slug from "slug";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function createDateFromDiaAndHorario(dia, horario) {
  // Si no hay horario, retornar null
  if (!horario || horario.trim() === "") {
    return null;
  }

  // Definir las fechas del evento
  // Viernes 13 de diciembre de 2024
  // Sábado 14 de diciembre de 2024
  const year = 2024;
  const month = 11; // diciembre (0-indexed, entonces 11 = diciembre)

  let day;
  if (dia.toLowerCase().includes("viernes")) {
    day = 13;
  } else if (
    dia.toLowerCase().includes("sabado") ||
    dia.toLowerCase().includes("sábado")
  ) {
    day = 14;
  } else {
    // Si no es viernes ni sábado, retornar null
    return null;
  }

  // Parsear el horario (formato: "HH:MM" o "HH:mm")
  const timeParts = horario.split(":");
  if (timeParts.length !== 2) {
    return null;
  }

  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);

  if (isNaN(hours) || isNaN(minutes)) {
    return null;
  }

  // Crear el objeto Date
  const date = new Date(year, month, day, hours, minutes, 0);
  return date.toISOString();
}

function csvToJson(csvPath) {
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // Get headers from the first line
  const headers = parseCSVLine(lines[0]);

  // Parse the rest of the lines
  const data = [];
  const usedIds = new Set();

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const item = {};

    headers.forEach((header, index) => {
      // Clean header name (remove spaces)
      const cleanHeader = header.trim();
      item[cleanHeader] = values[index] || "";
    });

    // Generate unique ID from nombre
    let baseId = slug(item.nombre || `item-${i}`, { lower: true });
    let uniqueId = baseId;
    let counter = 1;

    // Ensure ID is unique
    while (usedIds.has(uniqueId)) {
      uniqueId = `${baseId}-${counter}`;
      counter++;
    }

    usedIds.add(uniqueId);
    item.slug = uniqueId;

    // Renombrar campos
    if (item.bio !== undefined) {
      item.author_bio = item.bio;
      delete item.bio;
    }

    if (item.facilitador !== undefined) {
      item.autor = item.facilitador;
      delete item.facilitador;
    }

    if (item.nombre !== undefined) {
      item.titulo = item.nombre;
      delete item.nombre;
    }

    // Eliminar campo confirmado
    delete item.confirmado;

    // Combinar dia y horario en un campo date
    const date = createDateFromDiaAndHorario(item.dia, item.horario);
    if (date) {
      item.date = date;
    }

    // Eliminar los campos dia y horario originales
    delete item.dia;
    delete item.horario;

    // Convertir tipo a array
    if (item.tipo) {
      // Separar por coma y limpiar espacios
      const tipos = item.tipo
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t !== "");
      item.tipo = tipos;
    } else {
      item.tipo = [];
    }

    data.push(item);
  }

  return data;
}

function generateJavaScriptFile(data, outputPath) {
  const jsContent = `// This file is auto-generated from scripts/data/data.csv
// Do not edit manually - run 'npm run generate:programs' to update

export const programs = ${JSON.stringify(data, null, 2)};

export default programs;
`;

  fs.writeFileSync(outputPath, jsContent, "utf-8");
}

// Main execution
const csvPath = path.join(__dirname, "data", "data.csv");
const outputPath = path.join(__dirname, "..", "src", "data", "programs.js");

try {
  console.log("Reading CSV file:", csvPath);
  const data = csvToJson(csvPath);

  console.log(`Parsed ${data.length} program items`);

  // Create the output directory if it doesn't exist
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Writing JavaScript file:", outputPath);
  generateJavaScriptFile(data, outputPath);

  console.log("✅ Successfully converted CSV to JavaScript!");
  console.log(`Output: ${outputPath}`);
} catch (error) {
  console.error("❌ Error:", error);
  throw error;
}
