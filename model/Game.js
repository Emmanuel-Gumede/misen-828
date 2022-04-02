const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameNo: {
      type: String,
      required: true,
    },
    drawDate: {
      type: Date,
      required: true,
    },
    gameStatus: {
      type: String,
      default: "Open",
    },
    drawResults: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "draw",
    },
    isPlayed: {
      type: Boolean,
      default: false,
    },
    winGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
      },
    ],
    gameFinance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "budget",
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
