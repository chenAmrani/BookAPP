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
const book_post_model_1 = __importDefault(require("../models/book_post_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const user = {
    email: "testBook@test.com",
    password: "1234567890",
};
let accessToken;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield book_post_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    //   await request(app).post("/auth/register").send(user);
    //   const response = await request(app).post("/auth/login").send(user);
    //   accessToken = response.body.accessToken;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const review1 = {
    name: "Ori",
    date: null,
    text: "Good book",
    // bookId: null,
};
describe("Reviews tests", () => {
    const addReviewOnBook = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/bookpost").set("Authorization", "JWT " + accessToken).send(post);
        expect(response.statusCode).toBe(201);
    });
    test("Get token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user);
        user._id = response.body._id;
        const response2 = yield (0, supertest_1.default)(app)
            .post("/auth/login")
            .send(user);
        accessToken = response2.body.accessToken;
        expect(accessToken).toBeDefined();
    }));
    test("Test get all reviews on books", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/bookpost").set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test add Review on book", () => __awaiter(void 0, void 0, void 0, function* () {
        yield addReviewOnBook(review1);
    }));
    // test("Test Get All post in DB", async () => {
    //     const response = await request(app).get("/bookpost").set("Authorization", "JWT " + accessToken); 
    //     expect(response.status).toBe(200);
    //     expect(response.body.length).toBe(1);
    //     const rc = response.body[0];
    //     expect(rc.title).toBe(post1.name);
    //     expect(rc.text).toBe(post1.text);
    //     expect(rc.date).toBe(post1.date);
    //     expect(rc.owner).toBe(user._id);
    // });
    // test("Test Post duplicate Book", async () => {
    //     const response = await request(app).post("/book").send(post11);
    //     expect(response.status).toBe(406);
    // });
});
//# sourceMappingURL=book_post.test.js.map