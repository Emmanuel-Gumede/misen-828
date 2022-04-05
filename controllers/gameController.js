const { path } = require("express/lib/application");
const Game = require("../model/Game");
const Play = require("../model/Play");

const createNewGame = async (req, res, next) => {
  const newGame = new Game({
    gameNo: req.body.gameNo,
    drawDate: req.body.drawDate,
  });

  await newGame.save();
  req.game = newGame;
  next();
};

const createNewPlay = async (req, res, next) => {
  const pastDrawNumbers = [4, 18, 27, 33, 39, 44, 11, 7, 18, 28, 30, 39, 47, 1];
  const playBalls = () => {
    let balls = [];
    for (let i = 1; i < 53; i++) {
      balls.push(i);
    }

    return balls;
  };

  const sumBallWins = async (draws, balls) => {
    let ballSums = [];

    for (let i = 0; i < balls.length; i++) {
      let match = 0;

      for (let j = 0; j < draws.length; j++) {
        if (draws[j] === balls[i]) {
          match++;
        }
      }

      ballSums.push({ ball: balls[i], win: match });
    }

    return ballSums;
  };

  const sortPlayBalls = async (matched) => {
    const ballsSort = matched;
    const balls = await ballsSort.sort((a, b) => b.win - a.win);
    const ballsSorted = [];

    for (let i = 0; i < balls.length; i++) {
      ballsSorted.push(balls[i].ball);
    }

    return ballsSorted;
  };

  const buildPlayers = async () => {
    const players = [];

    for (let i = 0; i < pastDrawNumbers.length / 7 + 1; i++) {
      let pastDraws = pastDrawNumbers.slice(0, i * 7);
      let matchedBalls = await sumBallWins(pastDraws, playBalls());
      let rankedBalls = await sortPlayBalls(matchedBalls);
      let playNo = () => {
        if (i.toString.length === 1) return "P000" + i;
        if (i.toString.length === 2) return "P00" + i;
        if (i.toString.length === 3) return "P0" + i;
        if (i.toString.length === 4) return "P" + i;
      };
      let newPlay = new Play({
        gameNo: req.game._id,
        playNo: playNo(),
        ballRanks: rankedBalls,
        winIndex: [],
      });
      players.push(newPlay);
    }
    return players;
  };

  const gamePlayers = await buildPlayers();
  let plays = gamePlayers.length;
  let playIds = [];

  const savePlays = async () => {
    let play = gamePlayers.pop();
    await play.save((err, saved) => {
      if (err) {
        console.log(err);
      }
    });
    playIds.push(play._id);

    if (--plays) {
      savePlays();
    } else {
      await Game.findByIdAndUpdate(
        req.game._id,
        {
          $push: { gamePlays: playIds },
        },
        { new: true }
      );
    }
  };

  await savePlays();

  const resObject = {
    gameId: req.game._id,
    gameNo: req.game.gameNo,
    drawDate: req.game.drawDate,
    gameStatus: req.game.gameStatus,
  };

  res.json(resObject);
};

const getOneGame = async (req, res, next) => {
  const game = await Game.findById({ _id: req.body.gameId }).populate({
    path: "gamePlays",
  });
  res.json(game);
};

module.exports = { createNewGame, createNewPlay, getOneGame };
