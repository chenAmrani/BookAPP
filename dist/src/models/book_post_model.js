"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookPostSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    text: {
        type: String,
        required: true,
    },
    bookId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Book",
    },
});
exports.default = mongoose_1.default.model("BookPost", bookPostSchema);
//# sourceMappingURL=book_post_model.js.map