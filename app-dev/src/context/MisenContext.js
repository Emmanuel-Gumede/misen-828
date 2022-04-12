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
    const gameId = game.gameId;
    const newGame = {
      ...game,
      _id: gameId,
    };
    dispatch({
      type: "ADD_NEW_GAME",
      payload: newGame,
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

  const loadGames = (games) => {
    dispatch({
      type: "LOAD_GAMES",
      payload: games,
    });
  };

  const gameDetailsUpdate = (game) => {
    const drawData = {
      gameId: game._id,
      drawNumbers: game.drawResults,
    };

    fetch("http://127.0.0.1:4040/games/new_draw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(drawData),
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({
          type: "GAME_DETAILS_UPDATE",
          payload: data,
        });
        gameDetailsScreen();
      });
  };

  const value = {
    isBurgerOpen: state.isBurgerOpen,
    isNewGameEntry: state.isNewGameEntry,
    isDetails: state.isDetails,
    games: state.games,
    updateGame: state.updateGame,
    weekDays,
    fullMonths,
    burgerMenu,
    newGameForm,
    addNewGame,
    selectedGame,
    gameDetailsScreen,
    gameDetailsUpdate,
    loadGames,
  };

  return <MisenContext.Provider value={value}>{children}</MisenContext.Provider>;
};

const useMisen = () => {
  const context = useContext(MisenContext);
  return context;
};

export default useMisen;
