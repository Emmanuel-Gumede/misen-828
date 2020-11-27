const express = require("express");
const router = express.Router();
const model = require("../model/index.js");
const brain = require("brain.js");
const fs = require("fs");

let newScores = async (req, res, next) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let playNumbers = await model.getPlayNumbers();

	for (let g = 0; g < playNumbers.length; g++) {
		let winGroupI = [];
		let winStatus = await model.getWinStatus(playNumbers[g].groupName);
		if (winStatus === undefined) winStatus = 0;

		for (let j = 0; j < playNumbers[g].groupNumbers.length; j++) {
			let matchCount = 0;
			for (let i = 0; i < drawNumbers.length; i++) {
				if (playNumbers[g].groupNumbers[j].includes(drawNumbers[i])) {
					matchCount++;
				}
			}
			if (matchCount >= 3) {
				winGroupI.push(playNumbers[g].groupNumbers.indexOf(playNumbers[g].groupNumbers[j]) + 1);
			}
		}
		if (winGroupI.length === 0) {
			winGroupI.push(0);
			winStatus = 0;
		} else {
			winStatus++;
		}
		await model.addNewScore(playNumbers[g].groupName, winGroupI, winStatus);
	}
	next();
};

let newDraw = async (req, res, next) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let bonusNumber = drawNumbers.pop();
	let newGameNumber = (await model.lastGameNumber()) + 1;
	let newDrawNumber = (await model.lastDrawNumber()) + 1;

	newGameNumber = isNaN(newGameNumber) ? 0 : newGameNumber;
	newDrawNumber = isNaN(newDrawNumber) ? 1731 : newDrawNumber;

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
	let newGameNumber = await model.lastGameNumber();
	let groupNumber;

	newGameNumber = isNaN(newGameNumber) ? 0 : newGameNumber;

	if (newGameNumber < 10) {
		groupNumber = "000" + (newGameNumber + 1);
	} else if (newGameNumber > 9 && newGameNumber < 100) {
		groupNumber = "00" + (newGameNumber + 1);
	} else if (newGameNumber > 99 && newGameNumber < 1000) {
		groupNumber = "0" + (newGameNumber + 1);
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
	let drawData = await model.drawHistory2();
	let groupList = await model.groupNames();
	let groupHandler = {};
	let pageMaker = Math.ceil(groupList.length / 6);

	for (let i = 0; i < pageMaker; i++) {
		groupHandler[i] = groupList.splice(0, 6);
	}

	let lastDraw = drawData[0].drawNumbers;
	let lastBonus = drawData[0].bonusNumber;

	//drawData.reverse();
	return res.render("home", {
		title: "Misen Player | Home",
		style: "./styles/group.css",
		script: "./scripts/groups.js",
		template: "home-template",
		drawData,
		groupHandler,
		lastDraw,
		lastBonus,
	});
});

router.get("/draw/data", async (req, res) => {
	let drawData = await model.drawHistory2();
	res.send(drawData);
});

router.post("/draw", [newScores, newDraw], async (req, res) => {
	let games = await model.lastGameNumber();
	let groupList = await model.groupNames();

	games = isNaN(games) ? 0 : games;

	for (let i = 0; i < games + 2; i++) {
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

router.get("/home/:group", async (req, res) => {
	let groupName = req.params.group;
	let playGroups = {};
	let playNow = await model.getPlayNumbersGroup(groupName);
	let playTitle = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

	for (let i = 0; i < playTitle.length; i++) {
		playGroups[playTitle[i]] = playNow[i];
	}

	return res.render("group", {
		title: "Misen Player | Group",
		style: "../styles/group.css",
		script: "../scripts/group.js",
		template: "home-template",
		group: groupName,
		playNums: playGroups,
	});
});

router.post("/group/train", async (req, res) => {
	const config = { activation: "sigmoid", hiddenLayers: [13, 26, 26, 13], inputSize: 13, ouputSize: 13 };
	const misen = new brain.NeuralNetwork(config);
	let groupName = req.body.group;
	let groupScores = await model.getScores(groupName);
	let train_err;
	groupScores.reverse();

	misen.train(convertData(normData(groupScores)), {
		iterations: 8000,
		log: (log) => {
			train_err = log;
		},
		logPeriod: 100,
	});

	fs.writeFileSync(`./model/train_data/${groupName}.json`, JSON.stringify(misen.toJSON(), null, "  "));
	res.send({ message: `${groupName.toUpperCase()} was trained successfully - ${train_err.error}` });
});

router.post("/group/predict", async (req, res) => {
	const misen = new brain.NeuralNetwork();
	let groupName = req.body.group;
	let groupScores = await model.getScores(groupName);
	groupScores.reverse();

	if (fs.existsSync(`./model/train_data/${groupName}.json`) == false) {
		res.send({ message: `${groupName} has not been trained` });
	} else {
		misen.fromJSON(JSON.parse(fs.readFileSync(`./model/train_data/${groupName}.json`, "utf8")));
		const output = misen.run(normRunData(normData(selectRunData(groupScores))));

		res.send(output);
	}
});

router.post("/group/wheel", async (req, res) => {
	let wheelNumbers = req.body.group;
	let playNumbers = numberWheel(wheelNumbers);
	res.send(playNumbers);
});

// Private functions //

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

function numberWheel(num_array) {
	let playNums = [];
	for (let a = 0; a < 3; a++) {
		for (let b = a + 1; b < 4; b++) {
			for (let c = b + 1; c < 5; c++) {
				for (let d = c + 1; d < 6; d++) {
					for (let e = d + 1; e < 7; e++) {
						for (let f = e + 1; f < 8; f++) {
							let boardNums = [];
							boardNums.push(num_array[a]);
							boardNums.push(num_array[b]);
							boardNums.push(num_array[c]);
							boardNums.push(num_array[d]);
							boardNums.push(num_array[e]);
							boardNums.push(num_array[f]);
							playNums.push(boardNums);
						}
					}
				}
			}
		}
	}
	return playNums;
}

function selectRunData(rundata) {
	return [rundata[rundata.length - 1]];
}

function normRunData(data) {
	return data[0];
}

function normData(rawData) {
	let normalizedData = [];
	for (let k = 0; k < rawData.length; k++) {
		let num1 = rawData[k][0];
		let num2 = rawData[k][1];
		let num3 = rawData[k][2];
		let num4 = rawData[k][3];

		rawData[k].splice(0);

		for (let i = 0; i < 13; i++) {
			if (i !== num1 - 1 && i !== num2 - 1 && i !== num3 - 1 && i !== num4 - 1) {
				rawData[k].push(0);
			} else {
				rawData[k].push(1);
			}
		}
		normalizedData.push(rawData[k]);
	}
	return normalizedData;
}

function convertData(dataArr) {
	let converted = [];
	for (let i = 0; i < dataArr.length - 1; i++) {
		let dataObj = { input: dataArr[i], output: dataArr[i + 1] };
		converted.push(dataObj);
	}
	return converted;
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
