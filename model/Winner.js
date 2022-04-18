const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
    playNo: {
      type: String,
    },
    winScore: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Winner = mongoose.model("Winner", winnerSchema);

module.exports = Winner;
