const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupIndex: {
      type: Array,
      required: true,
    },
    groupWins: [
      {
        game: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
        },
        gamePlay: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Play",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
