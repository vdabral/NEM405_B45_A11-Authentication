const express = require("express");
const BookModel = require("../models/book.model");
const ReviewModel = require("../models/review.model");

const BookRouter = express.Router();

// GET all books
BookRouter.get("/", async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single book with reviews
BookRouter.get("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await BookModel.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // populate reviews with user info (optional)
    const reviews = await ReviewModel.find({ bookId }).populate(
      "userId",
      "name email"
    );

    res.status(200).json({ book, reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = BookRouter;
