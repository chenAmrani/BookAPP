import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
// import Post from "../models/book_post_model";



let app: Express;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
//   await Book.deleteMany();

//   User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;
// });
});

afterAll(async () => {
  await mongoose.connection.close();
});

interface IBookPost {
    name: string;
    date: Date;
    text: string;
    bookId: typeof mongoose.Schema.Types.ObjectId;
}

const post1: IBookPost = {
        name: "post1",
        date: null,
        text: "text1",
        bookId: null,
    
    };




describe("Book tests", () => {
    const addBook = async (post: IBookPost) => {
        const response = await request(app).post("/bookPost").send(post);
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("OK");
    };
    
    test("Test get all books", async () => {
        const response = await request(app).get("/bookPost");
        expect(response.status).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test Post Book", async () => {
        await addBook(post1);
    });

    test("Test Get All post in DB", async () => {
        const response = await request(app).get("/bookPost");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe(post1.name);
        expect(response.body[0].date).toBe(post1.date);
        expect(response.body[0].text).toBe(post1.text);
        expect(response.body[0].bookId).toBe(post1.bookId);

    });

    // test("Test Post duplicate Book", async () => {
    //     const response = await request(app).post("/book").send(post11);
    //     expect(response.status).toBe(406);
    // });

});