import express from "express";
const router = express.Router();
import bookPostController from "../controllers/book_post_controller";

router.get("/review", bookPostController.get.bind(bookPostController));

router.get("/:GetPostById", bookPostController.getById.bind(bookPostController));

router.post("/addPost", bookPostController.post.bind(bookPostController));

router.put("/:changePostById", bookPostController.putById.bind(bookPostController));

router.delete("/:deleteById", bookPostController.deleteById.bind(bookPostController));

export default router;