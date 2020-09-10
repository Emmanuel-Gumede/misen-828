const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

app.use(express.static("public"));
app.engine("hbs", exphbs({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.get("/", (req, res) => {
	return res.render("login");
});

app.listen(4040, () => {
	console.log("Express application server running on port 4040 (http://127.0.0.1:4040)");
});
