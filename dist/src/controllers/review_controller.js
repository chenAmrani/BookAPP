"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const review_model_1 = __importDefault(require("../models/review_model"));
const base_controller_1 = require("./base_controller");
const book_model_1 = __importDefault(require("../models/book_model"));
//import book_model from "../models/book_model";
class ReviewController extends base_controller_1.BaseController {
    constructor() {
        super(review_model_1.default);
    }
    getReviewsByBookId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookId } = req.params;
                const reviews = yield review_model_1.default.find({ bookId }).populate({
                    path: "reviewerId",
                    select: "name image",
                });
                res.send(reviews);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    addNewReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bookId, text } = req.body;
            if (!bookId || !text) {
                res.status(406).send("Book id or comment is missing");
                return;
            }
            const review = { bookId, text, reviewerId: req.user._id };
            const createReview = yield review_model_1.default.create(review);
            if (createReview) {
                const book = yield book_model_1.default.findById(bookId.toString());
                console.log("book", book);
                if (book) {
                    if (!book.reviews) {
                        book.reviews = [];
                    }
                    book.reviews.push(createReview.id);
                    yield book.save();
                    res.status(201).send(createReview);
                }
                else {
                    res.status(404).send("book not found");
                    return;
                }
            }
            else {
                res.status(500).send("Error creating review");
                return;
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review = yield review_model_1.default.findById(req.params.id);
                if (!review) {
                    res.status(404).send("Review not found");
                    return;
                }
                const book = yield book_model_1.default.findById(review.bookId);
                if (!book) {
                    res.status(404).send("Book not found");
                    return;
                }
                yield book_model_1.default.updateOne({ _id: book._id }, { $pull: { reviews: req.params.id } });
                yield review_model_1.default.findByIdAndDelete(req.params.id);
                res.status(200).send("OK");
            }
            catch (err) {
                res.status(406).send("Fail: " + err.message);
            }
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, text } = req.body;
            const updatedReview = yield review_model_1.default.findByIdAndUpdate(id, { text }, { new: true });
            res.json(updatedReview);
        });
    }
}
exports.default = new ReviewController();
//# sourceMappingURL=review_controller.js.map