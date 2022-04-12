import React, { useEffect, useState } from "react";
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
  const { selectedGame, gameDetailsScreen, games, weekDays, fullMonths, loadGames } =
    useMisen();

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
    fetch("http://127.0.0.1:4040/games/one_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: gameId }),
    })
      .then((response) => response.json())
      .then((data) => {
        selectedGame(data);
        gameDetailsScreen();
      });
  };

  useEffect(() => {
    fetch("http://127.0.0.1:4040/games", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => loadGames(data));
  }, []);

  return games.length === 0 ? (
    <div>
      <h2>Loading games...</h2>
    </div>
  ) : (
    <div className="table-body-container">
      {games.map((game) => {
        return (
          <div key={game._id} className="table-data-container">
            <button onClick={() => gameDetails(game._id)}>...</button>
            <div> {game.gameNo} </div>
            <div>{formatDate(game.drawDate)}</div>
            <div> {game.gameStatus} </div>
            <div className="data-draw-numbers">
              {game.drawResults === undefined || game.drawResults.length === 0
                ? ""
                : game.drawResults[0].drawNumbers.map((result, i) => {
                    return <div key={i}> {result} </div>;
                  })}
            </div>
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
      .then((data) => {
        addNewGame(data);
      });
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
  const { gameDetailsScreen, updateGame, gameDetailsUpdate } = useMisen();
  const [gameFormData, setGameFormData] = useState(updateGame);

  const hideGameDetails = () => {
    gameDetailsScreen();
  };

  const handleFormInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setGameFormData({
      ...gameFormData,
      [name]: value,
    });
  };

  const handleGameUpdate = (e) => {
    e.preventDefault();
    gameFormData.drawResults = gameFormData.drawResults.split(",").map(Number);
    gameDetailsUpdate(gameFormData);
  };

  useEffect(() => {
    setGameFormData(updateGame);
  }, [updateGame]);

  return gameFormData === "" ? (
    <div>
      <h2>Loading...</h2>
    </div>
  ) : (
    <div className="game-details-overlay">
      <div className="game-details-container">
        <div className="game-details-title">
          <h2>UPDATE GAME</h2>
          <button className="game-details-btn" onClick={hideGameDetails}>
            X
          </button>
        </div>
        <form onSubmit={handleGameUpdate}>
          <div className="game-form-top">
            <div>
              <label htmlFor="gameNo">GAME NO:</label>
              <input
                type="text"
                name="gameNo"
                value={gameFormData.gameNo}
                onChange={handleFormInput}
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="drawDate">DRAW DATE:</label>
              <input
                type="date"
                name="drawDate"
                value={gameFormData.drawDate.split("T")[0]}
                onChange={handleFormInput}
                disabled={true}
              />
            </div>
            <div>
              <label htmlFor="gameStatus">GAME STATUS:</label>
              <input
                type="text"
                name="gameStatus"
                value={gameFormData.gameStatus}
                onChange={handleFormInput}
                disabled={true}
              />
            </div>
          </div>
          <div className="game-form-middle">
            <div>
              <label htmlFor="drawResults">DRAW RESULTS:</label>
              <input
                type="text"
                name="drawResults"
                value={gameFormData.drawResults}
                onChange={handleFormInput}
                autoComplete="off"
              />
            </div>
          </div>
          <div className="game-form-apply">
            <button>APPLY UPDATE</button>
          </div>
        </form>
      </div>
    </div>
  );
};
