"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_post_model_1 = __importDefault(require("../models/book_post_model"));
const base_controller_1 = require("./base_controller");
class BookPostController extends base_controller_1.BaseConstroller {
    constructor() {
        super(book_post_model_1.default);
    }
}
exports.default = new BookPostController();
//# sourceMappingURL=book_post_controller.js.map