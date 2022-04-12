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
    gamePlays: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Play",
      },
    ],
    drawResults: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Draw",
      },
    ],
    isPlayed: {
      type: Boolean,
      default: false,
    },
    winGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      },
    ],
    gameFinance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Budget",
    },
  },
  { timestamps: true }
);

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
