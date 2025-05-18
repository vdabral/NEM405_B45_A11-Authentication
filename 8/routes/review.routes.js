const express = require("express");
const ReviewModel = require("../models/review.model");
const authMiddleware = require("../middleware/auth.middleware");

const ReviewRouter = express.Router();

// Middleware to protect all review routes
ReviewRouter.use(authMiddleware);

// POST add review for a book
ReviewRouter.post("/books/:id/reviews", async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user.userId;
    const { rating, comment } = req.body;

    // Optional: check if user already reviewed this book, if you want to restrict
    // const existingReview = await ReviewModel.findOne({ bookId, userId });
    // if(existingReview) return res.status(400).json({ message: "You have already reviewed this book." });

    const review = await ReviewModel.create({
      bookId,
      userId,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT edit own review
ReviewRouter.put("/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only edit your own reviews" });
    }

    // Update review
    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;
    await review.save();

    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE own review
ReviewRouter.delete("/reviews/:id", async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    const review = await ReviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only delete your own reviews" });
    }

    await ReviewModel.findByIdAndDelete(reviewId);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = ReviewRouter;
