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
//import book_model from "../models/book_model";
class ReviewController extends base_controller_1.BaseController {
    constructor() {
        super(review_model_1.default);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log("review:" + req.body);
            const _id = req.user._id;
            req.body.owner = _id;
            // const bookID = req.body.bookId;  // Assuming bookID is the review ObjectId
            // const book = await book_model.findById({ '_id': bookID});
            // await book.reviews.push(bookID);
            // await book.save();
            _super.post.call(this, req, res);
        });
    }
}
exports.default = new ReviewController();
//# sourceMappingURL=review_controller.js.map