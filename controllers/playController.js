const Play = require("../model/Play");

const getAllPlays = async (req, res, next) => {
  const allPlays = await Play.find({}).exec();
  console.log(allPlays);
  res.json(allPlays);
};

module.exports = { getAllPlays };
