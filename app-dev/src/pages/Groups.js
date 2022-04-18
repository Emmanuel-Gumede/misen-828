import { useEffect } from "react";
import useGroupContext from "../context/GroupContext";
import "../styles/Groups.css";

const Groups = () => {
  const { isDetails } = useGroupContext();

  return (
    <section className="misen-display">
      <div className="groups-container">
        <GroupsCards />
        {!isDetails ? "" : <GroupDetails />}
      </div>
    </section>
  );
};

const GroupsCards = () => {
  const { groupsLoaded, playGroups, groupDetailsScreen, selectedGroup } =
    useGroupContext();

  useEffect(() => {
    groupsLoaded();
  }, []);

  const playerDetails = (groupId) => {
    selectedGroup(groupId);
    groupDetailsScreen();
  };

  return playGroups === "" || playGroups === {} ? (
    <div>
      <h2>Loading...</h2>
    </div>
  ) : (
    <div className="groups-cards-container">
      {playGroups.map((group) => {
        return (
          <div key={group._id} className="group-container">
            <div className="group-title">
              <p>GROUP: </p> {group.groupName}
            </div>
            <div className="group-players">
              {group.groupPlays[0][1].map((player, i) => {
                return <div key={i}> {player} </div>;
              })}
            </div>
            <div className="group-view-btn">
              <button onClick={() => playerDetails(group._id)}>View Tickets</button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GroupDetails = () => {
  const { groupDetailsScreen, detailGroup } = useGroupContext();

  const numberWheel = (num_array) => {
    let playNums = [];
    for (let a = 0; a < 3; a++) {
      for (let b = a + 1; b < 4; b++) {
        for (let c = b + 1; c < 5; c++) {
          for (let d = c + 1; d < 6; d++) {
            for (let e = d + 1; e < 7; e++) {
              for (let f = e + 1; f < 8; f++) {
                let boardNums = [];
                boardNums.push(num_array[a]);
                boardNums.push(num_array[b]);
                boardNums.push(num_array[c]);
                boardNums.push(num_array[d]);
                boardNums.push(num_array[e]);
                boardNums.push(num_array[f]);
                playNums.push(boardNums);
              }
            }
          }
        }
      }
    }
    return playNums;
  };

  const hideGroupDetails = () => {
    groupDetailsScreen();
  };
  return (
    <div className="group-details-overlay">
      <div className="group-details-container">
        <div className="group-details-title">
          <h1>Group Details</h1>
          <button className="group-details-btn" onClick={hideGroupDetails}>
            X
          </button>
        </div>
        <div className="group-ticket-container">
          {numberWheel(detailGroup.groupPlays[0][1]).map((ticket, i) => {
            return (
              <div key={i} className="group-play-wrapper">
                <div className="group-play-number"> {i + 1} </div>
                <div className="group-play-container">
                  {ticket.map((ball, j) => {
                    return (
                      <div key={j} className="group-play-ball">
                        {ball}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Groups;
