const express = require("express");
const { createNewGame, createNewPlay } = require("../controllers/gameController");

const gameRouter = express.Router();

gameRouter.post("/new_game", [createNewGame, createNewPlay]);

module.exports = gameRouter;
