import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";
import authMiddleware from "../common/auth_middleware";
import authorOrAdminMiddleware from "../common/authorOrAdminMiddleware";

router.get("/", authMiddleware, bookController.get.bind(bookController));

router.get("/:id",authMiddleware, bookController.getById.bind(bookController));

router.post("/",authMiddleware,authorOrAdminMiddleware, bookController.post.bind(bookController));

router.put("/:id", authMiddleware, bookController.putById.bind(bookController));

router.delete("/:id",authMiddleware, bookController.deleteById.bind(bookController));

export default router; 
