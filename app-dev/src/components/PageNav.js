import { NavLink } from "react-router-dom";
import "../styles/PageNav.css";

const PageNav = () => {
  return (
    <div className="app-nav-container">
      <NavLink to="/">GAMES</NavLink>
      <NavLink to="/Groups">GROUPS</NavLink>
    </div>
  );
};

export default PageNav;
