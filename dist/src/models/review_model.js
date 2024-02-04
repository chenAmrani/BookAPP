"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    text: {
        type: String,
        required: true,
    },
    reviewerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    bookId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Book",
    },
}, { timestamps: true });
exports.ReviewModel = mongoose_1.default.model("Review", reviewSchema);
exports.default = exports.ReviewModel;
// const review1: IReview = {
//   BookName: "Book1",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ec" as unknown as typeof mongoose.Schema.Types.ObjectId,
// };
// const review2: IReview = {
//   BookName: "Book2",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ed" as unknown as typeof mongoose.Schema.Types.ObjectId
// };
// const review3: IReview = {
//   BookName: "Book3",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ee" as unknown as typeof mongoose.Schema.Types.ObjectId
// };
// const reviews = [review1, review2, review3];
// ReviewModel.insertMany(reviews);
//# sourceMappingURL=review_model.js.map