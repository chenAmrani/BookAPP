import express from "express";
const router = express.Router();
import reviewController from "../controllers/review_controller";


router.get("/", reviewController.get.bind(reviewController));

router.get("/:id", reviewController.getById.bind(reviewController));

router.post("/", reviewController.post.bind(reviewController));

router.put("/:id", reviewController.putById.bind(reviewController));

router.delete("/:id", reviewController.deleteById.bind(reviewController));

export default router;