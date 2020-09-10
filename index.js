const express = require("express");
const app = express();

app.get("/", (req, res) => {
	return res.send("This is my new applications ... more to come");
});

app.listen(4040, () => {
	console.log("Express application server running on port 4040 (http://127.0.0.1:4040)");
});
