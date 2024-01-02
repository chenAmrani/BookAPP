import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";




let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");


});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Auth tests", () => {
    
    test("Test Register", async () => {
        const response = await request(app).post("/auth/register").send({
            username:"test@test.com",
            password:"123456789"
        });
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual({message:"OK"});
    });
    test("Test Login", async () => {
        const response = await request(app).post("/auth/register").send({
            username:"test@test.com",
            password:"123456789"
        });
        expect(response.status).toBe(200);
     });

    });
