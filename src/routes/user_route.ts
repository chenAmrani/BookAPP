import express from "express";
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import verifyOwenershipMiddleware from '../common/veifyOwenership_midleeware';
import adminMiddleware from '../common/admin_middleware';

const router = express.Router();
//Admin
router.get("/",authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get("/id:",authMiddleware,adminMiddleware,UserController.getUserById);
router.put("/update",authMiddleware,adminMiddleware,UserController.updateUser);
router.delete("/delete/:id",authMiddleware,adminMiddleware,UserController.deleteUser);

//author
router.get("/books",authMiddleware,UserController.getMyBooks);
router.delete("/:id",authMiddleware,verifyOwenershipMiddleware,UserController.deleteUser);


//updating the user profile by himself.
router.put("/updateOwnProfile", authMiddleware,verifyOwenershipMiddleware,UserController.updateOwnProfile);



//get user by email
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;