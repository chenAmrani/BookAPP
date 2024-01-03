"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    books: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Book",
        },
    ],
    orderNumber: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now(),
    },
});
exports.default = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=order_model.js.map