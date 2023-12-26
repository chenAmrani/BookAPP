
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";

beforeAll((done) => {
    done();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Book tests", () => {
    test("Test Get All Books", async () => {
    const response = await request(app).get("/book");
    expect(response.status).toEqual(200);
});
});

