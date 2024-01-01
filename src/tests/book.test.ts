import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Book from "../models/book_model";



let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
   await Book.deleteMany();

//   User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;
// });
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
        const response = await request(app).post("/book").send(book);
        expect(response.status).toBe(201);
    };
    
    test("Test get all books", async () => {
        const response = await request(app).get("/book");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test Post Book", async () => {
        addBook(book1);
    });

    //to check if the book1 is added to the database
    test("Test Get All Books with one post in DB", async () => {
        const response = await request(app).get("/book");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        const rc = response.body[0];
        expect(rc.name).toBe(book1.name);
        
    });



  

    test("Test Post duplicate Book", async () => {
        const response = await request(app).post("/book").send(book1);
        expect(response.status).toBe(406);
    });

});