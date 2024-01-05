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
const user = {
    email: "testReview@test.com",
    password: "1234567890",
    role: "reader",
};
let accessToken;
let bookId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield review_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user); //return the user_Id
    user._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
    const book1 = yield (0, supertest_1.default)(app).get("/book").set("Authorization", "JWT " + accessToken);
    console.log("DB books: ", book1.body);
    bookId = book1.body[0]._id;
    console.log("tihs is id: ", bookId);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const review1 = {
    BookName: "Book1",
    date: null,
    text: "Good book",
    owner: user._id,
    bookId: bookId,
};
console.log("this is review1: ", review1);
describe("Reviews tests", () => {
    const addReviewOnBook = (review) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(user._id);
        expect(response.body.bookId).toBe(review.bookId);
        expect(response.body.BookName).toBe(review.BookName);
        expect(response.body.text).toBe(review.text);
    });
    test("Test Get All Student posts - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Review", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addReviewOnBook(review1);
    }));
    test("Test Get All reviews with one review in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/review");
        expect(response.statusCode).toBe(200);
        const rc = yield response.body[0];
        console.log("this is rc: ", rc);
        expect(rc.BookName).toBe(review1.BookName);
        expect(rc.bookId).toBe(review1.bookId);
        expect(rc.text).toBe(review1.text);
        expect(rc.owner).toBe(user._id);
    }));
    //האם צריך לבדוק האם חוזרת תגובה לפני ID
});
//# sourceMappingURL=review.test.js.map