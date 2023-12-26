import express from "express";
const router = express.Router();
import bookPostController from "../../controllers/book_post_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", bookPostController.get.bind(bookPostController));

router.get("/:id", bookPostController.getById.bind(bookPostController));

router.post("/", authMiddleware, bookPostController.post.bind(bookPostController));

router.put("/:id", authMiddleware, bookPostController.putById.bind(bookPostController));

router.delete("/:id", authMiddleware, bookPostController.deleteById.bind(bookPostController));

export default router;
