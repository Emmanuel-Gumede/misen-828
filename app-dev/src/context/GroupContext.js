import { createContext, useContext, useReducer } from "react";
import groupReducer, { initialGroupData } from "../reducers/groupReducer";

const GroupContext = createContext(initialGroupData);

export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, initialGroupData);

  const groupsLoaded = () => {
    fetch("http://127.0.0.1:4040/groups", {
      method: "GET",
      headers: { "Contenty-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) =>
        dispatch({
          type: "GROUPS_LOADED",
          payload: data,
        })
      );
  };

  const playsLoaded = () => {
    fetch("http://127.0.0.1:4040/plays", {
      method: "GET",
      headers: { "Contenty-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) =>
        dispatch({
          type: "PLAYS_LOADED",
          payload: data,
        })
      );
  };

  const groupDetailsScreen = () => {
    if (!state.isDetails) {
      dispatch({
        type: "GROUP_DETAILS_SCREEN",
        payload: true,
      });
    } else {
      dispatch({
        type: "GROUP_DETAILS_SCREEN",
        payload: false,
      });
    }
  };

  const selectedGroup = (groupId) => {
    const selectGroup = () => {
      let group;
      for (let i = 0; i < state.playGroups.length; i++) {
        if (state.playGroups[i]._id === groupId) {
          group = state.playGroups[i];
          break;
        }
      }
      return group;
    };

    dispatch({
      type: "SELECTED_GROUP",
      payload: selectGroup(),
    });
  };

  const groupPlayNumbers = (group) => {
    const plays = [];
    console.log(group);

    for (let i = 0; i < state.gamePlays.length; i++) {
      let number = [];
      for (let j = 0; j < group.groupIndex.length; j++) {
        number.push(state.gamePlays[i].group.groupIndex[j]);
      }
      plays.push(number);
    }
    dispatch({
      type: "GROUP_PLAYS",
      payload: {
        groupNo: group.groupName,
        playNumbers: plays,
      },
    });
  };

  const value = {
    playGroups: state.playGroups,
    groupPlayers: state.groupPlayers,
    isDetails: state.isDetails,
    detailGroup: state.detailGroup,
    groupsLoaded,
    playsLoaded,
    groupPlayNumbers,
    groupDetailsScreen,
    selectedGroup,
  };
  return <GroupContext.Provider value={value}> {children} </GroupContext.Provider>;
};

const useGroupContext = () => {
  const context = useContext(GroupContext);
  return context;
};

export default useGroupContext;
