export const initState = {
  isBurgerOpen: false,
  isNewGameEntry: false,
  games: [],
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

    default:
      return state;
  }
};

export default misenReducer;
