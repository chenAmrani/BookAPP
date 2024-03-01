"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        required: true,
        enum: ["admin", "author", "reader"], // Enumerate the roles
        default: "reader", // Default role for new users
    },
    books: [
        {
            type: mongoose_1.default.Schema.Types.Mixed,
            default: [],
        },
    ],
    isGoogleSsoUser: {
        type: Boolean,
        default: false,
    },
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
exports.default = exports.UserModel;
// const user1: IUser = {
//   name: "chen",
//   email: "chen@gmail.com",
//   password: "1234",
//   image: "https://example.com/chen.jpg",
//   role: "author",
//   books: [('65be6059f98ce2d590f646c0') as unknown as typeof mongoose.Schema.Types.ObjectId, ('65be6059f98ce2d590f646c1') as unknown as typeof mongoose.Schema.Types.ObjectId,("65be6059f98ce2d590f646c2") as unknown as typeof mongoose.Schema.Types.ObjectId]
// }
// const user = [user1];
// UserModel.insertMany(user);
//# sourceMappingURL=user_model.js.map