import express from "express";
const router = express.Router();
import book_post_Controller from "../controllers/book_controller";

router.get("/", book_post_Controller.get.bind(book_post_Controller));

router.get("/:id", book_post_Controller.getById.bind(book_post_Controller));

router.post("/", book_post_Controller.post.bind(book_post_Controller));

router.put("/:id", book_post_Controller.putById.bind(book_post_Controller));

router.delete("/:id", book_post_Controller.deleteById.bind(book_post_Controller));

export default router; 