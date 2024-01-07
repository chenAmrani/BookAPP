"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const book_controller_1 = __importDefault(require("../controllers/book_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const author_middleware_1 = __importDefault(require("../common/author_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const veifyOwenership_midleeware_1 = __importDefault(require("../common/veifyOwenership_midleeware"));
router.get("/", auth_middleware_1.default, book_controller_1.default.get.bind(book_controller_1.default));
router.get("/:id", auth_middleware_1.default, book_controller_1.default.getById.bind(book_controller_1.default));
router.post("/", auth_middleware_1.default, author_middleware_1.default, book_controller_1.default.post.bind(book_controller_1.default));
router.put("/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.put("/:id", auth_middleware_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.delete("/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
router.delete("/:id", auth_middleware_1.default, veifyOwenership_midleeware_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
exports.default = router;
//# sourceMappingURL=book_routes.js.map