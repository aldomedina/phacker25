import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

import css from "./Layout.module.css";

const Layout = ({ noPadding, noPaddingX }) => {
  return (
    <div className="app">
      <Navbar />
      <main className={css.main} data-full={noPadding} data-no-padding-x={noPaddingX}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
