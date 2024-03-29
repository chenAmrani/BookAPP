"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const review_model_1 = __importDefault(require("../models/review_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let createdReview1Id;
let createdReview2Id;
let createdReview3Id;
let readerAccessToken;
let adminAccessToken;
const readerUser = {
    _id: "",
    name: "reader2",
    email: "reader2@test.com",
    password: "readerpass",
    image: "image1",
    role: "reader",
    isGoogleSsoUser: false
};
const adminUser = {
    _id: "",
    name: "admin2",
    email: "admin@test.com",
    password: "adminpass",
    image: "image1",
    role: "admin",
    isGoogleSsoUser: false
};
const review1 = {
    BookName: "Book1",
    date: null,
    text: "review 1",
    reviewerId: readerUser._id,
};
const review2 = {
    BookName: "Book1",
    date: null,
    text: "review 2",
    reviewerId: readerUser._id,
};
const review3 = {
    BookName: "updateBookName",
    date: null,
    text: "review 3",
    reviewerId: readerUser._id,
};
let bookId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield review_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': readerUser.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(readerUser); //return the user_Id
    readerUser._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(readerUser);
    readerAccessToken = response2.body.accessToken;
    const response3 = yield (0, supertest_1.default)(app).post("/auth/register").send(adminUser); //return the user_Id
    readerUser._id = response3.body._id;
    const response4 = yield (0, supertest_1.default)(app).post("/auth/login").send(adminUser);
    adminAccessToken = response4.body.accessToken;
    const book1 = yield (0, supertest_1.default)(app).get("/book").set("Authorization", "JWT " + readerAccessToken);
    bookId = book1.body[0]._id;
    review1.bookId = bookId;
    review2.bookId = bookId;
    review3.bookId = bookId;
}), 10000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
// const review = { bookId, text, reviewerId: req.user._id };
describe("Reviews tests", () => {
    //     const addReviewOnBook = async (review: IReview) => {
    //         const response = await request(app)
    //             .post("/review")
    //             .set("Authorization", "JWT " + accessToken)
    //             .field('reviewerId', readerUser._id)
    //             .field('text', review.text)
    //             .field('BookName', review.BookName)
    //             .field('bookId', review.bookId.toString())
    //             .field('reviewerId', review.reviewerId.toString())
    //             .field('date', 'null');
    //         expect(response.statusCode).toBe(201);
    //         expect(response.body.BookName).toBe(review.BookName);
    //         expect(response.body.text).toBe(review.text);
    //         createdReview1Id = response.body._id;
    // };
    test("Test Get All reviews in empty data base - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Review1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + readerAccessToken)
            .send(review1);
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review1.text);
        createdReview1Id = response.body._id;
    }));
    test("Test Post Review2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + readerAccessToken)
            .send(review2);
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review2.text);
        createdReview2Id = response.body._id;
    }));
    test("Test Post Review3", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + readerAccessToken)
            .send(review2);
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review2.text);
        createdReview3Id = response.body._id;
    }));
    test('Add review on a non-existing book', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingBookId = '60f2c5d97329573b6cfe0e77'; // Non-existing book ID
        const reviewData = {
            bookId: nonExistingBookId,
            text: 'This is a review for a non-existing book',
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/review')
            .set('Authorization', 'JWT ' + readerAccessToken)
            .send(reviewData);
        expect(response.status).toBe(404);
    }));
    test("Test Get All reviews with three reviews in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        const reviews = response.body;
        expect(reviews.toBeDefined);
        expect(reviews.length).toBeGreaterThan(0);
        console.log("reviews that returned from the test: ", reviews);
    }));
    test('Get reviews by book ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/review/${review1.bookId}`);
        expect(response.status).toBe(200);
        console.log("response.body in the test is this !!!!!: ", response.body);
    }));
    // test('Get reviews by non-existing book ID', async () => {
    //   const nonExistingBookId = '60f2c5d97329573b6cfe0e78'; // Non-existing book ID
    //   const response = await request(app).get(/review/${nonExistingBookId});
    //   expect(response.status).toBe(404);
    // });
    test("Delete review", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${createdReview1Id}`)
            .set("Authorization", "JWT " + readerAccessToken);
        expect(response.statusCode).toBe(200);
    }));
    test("Admin delete a review by its ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/admin/${createdReview2Id}`)
            .set("Authorization", "JWT " + adminAccessToken);
        expect(response.statusCode).toBe(200);
    }));
    test('Update review with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const newText = 'Updated review text';
        const response = yield (0, supertest_1.default)(app)
            .put('/review')
            .set("Authorization", "JWT " + readerAccessToken)
            .send({ id: createdReview3Id, text: newText });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            _id: createdReview3Id,
            text: newText,
        }));
    }));
    test('Update review with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingUserId = '60f2c5d97329573b6cfe0e78'; // Non-existing review ID
        const response = yield (0, supertest_1.default)(app)
            .put('/review')
            .set("Authorization", "JWT " + nonExistingUserId)
            .send({ id: createdReview3Id, text: '' });
        expect(response.status).toBe(401);
    }));
    test("Test Delete Review with Non-existing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingReviewId = "60f2c5d97329573b6cfe0e78"; // Non-existing review ID
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${nonExistingReviewId}`)
            .set("Authorization", "JWT " + readerAccessToken);
        expect(response.status).toBe(404);
    }));
    test("Test Delete Review with Non-existing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingReviewId = "60f2c5d97329573b6cfe0e78"; // Non-existing review ID
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${nonExistingReviewId}`)
            .set("Authorization", "JWT " + readerAccessToken);
        expect(response.status).toBe(404);
    }));
    test("Test Delete Review with Missing ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete("/review/")
            .set("Authorization", "JWT " + readerAccessToken);
        expect(response.status).toBe(404);
    }));
});
//# sourceMappingURL=review.test.js.map