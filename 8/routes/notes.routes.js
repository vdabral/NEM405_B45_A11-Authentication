const express = require("express");
const NoteModel = require("../models/notes.model");
const NotesRouter = express.Router();

NotesRouter.get("/", async (req, res) => {
  try {
    const notes = await NoteModel.find({ createdBy: req.user.userId });
    res.status(200).json(notes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
NotesRouter.post("/", async (req, res) => {
  try {
    const note = await NoteModel.create({
      ...req.body,
      createdBy: req.user.userId,
    });
    res.status(201).json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
NotesRouter.put("/:id", async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    } else {
      res.status(200).json(note);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
NotesRouter.delete("/:id", async (req, res) => {
  try {
    const note = await NoteModel.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    } else {
      res.status(200).json({ message: "Note deleted successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = NotesRouter;
