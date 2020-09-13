const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
	return res.render("login", {
		title: "Misen Player | Login",
		style: "./styles/login.css",
		template: "login-template",
	});
});

app.get("/home", (req, res) => {
	let groups = ["m000a", "m001a", "m002a", "m003a", "m004a", "m005a"];
	return res.render("home", {
		title: "Misen Player | Home",
		style: "./styles/group.css",
		template: "home-template",
		groups,
	});
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
