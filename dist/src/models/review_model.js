"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
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
    // bookId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Book",
    // },
});
exports.default = mongoose_1.default.model("Review", reviewSchema);
//# sourceMappingURL=review_model.js.map