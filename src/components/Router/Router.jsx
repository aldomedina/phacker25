import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import { paths, routes } from "./routes";
import Meta from "../Meta";

const Router = () => (
  <Routes>
    {routes.map((route) => {
      const isHome = route.path === paths.home;
      const isPrograma = route.path === paths.programa;
      // Generar rutas tanto para español como para inglés
      return (
        <Route
          key={route.path}
          element={<Layout noPadding={isHome} noPaddingX={isPrograma} />}
        >
          {/* Ruta en español (default) */}
          <Route
            path={route.path}
            index={route.index}
            element={
              <>
                <Meta {...route.meta} />
                {route.component}
              </>
            }
          />
          {/* Ruta en inglés (/en/*) */}
          <Route
            path={isHome ? "/en" : `/en${route.path}`}
            element={
              <>
                <Meta {...route.meta} />
                {route.component}
              </>
            }
          />
        </Route>
      );
    })}
  </Routes>
);

export default Router;
