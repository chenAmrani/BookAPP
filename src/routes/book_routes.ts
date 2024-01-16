import express from "express";
const router = express.Router();
import bookController from "../controllers/book_controller";
import authMiddleware from "../common/auth_middleware";
import authorMiddleware from "../common/author_middleware";
import adminMiddleware from "../common/admin_middleware";
import verifyBookOwner from "../common/verifyBookOwner";

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
 *

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
 *     summary: Get a list of all books
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
router.get("/", bookController.get.bind(bookController));

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
router.get("/:id", bookController.getById.bind(bookController));

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
 *       security:
 *         - bearerAuth: []
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

router.put(
  "/admin/update/:id",
  authMiddleware,
  adminMiddleware,
  bookController.putById.bind(bookController)
);

/**
 * @swagger
 * /book/admin/delete/{id}:
 *   delete:
 *     summary: Delete a specific book (Admin)
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
 *       - name: id
 *         in: path
 *         description: The ID of the book to be deleted.
 *         required: true
 *         type: string
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

router.delete(
  "/admin/delete/:id",
  authMiddleware,
  adminMiddleware,
  bookController.deleteById.bind(bookController)
);

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
 *       security:
 *         - bearerAuth: []
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
router.put(
  "/updateOwnBook/:id",
  authMiddleware,
  verifyBookOwner,
  bookController.putById.bind(bookController)
);

/**
 * @swagger
 * /book/{id}:
 *   delete:
 *     summary: Delete a specific book (Author)
 *     tags: [Book]
 *       requestBody:
 *           required: false
 *           content:
 *               application/json:
 *                   schema:
 *                       $ref: '#/components/schemas/Book'
 *       security:
 *           - bearerAuth: []
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

router.delete(
  "/:id",
  authMiddleware,
  verifyBookOwner,
  bookController.deleteById.bind(bookController)
);

/**
 * @swagger
 * /book/:
 *   post:
 *     summary: Create a new book (Author)
 *     tags: [Book]
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
router.post(
  "/",
  authMiddleware,
  authorMiddleware,
  bookController.post.bind(bookController)
);

router.post(
  "/admin",
  authMiddleware,
  adminMiddleware,
  bookController.post.bind(bookController)
);

export default router;
