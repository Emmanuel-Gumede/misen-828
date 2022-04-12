const mongoose = require("mongoose");

const drawSchema = new mongoose.Schema(
  {
    drawGame: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    drawNumbers: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Draw = mongoose.model("Draw", drawSchema);

module.exports = Draw;
