import { createContext, useContext, useReducer } from "react";
import misenReducer, { initState } from "../reducers/misenReducer";

const MisenContext = createContext(initState);

export const MisenProvider = ({ children }) => {
  const [state, dispatch] = useReducer(misenReducer, initState);

  const burgerMenu = () => {
    if (!state.isBurgerOpen) {
      dispatch({
        type: "BURGER_MENU",
        payload: true,
      });
    } else {
      dispatch({
        type: "BURGER_MENU",
        payload: false,
      });
    }
  };

  const value = {
    isBurgerOpen: state.isBurgerOpen,
    burgerMenu,
  };

  return <MisenContext.Provider value={value}>{children}</MisenContext.Provider>;
};

const useMisen = () => {
  const context = useContext(MisenContext);
  return context;
};

export default useMisen;
