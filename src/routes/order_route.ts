import express from "express";
const router = express.Router();
import orderController from "../controllers/review_controller";
import authMiddleware from "../common/auth_middleware";


router.get("/", orderController.get.bind(orderController));

router.get("/:id", orderController.getById.bind(orderController));

router.post("/",authMiddleware, orderController.post.bind(orderController));

router.put("/:id",authMiddleware, orderController.putById.bind(orderController));

router.delete("/:id",authMiddleware, orderController.deleteById.bind(orderController));

export default router;

