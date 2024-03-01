import Review, { IReview } from "../models/review_model";
import { BaseController } from "./base_controller";
import { Response, Request } from "express";
import { AuthRequest } from "../common/auth_middleware";
import book_model from "../models/book_model";
//import book_model from "../models/book_model";

class ReviewController extends BaseController<IReview> {
  constructor() {
    super(Review);
  }

  async getReviewsByBookId(req: Request, res: Response) {
    try {
      const { bookId } = req.params;
      const reviews = await Review.find({ bookId }).populate({
        path: "reviewerId",
        select: "name image",
      });
      res.send(reviews);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addNewReview(req: AuthRequest, res: Response) {
    const { bookId, text } = req.body;
    if (!bookId || !text) {
      res.status(406).send("Book id or comment is missing");
      return;
    }
    const review = { bookId, text, reviewerId: req.user._id };

    const createReview = await Review.create(review);

    if (createReview) {
      const book = await book_model.findById(bookId.toString());
      console.log("book", book);
      if (book) {
        if (!book.reviews) {
          book.reviews = [];
        }
        book.reviews.push(createReview.id);
        await book.save();
        res.status(201).send(createReview);
      } else {
        res.status(404).send("book not found");
        return;
      }
    } else {
      res.status(500).send("Error creating review");
      return;
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    try {
      const review = await Review.findById(req.params.id);

      if (!review) {
        res.status(404).send("Review not found");
        return;
      }

      const book = await book_model.findById(review.bookId);

      if (!book) {
        res.status(404).send("Book not found");
        return;
      }

      await book_model.updateOne(
        { _id: book._id },
        { $pull: { reviews: req.params.id } }
      );
      await Review.findByIdAndDelete(req.params.id);

      res.status(200).send("OK");
    } catch (err) {
      res.status(406).send("Fail: " + err.message);
    }
  }

  async updateById(req: AuthRequest, res: Response) {
    const { id, text } = req.body;
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { text },
      { new: true }
    );
    res.json(updatedReview);
  }
}

export default new ReviewController();
