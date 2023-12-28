"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_post_model_1 = __importDefault(require("../models/book_post_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
const bookPostController = (0, base_controller_1.default)(book_post_model_1.default);
exports.default = bookPostController;
//# sourceMappingURL=book_post_controller.js.map