import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";
import authMiddleware from "../common/auth_middleware";

router.get("/", authMiddleware, bookController.get.bind(bookController));

router.get("/:id", authMiddleware, bookController.getById.bind(bookController));

router.post("/", authMiddleware, bookController.post.bind(bookController));

router.put("/:id", bookController.putById.bind(bookController));

router.delete("/:id", authMiddleware, bookController.deleteById.bind(bookController));

export default router;
