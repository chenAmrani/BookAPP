import express from "express";
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import verifyOwenershipMiddleware from '../common/veifyOwenership_midleeware';


const router = express.Router();
//Admin
router.get("/",authMiddleware,UserController.getAllUsers);
router.get("/id:",authMiddleware,UserController.getUserById);
router.put("/update",authMiddleware,UserController.updateUser);
router.delete("/:id",authMiddleware,UserController.deleteUser);

//author
router.get("/books",authMiddleware,authMiddleware,UserController.getMyBooks);

//everyone

//updating the user profile by himself.
router.put('/updateOwnProfile', authMiddleware,verifyOwenershipMiddleware,UserController.updateOwnProfile);
//get user by email
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;