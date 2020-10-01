const express = require("express");
const router = express.Router();
const model = require("../model/index.js");

let newScores = async (req, res, next) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let playNumbers = await model.getPlayNumbers();

	for (let g = 0; g < playNumbers.length; g++) {
		let winGroup = [];
		let winGroupI = [];
		for (let j = 0; j < playNumbers[g].groupNumbers.length; j++) {
			let matchCount = 0;
			for (let i = 0; i < drawNumbers.length; i++) {
				if (playNumbers[g].groupNumbers[j].includes(drawNumbers[i])) {
					matchCount++;
				}
			}
			if (matchCount >= 3) {
				winGroup.push(1);
				winGroupI.push(playNumbers[g].groupNumbers.indexOf(playNumbers[g].groupNumbers[j]) + 1);
			} else {
				winGroup.push(0);
			}
		}
		if (winGroupI.length === 0) winGroupI.push(0);
		await model.addNewScore(playNumbers[g].groupName, winGroupI);
		console.log(`Added score for ${playNumbers[g].groupName} = ${winGroupI}`);
	}
	next();
};

let newDraw = async (req, res, next) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let bonusNumber = drawNumbers.pop();
	let newGameNumber = (await model.lastGameNumber()) + 1;
	let newDrawNumber = (await model.lastDrawNumber()) + 1;
	let newDraw = {
		gameNumber: newGameNumber,
		drawNumber: newDrawNumber,
		drawDate: req.body.drawDate,
		drawNumbers: drawNumbers,
		bonusNumber: bonusNumber,
	};
	await model.addNewDraw(newDraw);
	next();
};

let newGroup = async (req, res, next) => {
	let newGameNumber = (await model.lastGameNumber()) + 1;
	let groupNumber;

	if (newGameNumber < 10) {
		groupNumber = "000" + newGameNumber;
	} else if (newGameNumber > 9 && newGameNumber < 100) {
		groupNumber = "00" + newGameNumber;
	} else if (newGameNumber > 99 && newGameNumber < 1000) {
		groupNumber = "0" + newGameNumber;
	} else {
		groupNumber = newGameNumber.toString();
	}

	let newGroup = {
		groupName: `m${groupNumber}a`,
		gameTracker: newGameNumber,
		lastUpdate: null,
		lastTrained: null,
		trainingError: null,
	};
	await model.addNewGroup(newGroup);
	next();
};

router.get("/home", async (req, res) => {
	await model.initData();
	let drawData = await model.drawHistory();
	let groupList = await model.groupNames();
	//await model.deleteGame(0);
	drawData.reverse();
	return res.render("home", {
		title: "Misen Player | Home",
		style: "./styles/group.css",
		template: "home-template",
		drawData,
		groupList,
	});
});

router.post("/draw", [newScores, newDraw, newGroup], async (req, res) => {
	let games = await model.lastGameNumber();
	let groupList = await model.groupNames();

	for (let i = 0; i < games + 1; i++) {
		let rank = await ballRank(i);
		let playGroup = [];
		let subGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
		let groupEnd = 0;
		let groupInt = 4;

		for (let s = 0; s < subGroups.length; s++) {
			groupEnd = groupEnd + 4;
			subGroups[s] = rank.slice(s * groupInt, groupEnd);
		}

		for (let p = 0; p < subGroups.length; p++) {
			if (subGroups[p + 1] !== undefined) {
				playGroup.push(subGroups[p].concat(subGroups[p + 1]).sort((a, b) => a - b));
			} else {
				playGroup.push(subGroups[p].concat(subGroups[0]).sort((a, b) => a - b));
			}
		}

		await model.updatePlayNumbers(groupList[i], playGroup);
	}

	return res.redirect("/home");
});

router.get("/home/:group", (req, res) => {
	let groupName = req.params.group;
	return res.render("group", {
		title: "Misen Player | Group",
		style: "../styles/group.css",
		template: "home-template",
		group: groupName,
	});
});

async function ballFrequency(ball, draws) {
	let drawData = await model.drawHistory();
	let drawList = [];

	for (let i = 0; i < drawData.length; i++) {
		for (let j = 0; j < drawData[i].drawNumbers.length; j++) {
			drawList.push(drawData[i].drawNumbers[j]);
		}
		drawList.push(drawData[i].bonusNumber);
	}

	let tCount = 0;
	for (let i = drawList.length - draws * 7; i < drawList.length; i++) {
		if (drawList[i] === parseInt(ball)) {
			tCount++;
		}
	}
	return tCount;
}

async function drawSum(draw) {
	let drawCounts = await model.ballWeights();
	let drawBalls = await model.playBalls();

	for (let i = 0; i < drawBalls.length; i++) {
		drawCounts[i + 1] = (await ballFrequency(drawBalls[i], draw)) + drawCounts[i + 1];
	}

	return drawCounts;
}

async function ballRank(games) {
	let ballsOrig = await drawSum(games);
	let ballsSort = await drawSum(games);
	let totals = Object.values(ballsSort);
	let balls = Object.values(ballsOrig);
	let ball_sorted = [];

	totals.sort((a, b) => b - a);
	for (let i = 0; i < totals.length; i++) {
		for (let j = 0; j < balls.length; j++) {
			if (balls[j] === totals[i]) {
				ball_sorted.push(j + 1);
			}
		}
	}
	return ball_sorted;
}

module.exports = router;
