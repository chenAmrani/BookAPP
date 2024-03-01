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
const user_model_1 = __importDefault(require("../models/user_model"));
//
let app;
let accessTokenUser1;
let accessTokenUser2;
let accessTokenUser3;
let adminUserId;
let authorUserId;
let readerUserId;
const adminUser = {
    _id: "",
    name: "name1",
    email: "admin@test.com",
    password: "adminpass",
    image: "image1",
    role: "admin",
    isGoogleSsoUser: false
};
const authorUser = {
    _id: "",
    name: "name1",
    email: "author@test.com",
    password: "authorpass",
    image: "imageBase64",
    role: "author",
    isGoogleSsoUser: false
};
const readerUser = {
    _id: "",
    name: "name1",
    email: "reader@test.com",
    password: "readerpass",
    image: "image1",
    role: "reader",
    isGoogleSsoUser: false
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("beforeAll");
    yield user_model_1.default.deleteMany();
    yield user_model_1.default.deleteMany({ 'email': adminUser.email });
    const res = yield (0, supertest_1.default)(app).post("/auth/register").send(adminUser);
    adminUserId = res.body._id;
    const response = yield (0, supertest_1.default)(app).post("/auth/login").send(adminUser);
    accessTokenUser1 = response.body.accessToken;
    // console.log("this is accessTokenUser1: " , accessTokenUser1);
    yield user_model_1.default.deleteMany({ 'email': authorUser.email });
    const res2 = yield (0, supertest_1.default)(app).post("/auth/register").send(authorUser);
    authorUserId = res2.body._id;
    console.log("this is authorUserId!!!!!: ", authorUserId);
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(authorUser);
    accessTokenUser2 = response2.body.accessToken;
    console.log("this is accessTokenUser2: ", accessTokenUser2);
    yield user_model_1.default.deleteMany({ 'email': readerUser.email });
    const res3 = yield (0, supertest_1.default)(app).post("/auth/register").send(readerUser);
    readerUserId = res3.body._id;
    console.log("this is readerUserId: ", readerUserId);
    const response3 = yield (0, supertest_1.default)(app).post("/auth/login").send(readerUser);
    accessTokenUser3 = response3.body.accessToken;
    console.log("this is accessTokenUser3: ", accessTokenUser3);
}), 15000);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.close();
}));
describe('User Controller Tests', () => {
    //Get
    test("Test Get All Users - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get All Users - not Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(403);
    }));
    test("Test Get User by Id - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
        expect(response.body._id).toBe(authorUserId);
        expect(response.body.name).toBe(authorUser.name);
        expect(response.body.email).toBe(authorUser.email);
    }));
    test("Test Get User by Id - not Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(200);
    }));
    test("Get My Own Book", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/ownBooks/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Get My Books with Invalid User ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const invalidUserId = "60f2c5d97329573b6cfe0e79";
        const response = yield (0, supertest_1.default)(app)
            .get(`/user/ownBooks/${invalidUserId}`)
            .set("Authorization", "JWT " + accessTokenUser2);
        expect(response.statusCode).toBe(404); // Expect a not found status code
    }));
    //update
    test("Test Update - Admin - succsess", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: adminUserId,
            user: {
                name: "change name admin",
                email: "admin@test.com",
                password: "adminpass",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/updateOwnProfile")
            .set("Authorization", "JWT " + accessTokenUser1)
            .field('id', updateData.id)
            .field('name', updateData.user.name)
            .field('email', updateData.user.email)
            .field('password', updateData.user.password);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Update - User - succsess", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "change name author",
                email: "author@test.com",
                password: "authorpass",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/updateOwnProfile")
            .set("Authorization", "JWT " + accessTokenUser2)
            .field('id', updateData.id)
            .field('name', updateData.user.name)
            .field('email', updateData.user.email)
            .field('password', updateData.user.password);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Update Profile - Not allowd ", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "TryToUpdateName",
            },
        };
        const response = yield (0, supertest_1.default)(app)
            .put('/user/updateOwnProfile')
            .set("Authorization", "JWT " + accessTokenUser3)
            .send(updateData);
        expect(response.statusCode).toBe(403);
    }));
    test("Test Delete My User By Id - not succsess", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("this is readerUserId: ", readerUserId);
        const response = yield (0, supertest_1.default)(app)
            .delete(`/user/deleteMyOwnUser/${readerUserId}`)
            .set("Authorization", "JWT" + accessTokenUser2);
        expect(response.statusCode).toBe(401);
    }));
    test("Test Update user that not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "Chen Amrani",
                email: "author@test.com",
                password: "authorpass"
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/updateUser")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
        expect(response.statusCode).toBe(404);
    }));
    test("Test Update Profile with Missing Fields", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {} // Empty object to simulate missing fields
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/updateOwnProfile")
            .set("Authorization", "JWT " + accessTokenUser2)
            .set("currentUserId", authorUserId) // Set the currentUserId in req.locals
            .send(updateData);
        expect(response.statusCode).toBe(400); // Expect a bad request status code
        expect(response.text).toContain("At least one field (name, email, or password) is required for update");
    }));
    test("Test Update Profile without Authorization", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "change name author",
                email: "author@test.com",
                password: "authorpass",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/updateOwnProfile")
            .send(updateData); // Sending the update data without authorization
        expect(response.statusCode).toBe(401); // Expect an unauthorized status code
    }));
    test("Test Delete user by Id - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/user/delete/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    test("Test Delete My User By Id - succsess", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("this is readerUserId: ", readerUserId);
        const response = yield (0, supertest_1.default)(app)
            .delete(`/user/deleteMyOwnUser/${readerUserId}`)
            .set("Authorization", "JWT " + accessTokenUser3);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ message: "Usere deleted succesfully" });
    }));
    test("Test Delete User with Non-existent ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistentUserId = "60f2c5d97329573b6cfe0e79"; // Provide a non-existent user ID
        const response = yield (0, supertest_1.default)(app)
            .delete(`/user/delete/${nonExistentUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(404); // Expect a not found status code
    }));
});
//# sourceMappingURL=user.test.js.map