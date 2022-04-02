const express = require("express");
const { createNewGame } = require("../controllers/gameController");

const gameRouter = express.Router();

gameRouter.post("/new_game", createNewGame);

module.exports = gameRouter;
