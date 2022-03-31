import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/Layout.css";

const Layout = () => {
  return (
    <main className="app-layout">
      <Header />
      <Outlet />
      <Footer />
    </main>
  );
};

export default Layout;
