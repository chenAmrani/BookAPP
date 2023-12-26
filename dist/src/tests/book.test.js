var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
beforeAll((done) => {
    done();
});
afterAll(() => __awaiter(this, void 0, void 0, function* () {
    yield mongoose.connection.close();
}));
describe("Book tests", () => {
    test("Test Get All Books", () => __awaiter(this, void 0, void 0, function* () {
        const response = yield request(app).get("/book");
        expect(response.status).toEqual(200);
    }));
});
//# sourceMappingURL=book.test.js.map