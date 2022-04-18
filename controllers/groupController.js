const Group = require("../model/Group");

const getAllGroups = async (req, res, next) => {
  const allGroups = await Group.find({}).exec();

  res.json(allGroups);
};

module.exports = { getAllGroups };
