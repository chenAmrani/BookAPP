import express from "express";
const router = express.Router();
import bookPostController from "../controllers/book_post_controller";

router.get("/", bookPostController.get.bind(bookPostController));

router.get("/:id", bookPostController.getById.bind(bookPostController));

router.post("/", bookPostController.post.bind(bookPostController));

router.put("/:id", bookPostController.putById.bind(bookPostController));

router.delete("/:id", bookPostController.deleteById.bind(bookPostController));

export default router;