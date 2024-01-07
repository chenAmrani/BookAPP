import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";
import authMiddleware from "../common/auth_middleware";
import authorMiddleware from "../common/author_middleware";
import adminMiddleware from "../common/admin_middleware";
import verifyOwnership from "../common/veifyOwenership_midleeware";


router.get("/", authMiddleware, bookController.get.bind(bookController));
router.get("/:id",authMiddleware, bookController.getById.bind(bookController));


router.post("/",authMiddleware,authorMiddleware, bookController.post.bind(bookController));


router.put("/:id", authMiddleware,adminMiddleware, bookController.putById.bind(bookController));
router.put("/:id", authMiddleware,bookController.putById.bind(bookController));


router.delete("/:id",authMiddleware,adminMiddleware, bookController.deleteById.bind(bookController));
router.delete("/:id",authMiddleware,verifyOwnership, bookController.deleteById.bind(bookController));

export default router; 
