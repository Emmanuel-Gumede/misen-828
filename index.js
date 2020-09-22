const express = require("express");
const exphbs = require("express-handlebars");
const router = require("./routes/index");
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

app.use("/", router);
app.listen(4040, () => {
	console.log("Express application server running on port 4040 (http://127.0.0.1:4040)");
});
