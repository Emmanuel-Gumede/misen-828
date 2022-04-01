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

  const newGameForm = () => {
    if (!state.isNewGameEntry) {
      dispatch({
        type: "NEW_GAME_FORM",
        payload: true,
      });
    } else {
      dispatch({
        type: "NEW_GAME_FORM",
        payload: false,
      });
    }
  };

  const addNewGame = (game) => {
    dispatch({
      type: "ADD_NEW_GAME",
      payload: game,
    });
  };

  const value = {
    isBurgerOpen: state.isBurgerOpen,
    isNewGameEntry: state.isNewGameEntry,
    games: state.games,
    burgerMenu,
    newGameForm,
    addNewGame,
  };

  return <MisenContext.Provider value={value}>{children}</MisenContext.Provider>;
};

const useMisen = () => {
  const context = useContext(MisenContext);
  return context;
};

export default useMisen;
