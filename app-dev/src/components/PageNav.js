import { NavLink } from "react-router-dom";

const PageNav = () => {
  return (
    <div>
      <NavLink to="/">Games</NavLink>
      <NavLink to="/Groups">Groups</NavLink>
    </div>
  );
};

export default PageNav;
