export const initState = {
  isBurgerOpen: false,
  isNewGameEntry: false,
  isDetails: false,
  games: [],
  selectedGame: "",
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

    case "SELECTED_GAME":
      return {
        ...state,
        selectedGame: payload,
      };

    case "GAME_DETAILS_SCREEN":
      return {
        ...state,
        isDetails: payload,
      };

    default:
      return state;
  }
};

export default misenReducer;
