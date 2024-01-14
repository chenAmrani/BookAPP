import express from "express";
import UserController from '../controllers/user_controller';
import authMiddleware from '../common/auth_middleware';
import verifyUserOwenerMiddleware from '../common/veifyUserOwenr_midleeware';
import adminMiddleware from '../common/admin_middleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users.
 */

/** 
 * @swagger
 * components:
 *   securitySchemes:
 *       bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         image:
 *           type: string
 *           description: URL of the user's profile image
 *         role:
 *           type: string
 *           description: The role of the user (admin, author, reader)
 *         books:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of books related to the user
 *       example:
 *         name: 'John Doe'
 *         email: 'john@example.com'
 *         password: 'password123'
 *         image: 'https://example.com/john.jpg'
 *         role: 'author'
 *         books: ['60f2c5d97329573b6cfe0e76']  # Replace with actual book IDs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users (Admin)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 * 
 * /users/id:
 *   get:
 *     summary: Get details of a specific user (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: Details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/update:
 *   put:
 *     summary: Update details of a specific user (Admin)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 * 
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a specific user (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 * 
 * /users/books:
 *   get:
 *     summary: Get a list of books related to the user (Author)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of book IDs related to the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 * 
 * /users/deleteByAuthor/{id}:
 *   delete:
 *     summary: Delete a specific user (Author)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have permission
 *       404:
 *         description: User not found
 * 
 * /users/updateOwnProfile:
 *   put:
 *     summary: Update details of the logged-in user's profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated details of the user's profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 * 
 * /users/{email}:
 *   get:
 *     summary: Get details of a specific user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email of the user
 *     responses:
 *       200:
 *         description: Details of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: User not found
 */

//Admin
router.get("/",authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get("/id:",authMiddleware,adminMiddleware,UserController.getUserById);
router.put("/update",authMiddleware,adminMiddleware,UserController.updateUser);
router.delete("/delete/:id",authMiddleware,adminMiddleware,UserController.deleteUser);

//author
router.get("/books",authMiddleware,UserController.getMyBooks);
router.delete("/deleteByAuthor/:id",authMiddleware,verifyUserOwenerMiddleware,UserController.deleteUser);


//updating the user profile by himself.
router.put("/updateOwnProfile", authMiddleware,verifyUserOwenerMiddleware,UserController.updateOwnProfile);



//get user by email
router.get('/:email',authMiddleware,UserController.getUserByEmail);

export default router;