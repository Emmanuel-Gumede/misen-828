const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	return res.render("login", {
		title: "Misen Player | Login",
		style: "./styles/login.css",
		template: "login-template",
	});
});

app.get("/home", (req, res) => {
	let groupNames = ["m000a", "m001a", "m002a", "m003a", "m004a", "m005a"];
	let drawData = [
		{
			drawSeq: 1,
			drawDate: "2020-04-21",
			drawNo: 8871,
			drawBalls: [2, 17, 24, 31, 42, 45],
			drawBonus: 13,
		},
	];
	return res.render("home", {
		title: "Misen Player | Home",
		style: "./styles/group.css",
		template: "home-template",
		drawData,
		groups: groupNames,
	});
});

app.post("/draw", (req, res) => {
	let drawNumbers = req.body.drawNumbers.split(",").map(Number);
	let bonusNumber = drawNumbers.pop();
	let newDraw = { drawDate: req.body.drawDate, drawNumbers: drawNumbers, bonusNumber: bonusNumber };
	console.log(newDraw);

	return res.redirect("/home");
});

app.get("/home/:group", (req, res) => {
	let groupName = req.params.group;
	return res.render("group", {
		title: "Misen Player | Group",
		style: "../styles/group.css",
		template: "home-template",
		group: groupName,
	});
});

app.listen(4040, () => {
	console.log("Express application server running on port 4040 (http://127.0.0.1:4040)");
});
