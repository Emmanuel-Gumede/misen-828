const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/misen-test8", {
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
	let drawData = await Draw.find({}).exec();
	let playData = await Play.find({}).exec();

	if (groupData.length !== 0) {
		return;
	} else {
		let initGroup = { groupName: "m0000a", gamePlay: 0 };
		let group = new Group(initGroup);
		await group.save();
	}

	if (drawData.length !== 0) {
		return;
	} else {
		let initDraw = {
			gameNumber: 0,
			drawNumber: 1731,
		};
		let draw = new Draw(initDraw);
		await draw.save();
	}

	if (playData.length !== 0) {
		return;
	} else {
		let initPlay = {
			groupName: "m0000a",
			groupNumbers: [
				[1, 2, 3, 4, 5, 6, 7, 8],
				[5, 6, 7, 8, 9, 10, 11, 12],
				[9, 10, 11, 12, 13, 14, 15, 16],
				[13, 14, 15, 16, 17, 18, 19, 20],
				[17, 18, 19, 20, 21, 22, 23, 24],
				[21, 22, 23, 24, 25, 26, 27, 28],
				[25, 26, 27, 28, 29, 30, 31, 32],
				[29, 30, 31, 32, 33, 34, 35, 36],
				[33, 34, 35, 36, 37, 38, 39, 40],
				[37, 38, 39, 40, 41, 42, 43, 44],
				[41, 42, 43, 44, 45, 46, 47, 48],
				[45, 46, 47, 48, 49, 50, 51, 52],
				[49, 50, 51, 52, 1, 2, 3, 4],
			],
		};
		let play = new Play(initPlay);
		await play.save();
	}
};

exports.ballWeights = () => {
	return JSON.parse(fs.readFileSync("./model/ballWeights.json", "utf-8"));
};

exports.playBalls = () => {
	return JSON.parse(fs.readFileSync("./model/playBalls.json", "utf-8"));
};

exports.lastGameNumber = async () => {
	return await Draw.find({})
		.sort({ gameNumber: -1 })
		.limit(1)
		.then((draw) => draw[0].gameNumber);
};

exports.lastDrawNumber = async () => {
	return await Draw.find({})
		.sort({ drawNumber: -1 })
		.limit(1)
		.then((draws) => draws[0].drawNumber);
};

exports.updatePlayNumbers = async (group, numbers) => {
	return await Play.findOneAndUpdate({ groupName: group }, { groupNumbers: numbers }, { new: true, upsert: true });
};

exports.addNewDraw = async (draw) => {
	let newDraw = new Draw(draw);
	await newDraw.save((err, result) => {
		if (err) console.log(`New draw was not added due to ${err}`);
		if (result) console.log(`New draw number ${draw.drawNumber} has been added`);
	});
};

exports.addNewScore = async (group, score) => {
	return await Score.findOneAndUpdate(
		{ groupName: group },
		{ $push: { groupScore: { $each: [score], $position: 0 } } },
		{ new: true, upsert: true }
	);
};

exports.updatePlayGroups = async (plays) => {
	let playNumbers = new Play(plays);
	await playNumbers.save((err, result) => {
		if (err) console.log(`Play groups not updated due to ${err}`);
		if (result) console.log("Play numbers updated");
	});
};

exports.getPlayNumbers = async () => {
	return await Play.find({});
};

exports.getPlayNumbersGroup = async (group) => {
	return await Play.find({ groupName: group });
};

exports.addNewGroup = async (group) => {
	let newGroup = new Group(group);
	await newGroup.save((err, result) => {
		if (err) console.log(`New group could not be added due to ${err}`);
		if (result) console.log(`New group ${group.groupName} was successfully added`);
	});
};

exports.drawHistory = async () => {
	return await Draw.find({}, { fullDraw: 0 }).lean();
};

exports.getScores = async (group) => {
	return await Score.find({ groupName: group }).exec();
};

exports.groupNames = async () => {
	let groupList = await Group.find({}).distinct("groupName", (err, groups) => {
		if (err) console.log(err);
		return groups;
	});
	return groupList;
};
