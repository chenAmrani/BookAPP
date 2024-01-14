import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The Authentication API is performed using JWT, tokens, access token, and refresh token.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
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
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           description: The user password
 *         role:
 *           type: string
 *           description: The user's role
 *       example:
 *         name: 'bob'
 *         email: 'bob@gmail.com'
 *         password: '123456'
 *         role: 'author'
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: registers a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The new user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, missing required fields
 *       406:
 *         description: Email already exists
 */
router.post("/register", authController.register);
/**
* @swagger
* components:
*   schemas:
*       Tokens:
*           type: object
*           required:
*             - accessToken
*             - refreshToken
*           properties:
*             accessToken:
*               type: string
*               description: The JWT access token
*             refreshToken:
*               type: string
*               description: The JWT refresh token
*           example:
*             accessToken: '123cd123x1xx1'
*             refreshToken: '134r2134cr1x3c'
*/


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: logs in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       400:
 *         description: Bad request, missing email or password
 *       401:
 *         description: Incorrect email or password
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: logout a user
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: logout completed successfully
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get("/logout", authController.logout);
/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: get a new access token using the refresh token
 *     tags: [Auth]
 *     description: need to provide the refresh token in the auth header
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The access & refresh tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tokens'
 *       401:
 *         description: Unauthorized, invalid or missing token
 */
router.get("/refresh", authController.refresh);





export default router;
