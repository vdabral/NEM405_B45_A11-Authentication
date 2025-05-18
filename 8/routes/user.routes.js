const express = require("express");
const UserRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const authMiddleware = require("../middleware/auth.middleware");
const saltRounds = 10;

UserRouter.post("/signup", async (req, res) => {
  try {
    const myPlaintextPassword = req.body.password;
    bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal server error" });
      } else {
        await UserModel.create({ ...req.body, password: hash });
        res.status(201).json({ message: "User created successfully" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const myPlaintextPassword = req.body.password;
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      const hash = user.password;
      bcrypt.compare(myPlaintextPassword, hash, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Internal server error" });
        } else {
          if (result) {
            const token = jwt.sign({ userId: user._id }, "privateKey");
            res.status(200).json({ message: "Login successful", token });
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = UserRouter;
