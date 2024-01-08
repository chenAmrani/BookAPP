"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    summary: {
        type: String,
        required: true
    },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});
exports.default = mongoose_1.default.model("Book", bookSchema);
//# sourceMappingURL=book_model.js.map