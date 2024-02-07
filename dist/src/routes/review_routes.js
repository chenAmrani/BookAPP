"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const review_controller_1 = __importDefault(require("../controllers/review_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
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
 *      bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
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
 *         - Date
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
 *         Date:
 *           type: Date,
 *           description: The date of the posted review
 *       example:
 *         BookName: 'Example Book'
 *         text: 'This is a great book!'
 *         owner: '60f2c5d97329573b6cfe0e76'  # Replace with actual user ID
 *         bookId: '60f2c5d97329573b6cfe0e77'  # Replace with actual book ID
 *         Date: 'null'
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
 */
router.get("/", review_controller_1.default.get.bind(review_controller_1.default));
/**
 * @swagger
 * /review:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - text
 *               - reviewerId
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the book being reviewed
 *               text:
 *                 type: string
 *                 description: The text content of the review
 *               reviewerId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the reviewer
 *             example:
 *               bookId: '60f2c5d97329573b6cfe0e77'  # Replace with actual book ID
 *               text: 'This is a great book!'
 *               reviewerId: '65bf721966d70f77cac83273'  # Replace with actual reviewer ID
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
router.post("/", auth_middleware_1.default, review_controller_1.default.addNewReview);
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
 */
router.get("/:id", review_controller_1.default.getById.bind(review_controller_1.default));
/**
 * @swagger
 * /review:
 *   put:
 *     summary: Update details of a specific review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - text
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID of the review to be updated
 *               text:
 *                 type: string
 *                 description: New text content for the review
 *             example:
 *               id: '60f2c5d97329573b6cfe0e77'  # Replace with actual review ID
 *               text: 'This is an updated review!'
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
 */
router.put("/", auth_middleware_1.default, review_controller_1.default.updateById);
/**
 * @swagger
 * /review/{id}:
 *   delete:
 *     summary: Delete a specific review by ID
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the review to be deleted
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
router.delete("/:id", auth_middleware_1.default, review_controller_1.default.deleteById.bind(review_controller_1.default));
router.get("/book/:bookId", review_controller_1.default.getReviewsByBookId);
router.delete("/admin/:id", auth_middleware_1.default, admin_middleware_1.default, review_controller_1.default.deleteById.bind(review_controller_1.default));
exports.default = router;
//# sourceMappingURL=review_routes.js.map