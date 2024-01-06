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
let adminAccessToken;
const adminUser = {
    email: "admin@test.com",
    password: "adminpass",
    role: "admin"
};
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
let createdBookId;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield book_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({});
    yield (0, supertest_1.default)(app).post("/auth/register").send(adminUser);
    const adminResponse = yield (0, supertest_1.default)(app).post("/auth/login").send(adminUser);
    adminAccessToken = adminResponse.body.accessToken;
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
const book2 = {
    name: "book2",
    year: 2020,
    image: "image2",
    pages: 100,
    price: 100,
    rating: 5,
    author: "admin1",
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
        createdBookId = response.body._id;
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
    test("Test Admin Adding Book", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addBook(book2, adminAccessToken);
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
        expect(response.body.length).toBe(2);
        const rc = response.body[0];
        expect(rc.name).toBe(book1.name);
    }));
    // test("Test Author Getting His Books", async () => {
    //   const response = await request(app)
    //     .get("/book")
    //     .set("Authorization", "JWT " + authorAccessToken);
    //   expect(response.statusCode).toBe(200);
    //   expect(response.body.length).toBe(1);
    // });
    test("Test Post Duplicate Book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/book")
            .set("Authorization", "JWT " + authorAccessToken)
            .send(book1);
        expect(response.statusCode).toBe(406);
    }));
    test("Test Admin Deleting Book", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(createdBookId).toBeDefined(); // Ensure book ID is available
        const deleteResponse = yield (0, supertest_1.default)(app)
            .delete(`/book/${createdBookId}`)
            .set("Authorization", "JWT " + adminAccessToken);
        expect(deleteResponse.statusCode).toBe(200);
    }));
});
//# sourceMappingURL=book.test.js.map