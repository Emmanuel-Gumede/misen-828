import "../styles/SideMenu.css";
import Footer from "./Footer";
import PageNav from "./PageNav";

const SideMenu = () => {
  return (
    <section className="misen-side-menu">
      <div className="side-menu-container">
        <div></div>
        <div>
          <PageNav />
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </section>
  );
};

export default SideMenu;
