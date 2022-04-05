import React, { useState } from "react";
import useMisen from "../context/MisenContext";
import "../styles/Games.css";

const Games = () => {
  const { isNewGameEntry, isDetails } = useMisen();

  return (
    <section className="misen-display">
      <div className="game-container">
        <GamesTableHeader />
        <GamesTableBody />
        {!isNewGameEntry ? "" : <NewGameForm />}
        {!isDetails ? "" : <GameDetails />}
      </div>
    </section>
  );
};

export default Games;

const GamesTableHeader = () => {
  const { newGameForm } = useMisen();
  const tableHeader = [
    { title: "Game No.", attrib: "" },
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
  const { selectedGame, gameDetailsScreen, isDetails } = useMisen();
  const { games, weekDays, fullMonths } = useMisen();

  const formatDate = (date) => {
    const weekDay = weekDays[new Date(date).getDay()];
    const monthDate =
      new Date(date).getDate().toString().length === 1
        ? "0" + new Date(date).getDate()
        : new Date(date).getDate();
    const month = fullMonths[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();

    return weekDay + ", " + monthDate + " " + month + " " + year;
  };

  const gameDetails = (gameId) => {
    console.log(isDetails);
    fetch("http://127.0.0.1:4040/games/one_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: gameId }),
    })
      .then((response) => response.json())
      .then((data) => selectedGame(data));

    gameDetailsScreen();
  };

  return (
    <div className="table-body-container">
      {games.map((game) => {
        return (
          <div key={game.gameId} className="table-data-container">
            <button onClick={() => gameDetails(game.gameId)}>...</button>
            <div> {game.gameNo} </div>
            <div>{formatDate(game.drawDate)}</div>
            <div> {game.gameStatus} </div>
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
    fetch("http://127.0.0.1:4040/games/new_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => addNewGame(data));
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

const GameDetails = () => {
  const { gameDetailsScreen } = useMisen();

  const hideGameDetails = () => {
    gameDetailsScreen();
  };

  return (
    <div className="game-details-overlay">
      <div className="game-details-container">
        <div>
          <h2>UPDATE GAME</h2>
          <button onClick={hideGameDetails}>X</button>
        </div>
        <form>
          <label>GAME NO:</label>
          <input type="text" disabled="true" />
        </form>
      </div>
    </div>
  );
};
