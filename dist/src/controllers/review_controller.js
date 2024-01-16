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
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = req.user._id;
            req.body.owner = _id;
            console.log("req.body: ", req.body);
            const createReview = yield review_model_1.default.create(req.body);
            const bookId = createReview.bookId;
            console.log("createReview: ", createReview);
            console.log("the book id is: ", bookId.toString());
            if (createReview) {
                const book = yield book_model_1.default.findById(bookId.toString());
                console.log("book: ", book);
                if (book) {
                    console.log("The id of the created reviwe  " + createReview.id);
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
    catch(error) {
        console.log(error);
        //res.status(500).json({ message: error.message });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req.params.id: ", req.params.id);
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
}
exports.default = new ReviewController();
//# sourceMappingURL=review_controller.js.map