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



 * components:
 *   securitySchemes:
 *       bearerAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT

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
 *         books: ['65a24e94e289d55bee3e1130']  

* /user/:
*   get:
*       summary: get all users registered to the site (admin only)
*       tags: [User]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       security:
*           - bearerAuth: []
*       responses:
*           200:
*               description: Get all users registered to the site
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           401:
*               description: Unauthorized
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*



 * /user/:id:
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
 * /user/update:
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
 * */

/**  
 * @swagger
 * /user/delete/{id}:
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
  */


/**
 * @swagger
 * /user/books:
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
 * */
 
 /**
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
 * */

 /** 
 * @swagger
 * /user/updateOwnProfile:
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
 * */


 /**
 * @swagger
 * /user/{email}:
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














export default router;


router.get("/",authMiddleware,adminMiddleware,UserController.getAllUsers);
router.get('/:email',authMiddleware,UserController.getUserByEmail);
router.put("/updateOwnProfile", authMiddleware,verifyUserOwenerMiddleware,UserController.updateOwnProfile);
router.delete("/deleteByAuthor/:id",authMiddleware,verifyUserOwenerMiddleware,UserController.deleteUser);
router.get("/books",authMiddleware,UserController.getMyBooks);
router.delete("/delete/:id",authMiddleware,adminMiddleware,UserController.deleteUser);
router.get("/id:",authMiddleware,adminMiddleware,UserController.getUserById);
router.put("/update",authMiddleware,adminMiddleware,UserController.updateUser);
