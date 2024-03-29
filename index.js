const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const gameRouter = require("./routes/gameRouter");
const groupRouter = require("./routes/groupRouter");
const playRouter = require("./routes/playRouter");

const app = express();

const connectDB = async () => {
  mongoose.connect("mongodb://127.0.0.1:27017/misen-live1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("MongoDB connected...");
};

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/games", gameRouter);
app.use("/groups", groupRouter);
app.use("/plays", playRouter);

app.listen(4040, () => {
  console.log("Express application server running on port 4040 (http://127.0.0.1:4040)");
});
