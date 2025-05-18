const express = require("express");
const TodoModel = require("../models/todo.model");
const adminMiddleware = require("../middleware/admin.middleware");

const TodoRouter = express.Router();

// USER ROUTES
TodoRouter.post("/", async (req, res) => {
  const { title, description } = req.body;
  const createdBy = req.user.userId;
  try {
    const todo = await TodoModel.create({ title, description, createdBy });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: "Error creating todo" });
  }
});

TodoRouter.get("/", async (req, res) => {
  try {
    const todos = await TodoModel.find({ createdBy: req.user.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching todos" });
  }
});

TodoRouter.put("/:id", async (req, res) => {
  try {
    const todo = await TodoModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.userId },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(403).json({ message: "Access denied" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

TodoRouter.delete("/:id", async (req, res) => {
  try {
    const todo = await TodoModel.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });
    if (!todo) return res.status(403).json({ message: "Access denied" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ADMIN ROUTES
TodoRouter.get("/admin/todos", adminMiddleware, async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all todos" });
  }
});

TodoRouter.delete("/admin/todos/:id", adminMiddleware, async (req, res) => {
  try {
    await TodoModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Admin deleted todo" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = TodoRouter;
