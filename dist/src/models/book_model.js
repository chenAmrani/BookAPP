"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    pages: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});
exports.BookModel = mongoose_1.default.model("Book", bookSchema);
exports.default = exports.BookModel;
// const book1: IBook = {
//   name: "book1",
//   year: 2020,
//   image:
//     "https://wizkids.co.il/cdn/shop/products/76813c8d0218cab5137b190541dce431_x700.gif?v=1514210268",
//   pages: 100,
//   price: 100,
//   rating: 5,
//   category: "category1",
//   summary: "summary1",
//   reviews: ["65a7e29e8d1b65e500e14636"] as unknown as typeof mongoose.Schema.Types.ObjectId[],
//   author:
//     "65a6b6822338056d8466021e" as unknown as mongoose.Schema.Types.ObjectId,
// };
// const book2: IBook = {
//   name: "book2",
//   year: 2020,
//   image:
//     "https://wizkids.co.il/cdn/shop/products/8b9cdfc1f6c4258a1e02cccd3ce2ca68_x700.gif?v=1514210271",
//   pages: 100,
//   price: 100,
//   rating: 5,
//   category: "category1",
//   summary: "summary1",
//   reviews: ["65a7e29e8d1b65e500e14637"] as unknown as typeof mongoose.Schema.Types.ObjectId[],
//   author:
//     "65a6b6822338056d8466021e" as unknown as mongoose.Schema.Types.ObjectId,
// };
// const book3: IBook = {
//   name: "book3",
//   year: 2020,
//   image:
//     "https://wizkids.co.il/cdn/shop/products/b3a33a4adbc50af32c796ac8debd7bc9_x700.gif?v=1514210274",
//   pages: 100,
//   price: 100,
//   rating: 5,
//   category: "category1",
//   summary: "summary1",
//   reviews: ["65a7e29e8d1b65e500e14638"] as unknown as typeof mongoose.Schema.Types.ObjectId[],
//   author:
//     "65a6b6822338056d8466021e" as unknown as mongoose.Schema.Types.ObjectId,
// };
// const books = [book1, book2, book3];
// BookModel.insertMany(books);
//# sourceMappingURL=book_model.js.map