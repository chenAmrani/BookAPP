import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Book from "../models/book_model";
import { Express } from "express";
import User from "../models/user_model";


let app: Express;
let accessToken: string;

const user = {
  email: "testBook@test.com",
  password: "1234567890",
}

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Book.deleteMany();

  User.deleteMany({ 'email': user.email });
  await request(app).post("/auth/register").send(user);
  const response = await request(app).post("/auth/login").send(user);
  accessToken = response.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.close();
});

interface IBook {
    name: string;
    year: number;
    image: string;
    pages: number;
    price: number;
    rating: number;
    author: string;
    category: string;
    summary: string;
    reviews: typeof mongoose.Schema.Types.ObjectId;
}

const book1: IBook = {
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
    const addBook = async (book: IBook) => {
        const response = await request(app).post("/book")
        .set("Authorization", "JWT " + accessToken)
        .send(book);
        expect(response.status).toBe(201);
    
    };
    
    test("Test Get All Books - empty response", async () => {
      const response = await request(app).get("/book").set("Authorization", "JWT " + accessToken);
      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual([]);
    });

    test("Test Post Book", async () => {
        await addBook(book1);
    });

    //to check if the book1 is added to the database
    test("Test Get All Books in DB", async () => {
        const response = await request(app).get("/book").set("Authorization", "JWT " + accessToken);     
        console.log("the response is: " , response);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        const rc = response.body[0];
        expect(rc.name).toBe(book1.name);
    });
    

    test("Test Post duplicate book", async () => {
      const response = await request(app).post("/book").set("Authorization", "JWT " + accessToken).send(book1);
      expect(response.statusCode).toBe(406);
    });

});