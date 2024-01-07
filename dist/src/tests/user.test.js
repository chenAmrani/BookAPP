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
let app;
let accessTokenUser1;
let accessTokenUser2;
let accessTokenUser3;
let adminUserId;
let authorUserId;
let readerUserId;
const adminUser = {
    name: "admin1",
    email: "admin@test.com",
    password: "adminpass",
    role: "admin"
};
const authorUser = {
    name: "author1",
    email: "author@test.com",
    password: "authorpass",
    role: "author"
};
const readerUser = {
    name: "reader1",
    email: "reader@test.com",
    password: "readerpass",
    role: "reader"
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
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(authorUser);
    accessTokenUser2 = response2.body.accessToken;
    // console.log("this is accessTokenUser2: " , accessTokenUser2);
    yield user_model_1.default.deleteMany({ 'email': readerUser.email });
    const res3 = yield (0, supertest_1.default)(app).post("/auth/register").send(readerUser);
    readerUserId = res3.body._id;
    const response3 = yield (0, supertest_1.default)(app).post("/auth/login").send(readerUser);
    accessTokenUser3 = response3.body.accessToken;
}));
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
    //every user can get user by email.
    test("Test Get User by Email", () => __awaiter(void 0, void 0, void 0, function* () {
        const userEmail = readerUser.email;
        const response = yield (0, supertest_1.default)(app).get(`/user/${userEmail}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
        expect(response.body.name).toBe(readerUser.name);
        expect(response.body._id).toBe(readerUserId);
    }));
    //update
    test("Test Update - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: adminUserId,
            user: {
                name: "Chen Amrani",
                email: "author@test.com",
                password: "authorpass",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
        expect(response.statusCode).toBe(200);
        // expect(response.body.name).toBe("Chen Amrani");
    }));
    test("Test Update - not Admin , and not on the same user", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "Chen Amrani",
                email: "updateName@gmail.com",
                password: "123456789",
            }
        };
        const response = yield (0, supertest_1.default)(app)
            .put("/user/update")
            .set("Authorization", "JWT " + accessTokenUser3)
            .send(updateData);
        expect(response.statusCode).toBe(403);
    }));
    // test("Test Update user that not exist", async () => {
    //   const nonExistentUserId = "6592857c6341227f90e3fdd3";
    //   const updateData = {
    //     id: nonExistentUserId,
    //     user: {
    //       name : "Chen Amrani",
    //       email: "author@test.com",
    //       password: "authorpass"
    //     }
    //   }
    //   const response = await request(app)
    //   .put("/user/update")
    //   .set("Authorization", "JWT " + accessTokenUser1)
    //   .send(updateData);
    //   expect(response.statusCode).toBe(404);
    // });
    test("Test Update Own Profile - Success", () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            id: authorUserId,
            user: {
                name: "chen",
                email: "author@test.com",
                password: "authorpass",
            },
        };
        const response = yield (0, supertest_1.default)(app)
            .put('/user/updateOwnProfile')
            .set("Authorization", "JWT " + accessTokenUser2)
            .send(updateData);
        expect(response.statusCode).toBe(200);
        // Check that the user's profile is updated
        const updatedUserResponse = yield (0, supertest_1.default)(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(updatedUserResponse.status).toBe(200);
    }));
    //delete
    test("Test Delete user by Id - Admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/user/delete/${readerUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        expect(response.statusCode).toBe(200);
    }));
    //tests that check that return us error.
    // test("Test Delete user by Id - not Admin,and not on the same user ", async () => {
    //     const response = await request(app)
    //     .delete(`/user/${authorUserId}`)
    //     .set("Authorization", "JWT " + accessTokenUser3);
    //     expect(response.statusCode).toBe(403);
    //     const getUserResponse = await request(app)
    //     .get(`/user/${authorUserId}`).
    //      set('Authorization', 'JWT ' + accessTokenUser2);
    //     expect(getUserResponse.status).toBe(200);
    // });
    // test("Test Update Profile - Not allowd ", async () => {
    //     const updateData = {
    //       id: readerUserId,
    //       user: {
    //         name: 'Updated Name',
    //         email: "reader@test.com",
    //         password: "readerpass",
    //       },
    //     };
    //     const response = await request(app)
    //       .patch('/user/updateOwnProfile')
    //       .set('Authorization', 'JWT ' + accessTokenUser2)
    //       .send(updateData);
    //     expect(response.statusCode).toBe(403);
    //   });
});
//# sourceMappingURL=user.test.js.map