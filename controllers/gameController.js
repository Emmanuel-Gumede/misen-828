const Game = require("../model/Game");
const Play = require("../model/Play");
const Draw = require("../model/Draw");
const Group = require("../model/Group");

const playGroupInit = async (req, res, next) => {
  const confirmGroups = await Group.find({}).exec();

  const createGroups = () => {
    const groupRange = () => {
      let balls = [];
      for (let i = 1; i < 53; i++) {
        balls.push(i);
      }
      return balls;
    };

    const groups = [];

    for (let i = 0; i < groupRange().length / 4 - 1; i++) {
      let gSlice = 4;
      let groupA = groupRange().slice(gSlice * i, gSlice * (i + 1));
      for (let j = 0; j < groupRange().length / 4 - (i + 1); j++) {
        let groupA1 = groupRange().slice(gSlice * (i + j + 1), gSlice * (i + j + 2));
        groups.push(groupA.concat(groupA1));
      }
    }
    return groups;
  };

  const createNewGroups = async (gameIdx) => {
    for (let i = 0; i < gameIdx.length; i++) {
      const newGroup = new Group({
        groupName: i.toString().length === 1 ? "G00" + (i + 1) : "G0" + (i + 1),
        groupIndex: gameIdx[i],
      });
      await newGroup.save();
    }
  };

  if (confirmGroups.length > 0) {
    next();
  } else {
    await createNewGroups(createGroups());
    next();
  }
};

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
  const drawResults = await Draw.find({});
  const pastDrawNumbers = () => {
    let finalNumbers = [];

    for (let i = 0; i < drawResults.length; i++) {
      let numbers = finalNumbers;
      finalNumbers = numbers.concat(drawResults[i].drawNumbers);
    }

    return finalNumbers;
  };

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

  // const createPlayGroups = async (ranks) => {
  //   const groups = await Group.find({}).exec();
  //   const playGroups = [];

  //   for (let i = 0; i < groups.length; i++) {
  //     let groupId = groups[i]._id;
  //     let groupNumbers = [];
  //     for (let j = 0; j < groups[i].groupIndex.length; j++) {
  //       groupNumbers.push(ranks[groups[i].groupIndex[j] - 1]);
  //     }
  //     playGroups.push({
  //       groupId: groupId,
  //       groupNumbers: groupNumbers,
  //     });
  //   }
  //   return playGroups;
  // };

  const buildPlayers = async () => {
    const players = [];

    for (let i = 0; i < pastDrawNumbers().length / 7 + 1; i++) {
      let pastDraws = pastDrawNumbers().slice(0, i * 7);
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

      players.push(await newPlay);
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
    drawResults: [],
  };

  res.json(resObject);
};

const getOneGame = async (req, res, next) => {
  const game = await Game.findById({ _id: req.body.gameId }).populate({
    path: "gamePlays",
  });
  res.json(game);
};

const addNewDraw = async (req, res, next) => {
  const newDraw = new Draw({
    drawGame: req.body.gameId,
    drawNumbers: req.body.drawNumbers,
  });

  await newDraw.save();
  await Game.findByIdAndUpdate(
    req.body.gameId,
    { $set: { drawResults: newDraw._id } },
    { new: true }
  );
  res.json(newDraw);
};

const getAllGames = async (req, res, next) => {
  const games = await Game.find({})
    .populate({ path: "drawResults", select: "drawNumbers" })
    .populate({ path: "gamePlays" });

  games.reverse();
  res.json(games);
};

module.exports = {
  playGroupInit,
  createNewGame,
  createNewPlay,
  getOneGame,
  addNewDraw,
  getAllGames,
};
