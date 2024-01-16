"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = __importDefault(require("../controllers/review_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing book reviews.
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
 *     Review:
 *       type: object
 *       required:
 *         - BookName
 *         - text
 *         - owner
 *         - bookId
 *       properties:
 *         BookName:
 *           type: string
 *           description: The name of the book being reviewed
 *         date:
 *           type: string
 *           format: date
 *           description: The date the review was created (automatically generated)
 *         text:
 *           type: string
 *           description: The text content of the review
 *         owner:
 *           type: string
 *           description: The user ID who created the review
 *         bookId:
 *           type: string
 *           format: uuid
 *           description: The ID of the book being reviewed
 *       example:
 *         BookName: 'Example Book'
 *         text: 'This is a great book!'
 *         owner: '60f2c5d97329573b6cfe0e76'  # Replace with actual user ID
 *         bookId: '60f2c5d97329573b6cfe0e77'  # Replace with actual book ID
 */
/**
 * @swagger
 * /review:
 *   get:
 *     summary: Get a list of all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: A list of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: The created review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request, missing or invalid data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
/**
 * @swagger
 * /review/{id}:
 *   get:
 *     summary: Get details of a specific review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: Details of the review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Review not found
 *
 *   put:
 *     summary: Update details of a specific review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Updated details of the review
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Bad request, missing or invalid data
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Review not found
 *
 *   delete:
 *     summary: Delete a specific review
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review
 *     responses:
 *       200:
 *         description: OK
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Review not found
 *       406:
 *         description: Fail, error message
 */
router.get("/", review_controller_1.default.get.bind(review_controller_1.default));
router.get("/:id", review_controller_1.default.getById.bind(review_controller_1.default));
router.post("/", auth_middleware_1.default, review_controller_1.default.post.bind(review_controller_1.default));
router.put("/:id", auth_middleware_1.default, review_controller_1.default.putById.bind(review_controller_1.default));
router.delete("/:id", auth_middleware_1.default, review_controller_1.default.deleteById.bind(review_controller_1.default));
exports.default = router;
//# sourceMappingURL=review_routes.js.map