"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const veifyUserOwenr_midleeware_1 = __importDefault(require("../common/veifyUserOwenr_midleeware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const multer_1 = require("../common/multer");
const router = express_1.default.Router();
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
 *     properties:
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
 *     example:
 *         name: 'John Doe'
 *         email: 'john@example.com'
 *         password: 'password123'
 *         image: 'https://example.com/john.jpg'
 *         role: 'author'
 *         books: ['65a24e94e289d55bee3e1130']
 */
/**
 * @swagger
 * /user/:
 *   get:
 *    summary: get all users registered to the site (admin only)
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Get all users registered to the site
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *
 */
/**
 * @swagger
 * /user/{id}:
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
 *     security:
 *      - bearerAuth: []
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
 *     security:
 *      - bearerAuth: []
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
 */
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
 *     security:
 *      - bearerAuth: []
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
 *     security:
 *      - bearerAuth: []
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
 */
/**
 * @swagger
 * /users/deleteMyOwnUser/{id}:
 *   delete:
 *     summary: Delete a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have permission
 *       404:
 *         description: User not found
 */
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
 *     security:
 *      - bearerAuth: []
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
 */
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
exports.default = router;
router.get("/", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getAllUsers);
router.get("/:email", auth_middleware_1.default, user_controller_1.default.getUserByEmail);
router.put("/updateOwnProfile", multer_1.upload.single("image"), auth_middleware_1.default, veifyUserOwenr_midleeware_1.default, user_controller_1.default.updateOwnProfile);
router.delete("/deleteMyOwnUser/:id", auth_middleware_1.default, veifyUserOwenr_midleeware_1.default, user_controller_1.default.deleteUser);
router.get("/books", auth_middleware_1.default, user_controller_1.default.getMyBooks);
router.delete("/delete/:id", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.deleteUser);
router.get("/id:", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getUserById);
router.put("/update", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.updateUser);
//# sourceMappingURL=user_route.js.map