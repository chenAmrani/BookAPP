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
const readerUser = {
    _id: "",
    name: "reader2",
    email: "reader2@test.com",
    password: "readerpass",
    image: "image1",
    role: "reader",
    isGoogleSsoUser: false
};
const review1 = {
    BookName: "updateBookName",
    date: null,
    text: "review 1",
    reviewerId: readerUser._id,
};
const review2 = {
    BookName: "updateBookName",
    date: null,
    text: "review 2",
    reviewerId: readerUser._id,
};
let accessToken;
let bookId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield review_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': readerUser.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(readerUser); //return the user_Id
    readerUser._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(readerUser);
    accessToken = response2.body.accessToken;
    const book1 = yield (0, supertest_1.default)(app).get("/book").set("Authorization", "JWT " + accessToken);
    bookId = book1.body[0]._id;
    review1.bookId = bookId;
    review2.bookId = bookId;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
// const review = { bookId, text, reviewerId: req.user._id };
describe("Reviews tests", () => {
    const addReviewOnBook = (review) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .field('reviewerId', readerUser._id)
            .field('text', review.text)
            .field('BookName', review.BookName)
            .field('bookId', review.bookId.toString())
            .field('reviewerId', review.reviewerId.toString())
            .field('date', 'null');
        expect(response.statusCode).toBe(201);
        expect(response.body.BookName).toBe(review.BookName);
        expect(response.body.text).toBe(review.text);
        createdReview1Id = response.body._id;
    });
    //   test("Test Get All Student posts - empty response", async () => {
    //     const response = await request(app).get("/review");
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toStrictEqual([]);
    //   });
    test("Test Post Review1", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review1);
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review1.text);
        createdReview1Id = response.body._id;
    }));
    test("Test Post Review2", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review2);
        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review2.text);
    }));
    test("Test Get All reviews with two reviews in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        const reviews = response.body;
        expect(reviews.toBeDefined);
        expect(reviews.length).toBeGreaterThan(0);
        console.log("reviews that returned from the test: ", reviews);
    }));
    test("User delete his own review by its ID ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${createdReview1Id}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=review.test.js.map