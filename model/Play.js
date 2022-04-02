const mongoose = require("mongoose");

const playSchema = mongoose.Schema(
  {
    playNo: {
      type: String,
      required: true,
    },
    playBalls: {
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
