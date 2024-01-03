import express from "express";
const router = express.Router();
import reviewController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";


router.get("/", reviewController.get.bind(reviewController));

router.get("/:id", reviewController.getById.bind(reviewController));

router.post("/",authMiddleware, reviewController.post.bind(reviewController));

router.put("/:id",authMiddleware, reviewController.putById.bind(reviewController));

router.delete("/:id",authMiddleware, reviewController.deleteById.bind(reviewController));

export default router;