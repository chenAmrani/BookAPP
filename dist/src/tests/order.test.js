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
const order_model_1 = __importDefault(require("../models/order_model"));
const user_model_1 = __importDefault(require("../models/user_model"));
let app;
const user = {
    email: "testReview@test.com",
    password: "1234567890",
};
let accessToken;
let userId;
let bookId1;
let bookId2;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield order_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': user.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(user); //return the user_Id
    userId = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(user);
    accessToken = response2.body.accessToken;
    const book1 = yield (0, supertest_1.default)(app).get("/book").set("Authorization", "JWT " + accessToken);
    console.log("DB books: ", book1.body);
    bookId1 = book1.body[0]._id;
    bookId2 = book1.body[1]._id;
    console.log("tihs is id: ", bookId1);
    console.log("tihs is id: ", bookId2);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
const order1 = {
    user: userId,
    books: [bookId1, bookId2],
    orderNumber: 1,
    orderDate: null,
};
console.log("User: ", order1.user);
console.log("Books: ", order1.books);
describe("Order tests", () => {
    const addNewOrder = (order) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/order")
            .set("Authorization", "JWT " + accessToken)
            .send(order);
        expect(response.statusCode).toBe(201);
        console.log("this is response: ", response.body);
        expect(response.body.user).toBe(order1.user);
        expect(response.body.orderNumber).toBe(order.orderNumber);
    });
    test("Test Get All orders - empty response", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/order");
        console.log("this is response.body: ", response.body);
        console.log("responseCode:", response.statusCode);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe([]);
    }));
    test("Test add new orderr to DB", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewOrder(order1);
    }));
    //after add order1 to DB we check if we have 1 order in the DB.
    test("Test Get All order in the DB", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/order");
        expect(response.statusCode).toBe(200);
        const rc = yield response.body[0];
        console.log("this is rc: ", rc);
        expect(rc.user).toBe(order1.user);
        expect(rc.number).toBe(order1.orderNumber);
    }));
});
//# sourceMappingURL=order.test.js.map