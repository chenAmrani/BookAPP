import express from "express";
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import verifyOwenershipMiddleware from '../common/veifyOwenership_midleeware';
<<<<<<< HEAD

=======
import adminMiddleware from '../common/admin_middleware';
>>>>>>> 3d23a1aae057c5212f8f42ede82819eae9d5c187

const router = express.Router();
//Admin
router.get("/",authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get("/id:",authMiddleware,adminMiddleware,UserController.getUserById);
router.put("/update",authMiddleware,adminMiddleware,UserController.updateUser);
router.delete("/delete/:id",authMiddleware,adminMiddleware,UserController.deleteUser);

//author
<<<<<<< HEAD
router.get("/books",authMiddleware,authMiddleware,UserController.getMyBooks);
=======
router.get("/books",authMiddleware,UserController.getMyBooks);
router.delete("/:id",authMiddleware,verifyOwenershipMiddleware,UserController.deleteUser);
>>>>>>> 3d23a1aae057c5212f8f42ede82819eae9d5c187


//updating the user profile by himself.
<<<<<<< HEAD
router.put('/updateOwnProfile', authMiddleware,verifyOwenershipMiddleware,UserController.updateOwnProfile);
=======
router.put("/updateOwnProfile", authMiddleware,verifyOwenershipMiddleware,UserController.updateOwnProfile);



>>>>>>> 3d23a1aae057c5212f8f42ede82819eae9d5c187
//get user by email
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;