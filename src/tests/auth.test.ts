import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model"; 



let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany();

});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth tests", () => {
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send({
            email:"test@test.com",
            password:"123456789"
        });
        expect(response.status).toBe(201);
    });

    test("Test Login", async () => {
        const response = await request(app).post("/auth/register").send({
            email:"test@test.com",
            password:"123456789"
        });
        expect(response.status).toBe(200);
     });

     test("Test Register exist email", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send(User);
      expect(response.statusCode).toBe(406);
    });
  
    test("Test Register missing password", async () => {
      const response = await request(app)
        .post("/auth/register").send({
          email: "test@test.com",
        });
      expect(response.statusCode).toBe(400);
    });

    });
