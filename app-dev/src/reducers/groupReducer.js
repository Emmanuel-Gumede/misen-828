export const initialGroupData = {
  playGroups: "",
  gamePlays: "",
  groupPlayers: "",
  isDetails: false,
  detailGroup: "",
};

const groupReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "GROUPS_LOADED":
      return {
        ...state,
        playGroups: payload,
      };

    case "PLAYS_LOADED":
      return {
        ...state,
        gamePlays: payload,
      };

    case "GROUP_PLAYS":
      return {
        ...state,
        groupPlayers: [...state.groupPlayers, payload],
      };

    case "SELECTED_GROUP":
      return {
        ...state,
        detailGroup: payload,
      };

    case "GROUP_DETAILS_SCREEN":
      return {
        ...state,
        isDetails: payload,
      };

    default:
      return state;
  }
};

export default groupReducer;
