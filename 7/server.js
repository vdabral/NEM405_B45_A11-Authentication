require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const UserRouter = require("./routes/user.routes");
const authMiddleware = require("./middleware/auth.middleware");
const NotesRouter = require("./routes/notes.routes");

const app = express();
app.use(express.json());
app.use("/user", UserRouter);
app.use("/notes", authMiddleware, NotesRouter);
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${process.env.PORT}`);
});
