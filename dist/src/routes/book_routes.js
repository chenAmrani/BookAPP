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
const verifyBookOwner_1 = __importDefault(require("../common/verifyBookOwner"));
router.get("/", auth_middleware_1.default, book_controller_1.default.get.bind(book_controller_1.default));
router.get("/:id", auth_middleware_1.default, book_controller_1.default.getById.bind(book_controller_1.default));
// Allow admin to edit and delete any book
router.put("/admin/update/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.delete("/admin/delete/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
router.post("/admin", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.post.bind(book_controller_1.default));
//Allow auther to add,delete and edit his book
router.put("/updateOwnBook/:id", auth_middleware_1.default, verifyBookOwner_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.delete("/:id", auth_middleware_1.default, verifyBookOwner_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
router.post("/", auth_middleware_1.default, author_middleware_1.default, book_controller_1.default.post.bind(book_controller_1.default));
exports.default = router;
//# sourceMappingURL=book_routes.js.map