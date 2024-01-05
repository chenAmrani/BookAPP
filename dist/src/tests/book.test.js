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
const book_model_1 = __importDefault(require("../models/book_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
let authorAccessToken;
let readerAccessToken;
const authorUser = {
    email: "author@test.com",
    password: "authorpass",
    role: "author"
};
const readerUser = {
    email: "reader@test.com",
    password: "readerpass",
    role: "reader"
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield book_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({});
    yield (0, supertest_1.default)(app).post("/auth/register").send(authorUser);
    const authorResponse = yield (0, supertest_1.default)(app).post("/auth/login").send(authorUser);
    authorAccessToken = authorResponse.body.accessToken;
    yield (0, supertest_1.default)(app).post("/auth/register").send(readerUser);
    const readerResponse = yield (0, supertest_1.default)(app).post("/auth/login").send(readerUser);
    readerAccessToken = readerResponse.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const book1 = {
    name: "book1",
    year: 2020,
    image: "image1",
    pages: 100,
    price: 100,
    rating: 5,
    author: "author1",
    category: "category1",
    summary: "summary1",
    reviews: null,
};
describe("Book tests", () => {
    const addBook = (book, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/book")
            .set("Authorization", "JWT " + accessToken)
            .send(book);
        expect(response.status).toBe(201);
    });
    test("Test Get All Books - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/book")
            .set("Authorization", "JWT " + authorAccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Author Adding Book", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addBook(book1, authorAccessToken);
    }));
    test("Test Reader Adding Book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/book")
            .set("Authorization", "JWT " + readerAccessToken)
            .send(book1);
        expect(response.statusCode).toBe(403); // Expecting Forbidden access
    }));
    // Check if the book1 is added to the database
    test("Test Get All Books in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/book")
            .set("Authorization", "JWT " + authorAccessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const rc = response.body[0];
        expect(rc.name).toBe(book1.name);
    }));
    test("Test Post Duplicate Book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/book")
            .set("Authorization", "JWT " + authorAccessToken)
            .send(book1);
        expect(response.statusCode).toBe(406);
    }));
});
//# sourceMappingURL=book.test.js.map