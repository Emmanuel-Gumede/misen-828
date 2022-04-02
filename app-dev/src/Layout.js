import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import "./styles/Layout.css";
import SideMenu from "./components/SideMenu";

const Layout = () => {
  return (
    <main className="app-layout">
      <Header />
      <SideMenu />
      <Outlet />
    </main>
  );
};

export default Layout;
