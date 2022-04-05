import { createContext, useContext, useReducer } from "react";
import misenReducer, { initState } from "../reducers/misenReducer";

const MisenContext = createContext(initState);

export const MisenProvider = ({ children }) => {
  const [state, dispatch] = useReducer(misenReducer, initState);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const fullMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

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

  const selectedGame = (game) => {
    dispatch({
      type: "SELECTED_GAME",
      payload: game,
    });
  };

  const gameDetailsScreen = () => {
    if (!state.isDetails) {
      dispatch({
        type: "GAME_DETAILS_SCREEN",
        payload: true,
      });
    } else {
      dispatch({
        type: "GAME_DETAILS_SCREEN",
        payload: false,
      });
    }
  };

  const value = {
    isBurgerOpen: state.isBurgerOpen,
    isNewGameEntry: state.isNewGameEntry,
    isDetails: state.isDetails,
    games: state.games,
    weekDays,
    fullMonths,
    burgerMenu,
    newGameForm,
    addNewGame,
    selectedGame,
    gameDetailsScreen,
  };

  return <MisenContext.Provider value={value}>{children}</MisenContext.Provider>;
};

const useMisen = () => {
  const context = useContext(MisenContext);
  return context;
};

export default useMisen;
