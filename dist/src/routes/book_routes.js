"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const book_controller_1 = __importDefault(require("../controllers/book_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const author_middleware_1 = __importDefault(require("../common/author_middleware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const verifyBookOwner_1 = __importDefault(require("../common/verifyBookOwner"));
const multer_1 = require("../common/multer");
/**
 * @swagger
 * tags:
 *   name: Book
 *   description: API for managing books.
 */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * security:
 *   - bearerAuth: []
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *         - year
 *         - image
 *         - pages
 *         - price
 *         - rating
 *         - author
 *         - category
 *         - summary
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the book
 *         year:
 *           type: number
 *           description: The publication year
 *         image:
 *           type: string
 *           description: URL of the book cover image
 *         pages:
 *           type: number
 *           description: Number of pages in the book
 *         price:
 *           type: number
 *           description: The price of the book
 *         rating:
 *           type: number
 *           description: The rating of the book
 *         author:
 *           type: string
 *           description: ID of the book's author (User)
 *         category:
 *           type: string
 *           description: The category of the book
 *         summary:
 *           type: string
 *           description: Brief summary of the book
 *         reviews:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of reviews related to the book
 *       example:
 *         name: 'updateBookName'
 *         year: 2020
 *         image: 'image1'
 *         pages: 100
 *         price: 100
 *         rating: 5
 *         author: '65a639239dd9ed21c708bbe3'
 *         category: 'category1'
 *         summary: 'summary1'
 *         reviews: []
 */
/**
 * @swagger
 * /book/:
 *   get:
 *     summary: Get a list of all the books
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 */
router.get("/", book_controller_1.default.getBooks);
/**
 * @swagger
 * /book/{id}:
 *   get:
 *     summary: Get details of a specific book
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: Details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       404:
 *         description: Book not found
 */
router.get("/:id", book_controller_1.default.getById.bind(book_controller_1.default));
/**
 * @swagger
 * /book/admin/update/{id}:
 *   put:
 *     summary: Update details of a specific book (Admin)
 *     tags:
 *       - Book
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Updated details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing, or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       404:
 *         description: Book not found
 */
router.put("/admin/update/:id", auth_middleware_1.default, admin_middleware_1.default, 
// check if form data includes field named "image", if yes, use multer to upload the image
multer_1.upload.single("image"), book_controller_1.default.putById);
/**
 * @swagger
 * /book/admin/delete/{id}:
 *   delete:
 *     summary: Delete a specific book (Admin)
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the book to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       404:
 *         description: Book not found
 */
router.delete("/admin/delete/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
/**
 * @swagger
 * /book/updateOwnBook/{id}:
 *   put:
 *     summary: Update details of a specific book (Author)
 *     tags:
 *       - Book
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the book
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Updated details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing, or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       404:
 *         description: Book not found
 */
router.put("/updateOwnBook/:id", auth_middleware_1.default, verifyBookOwner_1.default, multer_1.upload.single("image"), book_controller_1.default.putById.bind(book_controller_1.default));
/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a specific book (Author)
 *     tags:
 *       - Book
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the book to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not own the book
 *       404:
 *         description: Book not found
 */
router.delete("/:id", auth_middleware_1.default, verifyBookOwner_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
/**
 * @swagger
 * /book/:
 *   post:
 *     summary: Create a new book (Author)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               pages:
 *                 type: number
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               summary:
 *                 type: string
 *             required:
 *               - name
 *               - year
 *               - image
 *               - pages
 *               - price
 *               - rating
 *               - author
 *               - category
 *               - summary
 *     responses:
 *       201:
 *         description: New book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have author privileges
 *       406:
 *         description: Book already exists
 */
router.post("/", auth_middleware_1.default, author_middleware_1.default, multer_1.upload.single("image"), book_controller_1.default.post);
/**
 * @swagger
 * /book/admin:
 *   post:
 *     summary: Create a new book (Admin)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               year:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *               pages:
 *                 type: number
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               author:
 *                 type: string
 *               category:
 *                 type: string
 *               summary:
 *                 type: string
 *             required:
 *               - name
 *               - year
 *               - image
 *               - pages
 *               - price
 *               - rating
 *               - author
 *               - category
 *               - summary
 *     responses:
 *       201:
 *         description: New book created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       406:
 *         description: Book already exists
 */
router.post("/admin", auth_middleware_1.default, admin_middleware_1.default, multer_1.upload.single("image"), book_controller_1.default.post);
exports.default = router;
//# sourceMappingURL=book_routes.js.map