const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/misen28-test04", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const Schema = mongoose.Schema;

const drawSchema = new Schema({
	gameNumber: Number,
	drawNumber: Number,
	drawDate: String,
	drawNumbers: Array,
	bonusNumber: Number,
});

const groupSchema = new Schema({
	groupName: String,
	gamePlay: Number,
	lastUpdate: Number,
	lastTrained: String,
	trainingError: Number,
});

const scoreSchema = new Schema({
	groupName: String,
	groupScore: Array,
	groupWins: Number,
});

const playSchema = new Schema({
	groupName: String,
	groupNumbers: Array,
});

const Draw = mongoose.model("Draw", drawSchema);
const Group = mongoose.model("Group", groupSchema);
const Score = mongoose.model("Score", scoreSchema);
const Play = mongoose.model("Play", playSchema);

exports.initData = async () => {
	let groupData = await Group.find({}).exec();

	if (groupData.length !== 0) {
		return;
	} else {
		let initGroup = { groupName: "m0000a", gamePlay: 0 };
		let group = new Group(initGroup);
		await group.save();
		let rank = [];

		for (let i = 1; i < 53; i++) {
			rank.push(i);
		}

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

		await this.updatePlayNumbers(initGroup.groupName, playGroup);
	}
};

exports.ballWeights = () => {
	return JSON.parse(fs.readFileSync("./model/ballWeights.json", "utf-8"));
};

exports.playBalls = () => {
	return JSON.parse(fs.readFileSync("./model/playBalls.json", "utf-8"));
};

exports.editDataBase = async (oldData, newData) => {
	return await Score.findOneAndUpdate({ groupName: oldData }, { $set: { groupName: newData } }, { new: true });
};

exports.lastGameNumber = async () => {
	return await Draw.find({})
		.sort({ gameNumber: -1 })
		.limit(1)
		.then((draw) => {
			if (draw[0] === undefined) {
				return -1;
			} else {
				return draw[0].gameNumber;
			}
		});
};

exports.getWinStatus = async (groupname) => {
	return await Score.find({ groupName: groupname }).then((win) => {
		if (win[0] === undefined) {
			return 0;
		} else {
			return win[0].groupWins;
		}
	});
};

exports.lastDrawNumber = async () => {
	return await Draw.find({})
		.sort({ drawNumber: -1 })
		.limit(1)
		.then((draw) => {
			if (draw[0] === undefined) {
				return 1730;
			} else {
				return draw[0].drawNumber;
			}
		});
};

exports.updatePlayNumbers = async (group, numbers) => {
	return await Play.findOneAndUpdate({ groupName: group }, { groupNumbers: numbers }, { new: true, upsert: true });
};

exports.addNewDraw = async (draw) => {
	let newDraw = new Draw(draw);
	await newDraw.save();
};

exports.addNewScore = async (group, score, win) => {
	await Score.findOneAndUpdate(
		{ groupName: group },
		{ $push: { groupScore: { $each: [score], $position: 0 } }, $set: { groupWins: win } },
		{ new: true, upsert: true }
	);
};

exports.updatePlayGroups = async (plays) => {
	let playNumbers = new Play(plays);
	await playNumbers.save();
};

exports.deleteGame = async (game) => {
	return await Draw.findOneAndDelete({ gameNumber: game });
};

exports.getPlayNumbers = async () => {
	return await Play.find({});
};

exports.getPlayNumbersGroup = async (group) => {
	return await Play.find({ groupName: group }).then((nums) => {
		if (nums[0] === undefined) {
			return 0;
		} else {
			return nums[0].groupNumbers;
		}
	});
};

exports.addNewGroup = async (group) => {
	let newGroup = new Group(group);
	await newGroup.save();
};

exports.drawHistory = async () => {
	return await Draw.find({}, { fullDraw: 0 }).lean();
};

exports.drawHistory2 = async () => {
	return await Draw.find({}, { fullDraw: 0 }).sort({ gameNumber: -1 }).limit(20).lean();
};

exports.getScores = async (group) => {
	return await Score.find({ groupName: group }).then((data) => {
		return data[0].groupScore;
	});
};

exports.getAllScores = async () => {
	return await Score.find({}).sort({ groupName: 1 });
};

exports.groupNames = async () => {
	let groupList = await Group.find({}).distinct("groupName", (err, groups) => {
		if (err) console.log(err);
		return groups;
	});
	return groupList;
};
