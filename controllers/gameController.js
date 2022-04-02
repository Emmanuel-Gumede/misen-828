//create a new game & save it

//get saved lotto results - each draw is equal to a play

//play-0000 = {rankedBalls: [], winIndex: []}

//get all saved results and concatinate them into an array of game-001 to game-999

//create a ball: count array

//update ball count with results

//sort the balls from the highest to lowest count

const Game = require("../model/Game");
const Play = require("../model/Play");

const createNewGame = async (req, res, next) => {
  const newGame = new Game({
    gameNo: req.body.gameNo,
    drawDate: req.body.drawDate,
  });

  await newGame.save();
  console.log(newGame);

  res.json({ message: "New game was created" });
};

module.exports = { createNewGame };
