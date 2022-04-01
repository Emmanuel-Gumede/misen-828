import React, { useState } from "react";
import useMisen from "../context/MisenContext";
import "../styles/Games.css";

const Games = () => {
  const { isNewGameEntry } = useMisen();

  return (
    <section className="misen-display">
      <div className="game-container">
        <GamesTableHeader />
        <GamesTableBody />
        {!isNewGameEntry ? "" : <NewGameForm />}
      </div>
    </section>
  );
};

export default Games;

// const GamesMenu = () => {
//   const { isBurgerOpen, burgerMenu, newGameForm } = useMisen();

//   return (
//     <div className={`menu-overlay ${!isBurgerOpen ? "" : "overlay-active"}`}>
//       <div className={`menu-container ${!isBurgerOpen ? "" : "menu-active"}`}>
//         <h2>Games Menu</h2>
//         <div
//           onClick={() => {
//             burgerMenu();
//             newGameForm();
//           }}
//         >
//           Create New Game...
//         </div>
//       </div>
//     </div>
//   );
// };

const GamesTableHeader = () => {
  const { newGameForm } = useMisen();
  const tableHeader = [
    { title: "Game No", attrib: "" },
    { title: "Draw Date", attrib: "" },
    { title: "Game Stage", attrib: "" },
    { title: "Draw Results", attrib: "" },
    { title: "Winners", attrib: "" },
    { title: "Played", attrib: "" },
    { title: "Spent", attrib: "" },
    { title: "Gained", attrib: "" },
  ];
  return (
    <div className="table-header-container">
      <div className="table-header-new" onClick={() => newGameForm()}>
        +
      </div>
      {tableHeader.map((head, i) => {
        return <div key={i}> {head.title} </div>;
      })}
    </div>
  );
};

const GamesTableBody = () => {
  const { games } = useMisen();

  return (
    <div className="table-body-container">
      {games.map((game, i) => {
        return (
          <div key={i} className="table-data-container">
            <div>...</div>
            <div> {game.gameNo} </div>
            <div> {game.drawDate} </div>
            <div>Initial</div>
          </div>
        );
      })}
    </div>
  );
};

const NewGameForm = () => {
  const { newGameForm, addNewGame } = useMisen();
  const defaultFormValue = {
    gameNo: "",
    drawDate: "",
  };
  const [formData, setFormData] = useState(defaultFormValue);

  const handleInput = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewGame(formData);
    newGameForm();
  };

  return (
    <div className="game-form-overlay">
      <div className="game-form-container">
        <form className="new-game-form" onSubmit={handleSubmit}>
          <h2>CREATE NEW GAME</h2>
          <div>
            <label htmlFor="gameNo">Game No:</label>
            <input
              type="text"
              name="gameNo"
              value={formData.gameNo}
              onChange={handleInput}
              autoComplete="off"
              placeholder="Enter new game number..."
            />
          </div>
          <div>
            <label htmlFor="drawDate">Draw Date:</label>
            <input
              type="date"
              name="drawDate"
              value={formData.drawDate}
              onChange={handleInput}
            />
          </div>
          <button>Submit</button>
        </form>
        <div className="game-form-exit">
          <span onClick={() => newGameForm()}>Cancel</span>
        </div>
      </div>
    </div>
  );
};
