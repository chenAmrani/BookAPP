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
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield book_model_1.default.deleteMany();
    //   User.deleteMany({ 'email': user.email });
    //   await request(app).post("/auth/register").send(user);
    //   const response = await request(app).post("/auth/login").send(user);
    //   accessToken = response.body.accessToken;
    // });
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
    const addBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/book").send(book);
        expect(response.body.name).toBe("OK");
        expect(response.status).toBe(201);
    });
    test("Test get all books", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/book");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test Post Book", () => __awaiter(void 0, void 0, void 0, function* () {
        addBook(book1);
    }));
    test("Test Get All Books with one post in DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/book");
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        const rc = response.body[0];
        expect(rc.name).toBe(book1.name);
        expect(rc.year).toBe(book1.year);
        expect(rc.image).toBe(book1.image);
        expect(rc.pages).toBe(book1.pages);
        expect(rc.price).toBe(book1.price);
        expect(rc.rating).toBe(book1.rating);
        expect(rc.author).toBe(book1.author);
        expect(rc.category).toBe(book1.category);
        expect(rc.summary).toBe(book1.summary);
        expect(rc.reviews).toBe(book1.reviews);
    }));
    test("Test Post duplicate Book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/book").send(book1);
        expect(response.status).toBe(406);
    }));
});
//# sourceMappingURL=book.test.js.map