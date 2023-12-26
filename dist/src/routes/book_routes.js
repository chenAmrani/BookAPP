"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get("/", auth_middleware_1.default, bookController.get.bind(bookController));
router.get("/:id", auth_middleware_1.default, bookController.getById.bind(bookController));
router.post("/", auth_middleware_1.default, bookController.post.bind(bookController));
router.put("/:id", bookController.putById.bind(bookController));
router.delete("/:id", auth_middleware_1.default, bookController.deleteById.bind(bookController));
exports.default = router;
//# sourceMappingURL=book_routes.js.map