import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";
import authMiddleware from "../common/auth_middleware";
import authorMiddleware from "../common/author_middleware";
import adminMiddleware from "../common/admin_middleware";
import verifyBookOwner from "../common/verifyBookOwner";



router.get("/", authMiddleware, bookController.get.bind(bookController));
router.get("/:id",authMiddleware, bookController.getById.bind(bookController));


// Allow admin to edit and delete any book
router.put("/admin/update/:id", authMiddleware,adminMiddleware, bookController.putById.bind(bookController));
router.delete("/admin/delete/:id",authMiddleware,adminMiddleware, bookController.deleteById.bind(bookController));
router.post("/admin",authMiddleware,adminMiddleware, bookController.post.bind(bookController));

//Allow auther to add,delete and edit his book
router.put("/updateOwnBook/:id", authMiddleware,verifyBookOwner, bookController.putById.bind(bookController));
router.delete("/:id",authMiddleware,verifyBookOwner, bookController.deleteById.bind(bookController));
router.post("/",authMiddleware,authorMiddleware, bookController.post.bind(bookController));


export default router;