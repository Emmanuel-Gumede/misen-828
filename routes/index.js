const express = require("express");
const router = express.Router();
const model = require("../model/index.js");

router.get("/home", async (req, res) => {
	let drawData = await model.drawHistory();
	let groupList = await model.groupNames();
	drawData.reverse();
	return res.render("home", {
		title: "Misen Player | Home",
		style: "./styles/group.css",
		template: "home-template",
		drawData,
		groupList,
	});
});

let newDraw = async (req, res, next) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let allNumbers = req.body.drawNumbers.split(",").map(Number);
	let bonusNumber = drawNumbers.pop();
	let newGameNumber = (await model.lastGameNumber()) + 1;
	let newDrawNumber = (await model.lastDrawNumber()) + 1;

	let newDraw = {
		gameNumber: newGameNumber,
		drawNumber: newDrawNumber,
		drawDate: req.body.drawDate,
		drawNumbers: drawNumbers,
		bonusNumber: bonusNumber,
		fullDraw: allNumbers,
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

router.get("/home/:group", (req, res) => {
	let groupName = req.params.group;
	return res.render("group", {
		title: "Misen Player | Group",
		style: "../styles/group.css",
		template: "home-template",
		group: groupName,
	});
});

router.post("/draw", [newDraw, newGroup], async (req, res) => {
	return res.redirect("/home");
});

async function makeGroup(drawnNos, newDraw) {
	let playerGroup = "a";
	let playerNo = JSON.parse(fs.readFileSync(`./models/games/game_numbers.json`, "utf-8"));
	let groupOBJ = {};

	for (let i = 0; i < playerNo.length; i++) {
		let rank = ballRank(parseInt(playerNo[i]));
		let groupA = [rank[0], rank[1], rank[2], rank[3]];
		let groupB = [rank[4], rank[5], rank[6], rank[7]];
		let groupC = [rank[8], rank[9], rank[10], rank[11]];
		let groupD = [rank[12], rank[13], rank[14], rank[15]];
		let groupE = [rank[16], rank[17], rank[18], rank[19]];
		let groupF = [rank[20], rank[21], rank[22], rank[23]];
		let groupG = [rank[24], rank[25], rank[26], rank[27]];
		let groupH = [rank[28], rank[29], rank[30], rank[31]];
		let groupI = [rank[32], rank[33], rank[34], rank[35]];
		let groupJ = [rank[36], rank[37], rank[38], rank[39]];
		let groupK = [rank[40], rank[41], rank[42], rank[43]];
		let groupL = [rank[44], rank[45], rank[46], rank[47]];
		let groupM = [rank[48], rank[49], rank[50], rank[51]];
		let masterAG1 = groupA.concat(groupB);
		let masterAG2 = groupB.concat(groupC);
		let masterAG3 = groupC.concat(groupD);
		let masterAG4 = groupD.concat(groupE);
		let masterAG5 = groupE.concat(groupF);
		let masterAG6 = groupF.concat(groupG);
		let masterAG7 = groupG.concat(groupH);
		let masterAG8 = groupH.concat(groupI);
		let masterAG9 = groupI.concat(groupJ);
		let masterAG10 = groupJ.concat(groupK);
		let masterAG11 = groupK.concat(groupL);
		let masterAG12 = groupL.concat(groupM);
		let masterAG13 = groupM.concat(groupA);
		let allGroups = [
			masterAG1,
			masterAG2,
			masterAG3,
			masterAG4,
			masterAG5,
			masterAG6,
			masterAG7,
			masterAG8,
			masterAG9,
			masterAG10,
			masterAG11,
			masterAG12,
			masterAG13,
		];

		let winGroup = [];
		let winGroupI = [];
		let mplayer = `m${playerNo[i]}${playerGroup}`;

		for (let g = 0; g < allGroups.length; g++) {
			let matchCount = 0;
			for (let i = 0; i < drawnNos.length; i++) {
				if (allGroups[g].includes(drawnNos[i])) {
					matchCount++;
				}
			}

			if (matchCount >= 3) {
				winGroup.push(1);
				winGroupI.push(allGroups.indexOf(allGroups[g]) + 1);
			} else {
				winGroup.push(0);
			}
		}

		if (winGroupI.length === 0) winGroupI.push(0);
		if (groupOBJ[newDraw] === undefined) groupOBJ[newDraw] = {};
		groupOBJ[newDraw][mplayer] = winGroupI;
	}
	return groupOBJ;
}

function ballFrequency(ball, draws) {
	let drawData = JSON.parse(fs.readFileSync("./models/draws.json", "utf-8"));
	let drawList = [];

	for (let i = 0; i < drawData.length; i++) {
		for (let j = 0; j < drawData[i].drawBalls.length; j++) {
			drawList.unshift(drawData[i].drawBalls[j]);
		}
		drawList.unshift(drawData[i].drawBonus);
	}

	let tCount = 0;
	for (let i = drawList.length - draws * 7; i < drawList.length; i++) {
		if (drawList[i] === parseInt(ball)) {
			tCount++;
		}
	}
	return tCount;
}

function drawSum(draw) {
	let drawCounts = JSON.parse(fs.readFileSync("./models/weights.json", "utf-8"));
	let drawBalls = Object.keys(drawCounts);
	for (let i = 0; i < drawBalls.length; i++) {
		drawCounts[i + 1] = ballFrequency(drawBalls[i], draw) + drawCounts[i + 1];
	}

	return drawCounts;
}

function ballRank(games) {
	let ballsOrig = drawSum(games);
	let ballsSort = drawSum(games);
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
