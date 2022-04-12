const express = require("express");
const {
  createNewGame,
  createNewPlay,
  getOneGame,
  addNewDraw,
  getAllGames,
  playGroupInit,
} = require("../controllers/gameController");

const gameRouter = express.Router();

gameRouter.post("/new_game", [playGroupInit, createNewGame, createNewPlay]);
gameRouter.post("/one_game", getOneGame);
gameRouter.post("/new_draw", addNewDraw);
gameRouter.get("/", getAllGames);

module.exports = gameRouter;
