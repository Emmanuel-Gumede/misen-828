const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/misen-player", { useNewUrlParser: true, useUnifiedTopology: true });

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
	gameNumber: Number,
	groupScores: Array,
});

const playSchema = new Schema({
	gameNumber: Number,
	groupNumbers: Array,
});

const Draw = mongoose.model("Draw", drawSchema);
const Group = mongoose.model("Group", groupSchema);
const Score = mongoose.model("Score", scoreSchema);
const Play = mongoose.model("Play", playSchema);

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

exports.addNewDraw = async (draw) => {
	let newDraw = new Draw(draw);
	await newDraw.save((err, result) => {
		if (err) console.log(`New draw was not added due to ${err}`);
		if (result) console.log(`New draw number ${draw.drawNumber} has been added`);
	});
};

exports.addNewScore = async (scores) => {
	let newScores = new Score(scores);
	await newScores.save((err, result) => {
		if (err) console.log(`New scores were not added due to ${err}`);
		if (result) console.log(`New scores have been added`);
	});
};

exports.updatePlayGroups = async (plays) => {
	let playNumbers = new Play(plays);
	await playNumbers.save((err, result) => {
		if (err) console.log(`Play groups not updated due to ${err}`);
		if (result) console.log("Play numbers updated");
	});
};

exports.getPlayNumbers = async () => {
	return await Play.find({})
		.sort({ gameNumber: -1 })
		.limit(1)
		.then((group) => group[0].groupNumbers[0]);
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

exports.getScores = async () => {
	return await Score.find({}).then((scores) => {
		scores.forEach((elem) => console.log(elem.groupScores[0]));
	});
};

exports.groupNames = async () => {
	let groupList = await Group.find({}).distinct("groupName", (err, groups) => {
		if (err) console.log(err);
		return groups;
	});
	return groupList;
};
