const express = require("express");
const {
  createNewGame,
  createNewPlay,
  getOneGame,
} = require("../controllers/gameController");

const gameRouter = express.Router();

gameRouter.post("/new_game", [createNewGame, createNewPlay]);
gameRouter.post("/one_game", getOneGame);

module.exports = gameRouter;
