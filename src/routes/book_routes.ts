import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";

router.get("/", bookController.get.bind(bookController));

router.get("/:id", bookController.getById.bind(bookController));

router.post("/", bookController.post.bind(bookController));

router.put("/:id", bookController.putById.bind(bookController));

router.delete("/:id", bookController.deleteById.bind(bookController));

export default router; 
