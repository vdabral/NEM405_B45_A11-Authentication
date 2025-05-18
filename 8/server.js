require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const UserRouter = require("./routes/user.routes");

const BookRouter = require("./routes/book.routes");
const ReviewRouter = require("./routes/review.routes");

const app = express();
app.use(express.json());
app.use("/user", UserRouter);
app.use("/books", BookRouter);
app.use("/", ReviewRouter);
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
