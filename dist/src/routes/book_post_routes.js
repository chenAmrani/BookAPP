"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const book_post_controller_1 = __importDefault(require("../controllers/book_post_controller"));
router.get("/review", book_post_controller_1.default.get.bind(book_post_controller_1.default));
router.get("/:GetPostById", book_post_controller_1.default.getById.bind(book_post_controller_1.default));
router.post("/addPost", book_post_controller_1.default.post.bind(book_post_controller_1.default));
router.put("/:changePostById", book_post_controller_1.default.putById.bind(book_post_controller_1.default));
router.delete("/:deleteById", book_post_controller_1.default.deleteById.bind(book_post_controller_1.default));
exports.default = router;
//# sourceMappingURL=book_post_routes.js.map