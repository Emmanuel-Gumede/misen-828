import { NavLink } from "react-router-dom";
import "../styles/Header.css";
import burgerO from "../images/burger-c.png";
import burgerC from "../images/burger-o.png";
import useMisen from "../context/MisenContext";

const Header = () => {
  return (
    <section className="misen-header">
      <div className="header-wrapper">
        <BurgerMenu />
        <Brand />
        <Flag />
        <UserAccess />
      </div>
    </section>
  );
};

export default Header;

const BurgerMenu = () => {
  const { isBurgerOpen, burgerMenu } = useMisen();
  return (
    <div className="app-burger-menu" onClick={() => burgerMenu()}>
      {!isBurgerOpen ? (
        <img src={burgerO} alt="burger" />
      ) : (
        <img src={burgerC} alt="burger" />
      )}
    </div>
  );
};

const Brand = () => {
  return (
    <div className="misen-brand">
      <img src="" alt="brand-logo" />
      <h1>MISEN LOTTO STRATEGY</h1>
      <div>
        <div></div>
        <h3>group play</h3>
        <div></div>
      </div>
    </div>
  );
};

const Flag = () => {
  return (
    <div className="misen-flag">
      <h3>Latest Results</h3>
      <div>NUMBERS</div>
      <div>
        <span>Thursday</span>
        <span>24 March 2022</span>
      </div>
    </div>
  );
};

const UserAccess = () => {
  return (
    <div className="misen-access">
      <NavLink to="sign-in">Sign In</NavLink>
      <div>
        Monday <br /> 28 March 2022
      </div>
    </div>
  );
};
