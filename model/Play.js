const mongoose = require("mongoose");

const playSchema = mongoose.Schema(
  {
    gameNo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    playNo: {
      type: String,
      required: true,
    },
    ballRanks: {
      type: Array,
    },
    winIndex: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Play = mongoose.model("Play", playSchema);

module.exports = Play;
