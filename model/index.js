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
	fullDraw: Array,
});

const groupSchema = new Schema({
	groupName: String,
	gamePlay: Number,
	lastUpdate: Number,
	lastTrained: String,
	trainingError: Number,
});

const gameSchema = new Schema({
	gamePlay: Number, //number of games being tracked, e.g. 1 = previous 1 game
	ballRanks: Array, //[rank: ball]
});

const Draw = mongoose.model("Draw", drawSchema);
const Group = mongoose.model("Group", groupSchema);
const Game = mongoose.model("Game", gameSchema);

exports.getBallWeights = () => {
	return JSON.parse(fs.readFileSync("./model/ballWeights.json", "utf-8"));
};

exports.getPlayBalls = () => {
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

exports.groupNames = async () => {
	let groupList = await Group.find({}).distinct("groupName", (err, groups) => {
		if (err) console.log(err);
		return groups;
	});
	return groupList;
};
