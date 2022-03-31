import React, { useState } from "react";
import useMisen from "../context/MisenContext";
import "../styles/Games.css";

const Games = () => {
  const [newGame, setNewGame] = useState(false);

  return (
    <section className="misen-display">
      <div className="game-container">
        <GamesMenu />
        <GamesTableHeader />
        {!newGame ? "" : <NewGameForm />}
      </div>
    </section>
  );
};

export default Games;

const GamesMenu = () => {
  const { isBurgerOpen } = useMisen();

  return (
    <div className={`menu-overlay ${!isBurgerOpen ? "" : "overlay-active"}`}>
      <div className={`menu-container ${!isBurgerOpen ? "" : "menu-active"}`}>
        <h1>Games Menu</h1>
        <div>Create New Game</div>
      </div>
    </div>
  );
};

const GamesTableHeader = () => {
  const tableHeader = [
    { title: "...", attrib: "" },
    { title: "Game No", attrib: "" },
    { title: "Draw Date", attrib: "" },
    { title: "Stage", attrib: "" },
    { title: "Draw Results", attrib: "" },
    { title: "Winners", attrib: "" },
    { title: "Played", attrib: "" },
    { title: "Spent", attrib: "" },
    { title: "Gained", attrib: "" },
  ];
  return (
    <div className="table-header-container">
      {tableHeader.map((head, i) => {
        return <div key={i}> {head.title} </div>;
      })}
    </div>
  );
};

const NewGameForm = () => {
  return (
    <div className="game-form-overlay">
      <div className="game-form-container">
        <h1>New Game</h1>
      </div>
    </div>
  );
};
