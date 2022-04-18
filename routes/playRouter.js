const express = require("express");
const { getAllPlays } = require("../controllers/playController");

const playRouter = express.Router();

playRouter.get("/", getAllPlays);

module.exports = playRouter;
