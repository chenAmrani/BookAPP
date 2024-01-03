"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = __importDefault(require("../controllers/review_controller"));
router.get("/", review_controller_1.default.get.bind(review_controller_1.default));
router.get("/:id", review_controller_1.default.getById.bind(review_controller_1.default));
router.post("/", review_controller_1.default.post.bind(review_controller_1.default));
router.put("/:id", review_controller_1.default.putById.bind(review_controller_1.default));
router.delete("/:id", review_controller_1.default.deleteById.bind(review_controller_1.default));
exports.default = router;
//# sourceMappingURL=review_routes.js.map