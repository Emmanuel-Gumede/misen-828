export const initState = {
  isBurgerOpen: false,
  isNewGameEntry: false,
  isDetails: false,
  games: [],
  updateGame: "",
};

const misenReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "BURGER_MENU":
      return {
        ...state,
        isBurgerOpen: payload,
      };

    case "NEW_GAME_FORM":
      return {
        ...state,
        isNewGameEntry: payload,
      };

    case "ADD_NEW_GAME":
      return {
        ...state,
        games: [payload, ...state.games],
      };

    case "LOAD_GAMES":
      return {
        ...state,
        games: payload,
      };

    case "SELECTED_GAME":
      return {
        ...state,
        updateGame: payload,
      };

    case "GAME_DETAILS_SCREEN":
      return {
        ...state,
        isDetails: payload,
      };

    case "GAME_DETAILS_UPDATE":
      for (let i = 0; i < state.games.length; i++) {
        if (state.games[i]._id === payload.drawGame) {
          state.games[i].drawResults = [{ drawNumbers: payload.drawNumbers }];
          return state;
        }
      }
      return state;

    default:
      return state;
  }
};

export default misenReducer;
