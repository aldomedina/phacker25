import Convocatoria from "../../pages/Convocatoria";
import Evento from "../../pages/Evento";
import Manifiesto from "../../pages/Manifiesto";
import NotFound from "../../pages/NotFound";
import Conducta from "../../pages/Conducta";
import Home from "../../pages/Home";
import Programa from "../../pages/Programa";

export const paths = {
  home: "/",
  convocatoria: "/convocatoria",
  evento: "/evento",
  manifiesto: "/manifiesto",
  conducta: "/codigo-de-conducta",
  programa: "/programa",
};

export const routes = [
  {
    path: paths.home,
    component: <Home />,
    index: true,
    meta: { title: "PHACKER:25", description: "" },
  },
  {
    path: paths.convocatoria,
    component: <Convocatoria />,
    meta: { title: "PHACKER:25 | Convocatoria", description: "" },
  },
  {
    path: paths.evento,
    component: <Evento />,
    meta: { title: "PHACKER:25 | Evento", description: "" },
  },
  {
    path: paths.manifiesto,
    component: <Manifiesto />,
    meta: { title: "PHACKER:25 | Manifiesto", description: "" },
  },
  {
    path: paths.conducta,
    component: <Conducta />,
    meta: { title: "PHACKER:25 | Conducta", description: "" },
  },
  {
    path: paths.programa,
    component: <Programa />,
    meta: { title: "PHACKER:25 | Programa", description: "" },
  },
  {
    path: "*",
    component: <NotFound />,
    meta: { title: "PHACKER:25 | NotFound" },
  },
];

export const DEFAULT_META_DESCRIPTION = `
    Primavera Hacker es un encuentro anual de pensamiento crítico, tecnologías libres y 
    prácticas hacker, que se celebra en Santiago de Chile desde 2013. Durante dos días de talleres, 
    charlas y experimentos colectivos, nos reunimos para compartir saberes, habitar redes propias, 
    romper la infraestructura que nos oprime y pensar futuros donde la tecnología esté al servicio 
    de la autonomía y la imaginación radical.
`;

export const DEFAULT_META_KEYWORDS = [
  "Primavera Hacker",
  "encuentro hacker Chile",
  "tecnologías libres",
  "pensamiento crítico",
  "hacktivismo",
  "autonomía tecnológica",
  "cultura hacker",
  "Santiago Chile",
  "talleres hackers",
  "charlas tecnología libre",
  "experimentos colectivos",
  "redes autónomas",
  "infraestructura crítica",
  "Crónicamente Online",
  "guerra cognitiva",
  "loops afectivos",
  "reapropiación tecnológica",
  "imaginación radical",
  "evento hacker 2025",
  "software libre",
  "privacidad digital",
  "ciberseguridad",
  "hackeo creativo",
  "tecnologías disruptivas",
  "futuro digital",
].join(", ");
