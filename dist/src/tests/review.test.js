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
let createdReview1;
const readerUser = {
    _id: "",
    name: "name1",
    email: "author@test.com",
    password: "authorpass",
    image: "imageBase64",
    role: "reader",
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
            .field('date', review.date.toString());
        expect(response.statusCode).toBe(201);
        expect(response.body.BookName).toBe(review.BookName);
        expect(response.body.text).toBe(review.text);
        createdReview1 = response.body._id;
    });
    //   test("Test Get All Student posts - empty response", async () => {
    //     const response = await request(app).get("/review");
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toStrictEqual([]);
    //   });
    test("Test Post Review1", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addReviewOnBook(review1);
    }));
    test("Test Post Review2", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addReviewOnBook(review2);
    }));
    test("Test Get All reviews with one review in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        const rc = yield response.body[0];
        console.log("this is rc: ", rc);
        expect(rc.BookName).toBe(review1.BookName);
        expect(rc.bookId).toBe(review1.bookId);
        expect(rc.text).toBe(review1.text);
        expect(rc.owner).toBe(readerUser._id);
    }));
    test("Delete review", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/review/${createdReview1}`)
            .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=review.test.js.map