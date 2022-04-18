const express = require("express");
const { getAllGroups } = require("../controllers/groupController");

const groupRouter = express.Router();

groupRouter.get("/", getAllGroups);

module.exports = groupRouter;
