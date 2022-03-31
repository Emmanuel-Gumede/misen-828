export const initState = {
  isBurgerOpen: false,
};

const misenReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "BURGER_MENU":
      return {
        ...state,
        isBurgerOpen: payload,
      };

    default:
      return state;
  }
};

export default misenReducer;
