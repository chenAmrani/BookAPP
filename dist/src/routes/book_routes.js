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
/**
 * @swagger
 * tags:
 *   name: Books
 *   description: API for managing books.
 *
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
 *         - owner
 *         - category
 *         - summary
 *         - reviews
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
 *         owner:
 *           type: string
 *           description: ID of the book's owner (User)
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
 *         name: 'The Great Gatsby'
 *         year: 1925
 *         image: 'https://example.com/gatsby.jpg'
 *         pages: 180
 *         price: 10.99
 *         rating: 4.5
 *         owner: '65a2592c4adf3035466a0a2f'  # Replace with actual owner ID
 *         category: 'Classic'
 *         summary: 'A novel by F. Scott Fitzgerald.'
 *         reviews: ['65a2592da3e5af450752b518']  # Replace with actual review IDs
 */
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of all books
 *     tags: [Books]
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
 *
 * /books/{id}:
 *   get:
 *     summary: Get details of a specific book
 *     tags: [Books]
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
/**
 * @swagger
 * /books/admin/update/{id}:
 *   put:
 *     summary: Update details of a specific book (Admin)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Updated details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       404:
 *         description: Book not found
 *
 * /books/admin/delete/{id}:
 *   delete:
 *     summary: Delete a specific book (Admin)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not have admin privileges
 *       404:
 *         description: Book not found
 *
 * /books/admin:
 *   post:
 *     summary: Create a new book (Admin)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
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
 *
 * /books/updateOwnBook/{id}:
 *   put:
 *     summary: Update details of a specific book (Author)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Updated details of the book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not own the book
 *       404:
 *         description: Book not found
 *
 * /books/{id}:
 *   delete:
 *     summary: Delete a specific book (Author)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the book
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized, missing or invalid token
 *       403:
 *         description: Forbidden, user does not own the book
 *       404:
 *         description: Book not found
 *
 * /books:
 *   post:
 *     summary: Create a new book (Author)
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
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
router.get("/", auth_middleware_1.default, book_controller_1.default.get.bind(book_controller_1.default));
router.get("/:id", auth_middleware_1.default, book_controller_1.default.getById.bind(book_controller_1.default));
// Allow admin to edit and delete any book
router.put("/admin/update/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.delete("/admin/delete/:id", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
router.post("/admin", auth_middleware_1.default, admin_middleware_1.default, book_controller_1.default.post.bind(book_controller_1.default));
//Allow auther to add,delete and edit his book
router.put("/updateOwnBook/:id", auth_middleware_1.default, verifyBookOwner_1.default, book_controller_1.default.putById.bind(book_controller_1.default));
router.delete("/:id", auth_middleware_1.default, verifyBookOwner_1.default, book_controller_1.default.deleteById.bind(book_controller_1.default));
router.post("/", auth_middleware_1.default, author_middleware_1.default, book_controller_1.default.post.bind(book_controller_1.default));
exports.default = router;
//# sourceMappingURL=book_routes.js.map