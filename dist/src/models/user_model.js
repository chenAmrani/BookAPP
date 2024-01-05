"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshTokens: {
        type: [String],
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'author', 'reader'], // Enumerate the roles
        default: 'reader', // Default role for new users
    },
    books: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Book"
        }]
});
exports.default = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user_model.js.map