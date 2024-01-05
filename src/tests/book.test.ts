import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Book from "../models/book_model";
import { Express } from "express";
import User from "../models/user_model";

let app: Express;
let authorAccessToken: string;
let readerAccessToken: string;

const authorUser = {
  email: "author@test.com",
  password: "authorpass",
  role: "author"
};

const readerUser = {
  email: "reader@test.com",
  password: "readerpass",
  role: "reader"
};

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Book.deleteMany();
  
  await User.deleteMany({});
  
  await request(app).post("/auth/register").send(authorUser);
  const authorResponse = await request(app).post("/auth/login").send(authorUser);
  authorAccessToken = authorResponse.body.accessToken;

  await request(app).post("/auth/register").send(readerUser);
  const readerResponse = await request(app).post("/auth/login").send(readerUser);
  readerAccessToken = readerResponse.body.accessToken;
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
  const addBook = async (book: IBook, accessToken: string) => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", "JWT " + accessToken)
      .send(book);
    expect(response.status).toBe(201);
  };

  test("Test Get All Books - empty response", async () => {
    const response = await request(app)
      .get("/book")
      .set("Authorization", "JWT " + authorAccessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test Author Adding Book", async () => {
    await addBook(book1, authorAccessToken);
  });

  test("Test Reader Adding Book", async () => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", "JWT " + readerAccessToken)
      .send(book1);
    expect(response.statusCode).toBe(403); // Expecting Forbidden access
  });

  // Check if the book1 is added to the database
  test("Test Get All Books in DB", async () => {
    const response = await request(app)
      .get("/book")
      .set("Authorization", "JWT " + authorAccessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const rc = response.body[0];
    expect(rc.name).toBe(book1.name);
  });

  test("Test Post Duplicate Book", async () => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", "JWT " + authorAccessToken)
      .send(book1);
    expect(response.statusCode).toBe(406);
  });
});