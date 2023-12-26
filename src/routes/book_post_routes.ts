import express from "express";
const router = express.Router();
import Book from "../controllers/book_post_controller";

router.get("/", Book.getAllBooks);

router.get("/:id", Book.getBookById);

router.post("/", Book.postBook);

router.put("/:id", Book.putBookById);

router.delete("/:id", Book.deleteBookById);

export default router;
