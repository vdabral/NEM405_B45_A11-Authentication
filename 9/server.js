require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const UserRouter = require("./routes/user.routes");
const authMiddleware = require("./middleware/auth.middleware");
const TodoRouter = require("./routes/todo.routes");

const app = express();
app.use(express.json());
app.use("/user", UserRouter);
app.use("/todoos", authMiddleware, TodoRouter);
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
