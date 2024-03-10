
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import  {IUser} from "../models/user_model";
import fs from "fs";
import Book from "../models/book_model";
import User from "../models/user_model";


const imageBuffer = fs.readFileSync("static/books/book1.jpg");

let app: Express;
let authorAccessToken: string;
let readerAccessToken: string;
let adminAccessToken: string;


const adminUser : IUser = {
  _id: "",
  name:"name1",
  email: "admin@test.com",
  password: "adminpass",
  image: "image1",
  role: "admin",
  isGoogleSsoUser: false 
};

const authorUser : IUser = {
  _id: "",
  name:"name1",
  email: "author@test.com",
  password: "authorpass",
  image: "imageBase64",
  role: "author",
  isGoogleSsoUser: false 
};

const readerUser : IUser = {
  _id: "",
  name:"name1",
  email: "reader@test.com",
  password: "readerpass",
  image: "image1",
  role: "reader",
  isGoogleSsoUser: false 
};

let createdBookId: string;
let createdBookId2: string;
let createdBookId3: string;

interface IBook {
  id?: string;
  name: string;
  year: number;
  image: string;
  pages: number;
  price: number;
  rating: number;
  author?: string;
  category: string;
  summary: string;
  reviews: typeof mongoose.Schema.Types.ObjectId;
}

const book1: IBook = {
  name: "book1",
  year: 2020,
  image: "",
  pages: 100,
  price: 100,
  rating: 5,
  category: "category1",
  summary: "summary1",
  reviews: null,
};
const book2: IBook = {
  name: "book2",
  year: 2020,
  image: "",
  pages: 100,
  price: 100,
  rating: 5,
  category: "category1",
  summary: "summary1",
  reviews: null,
};

const book3: IBook = {
  name: "book3",
  year: 2020,
  image: "",
  pages: 100,
  price: 100,
  rating: 5,
  category: "category1",
  summary: "summary1",
  reviews: null,
};


beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Book.deleteMany();
  
  await User.deleteMany({});

  const adminResponse = await request(app).post("/auth/register").send(adminUser);
  const adminAcscessToken = await request(app).post("/auth/login").send(adminUser);
  adminUser._id = adminResponse.body._id;
  adminAccessToken = adminAcscessToken.body.accessToken;
  book2.author = adminUser._id;
  book3.author = adminUser._id;
  console.log("adminAccessToken" + adminAccessToken);
  
  const response = await request(app).post("/auth/register").send(authorUser);
  authorUser._id = response.body._id;
  const authorResponse = await request(app).post("/auth/login").send(authorUser);
  authorAccessToken = authorResponse.body.accessToken;
  book1.author = authorUser._id;

  const response1 = await request(app).post("/auth/register").send(readerUser);
  const readerResponse = await request(app).post("/auth/login").send(readerUser);
  readerAccessToken = readerResponse.body.accessToken;
  readerUser._id = response1.body._id;
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});


describe("Book tests", () => {

  test("Test Get All Books - empty response", async () => {
    const response = await request(app)
      .get("/book") 
      .set("Authorization", "JWT " + authorAccessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual([]);
  });

//   test("Test Author Adding Book", async () => {
    
//     const response = await request(app)
//         .post("/book")
//         .set("Authorization", "JWT " + authorAccessToken)
//         .field('name', book1.name)
//         .field('year', book1.year)
//         .field('pages', book1.pages)
//         .field('price', book1.price)
//         .field('rating', book1.rating)
//         .field('category', book1.category)
//         .field('summary', book1.summary)
//         .attach('image', imageBuffer, 'fileTest.jpg');

//     expect(response.status).toBe(201);
//     expect(response.body.name).toBe(book1.name);
//     expect(response.body.year).toBe(book1.year);
//     createdBookId = response.body._id;
//     console.log("createdBookId:", createdBookId);
// });

//   test("Test Admin Adding Book2", async () => {
//      const response = await request(app)
//       .post("/book/admin")
//       .set("Authorization", "JWT " + adminAccessToken)
//         .field('name', book2.name)
//         .field('year', book2.year)
//         .field('pages', book2.pages)
//         .field('price', book2.price)
//         .field('rating', book2.rating)
//         .field('category', book2.category)
//         .field('summary', book2.summary)
//         .attach('image', imageBuffer, 'file.jpg');

//     expect(response.status).toBe(201);
//     expect(response.body.name).toBe(book2.name);
//     expect(response.body.year).toBe(book2.year);
//     createdBookId2 = response.body._id;
//   });

//   test("Test Admin Adding Book3", async () => {
//     const response = await request(app)
//      .post("/book/admin")
//      .set("Authorization", "JWT " + adminAccessToken)
//        .field('name', book3.name)
//        .field('year', book3.year)
//        .field('pages', book3.pages)
//        .field('price', book3.price)
//        .field('rating', book3.rating)
//        .field('category', book3.category)
//        .field('summary', book3.summary)
//        .attach('image', imageBuffer, 'file.jpg');

//    expect(response.status).toBe(201);
//    expect(response.body.name).toBe(book3.name);
//    expect(response.body.year).toBe(book3.year);
//    createdBookId3 = response.body._id;
//  });


//   test("Test Reader Adding Book - not allowed", async () => {
//     const response = await request(app)
//       .post("/book")
//       .set("Authorization", "JWT " + readerAccessToken)
//       .send(book1);
//     expect(response.statusCode).toBe(403); 
//   });

//   // Check if the book1 is added to the database
//   test("Test Get All Books in DB - 3 books before delete book2", async () => {
//     const response = await request(app)
//       .get("/book")
//       .set("Authorization", "JWT " + readerAccessToken);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.length).toBe(3);
//     const rc = response.body[0];
//     expect(rc.name).toBe(book1.name);
//   });

  // test("Test Author Getting His Books", async () => {
  //   const response = await request(app)
  //     .get("/book")
  //     .set("Authorization", "JWT " + authorAccessToken);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.length).toBe(1);
  // });

  // test("Test Get My Books - Success", async () => {
  //   const response = await request(app).get("/ownBooks/books")
  //   .set("Authorization", "JWT " + authorAccessToken);
  //   const rc = response.body[0];
  //   //console.log(rc)
  //   expect(response.statusCode).toBe(200);
  //   expect(rc.name).toBe("updateBookName");
  // });

  // test("Test Post Duplicate Book", async () => {
  //   const response = await request(app)
  //     .post("/book")
  //     .set("Authorization", "JWT " + authorAccessToken)
  //     .send(book1);
  //   expect(response.statusCode).toBe(406);
  // });

  // test("Test Admin Deleting Book", async () => {
  //   expect(createdBookId2).toBeDefined(); // Ensure book ID is available
  //   // console.log("bookid:", createdBookId2);
  //   const deleteResponse = await request(app)
  //     .delete(`/book/admin/delete/${createdBookId2}`)
  //     .set("Authorization", "JWT " + adminAccessToken);

  //   expect(deleteResponse.statusCode).toBe(200);
  // });

  // test("Test Author Update Own Book - Success", async () => {
  //   // Assuming createdBookId is defined and contains a valid book ID
  //   const updatedBookDetails = {
  //     name: "updateBookName",
  //     year: 2020,
  //     pages: 100,
  //     price: 100,
  //     rating: 5,
  //     author: authorUser._id,
  //     category: "category1",
  //     summary: "summary1",
  //     reviews: null,
  //   };
    
  //   const response = await request(app)
  //     .put(`/book/updateOwnBook/${createdBookId}`) 
  //     .set("Authorization", "JWT " + authorAccessToken) 
  //     .send(updatedBookDetails);
  
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.name).toBe(updatedBookDetails.name);
  //   expect(response.body.year).toBe(updatedBookDetails.year);
  //   expect(response.body.category).toBe(updatedBookDetails.category);
  // });



  // test("Test Author Update admin Book - not Success", async () => {
  //   const updatedBookDetails2 = {
  //     name: "newBook",
  //     year: 2020,
  //     pages: 100,
  //     price: 100,
  //     rating: 5,
  //     author: adminUser._id,
  //     category: "category1",
  //     summary: "summary1",
  //     reviews: null,
  //   };
    
  //   const response = await request(app)
  //     .put(`/book/updateOwnBook/${createdBookId3}`) 
  //     .set("Authorization", "JWT " + authorAccessToken) 
  //     .send(updatedBookDetails2);
  
  //   expect(response.statusCode).toBe(403);
    
  // });

  // test("Test Get Book By ID", async () => {
  //   const response = await request(app)
  //     .get(`/book/${createdBookId}`) 
  //     .set("Authorization", "JWT " + authorAccessToken);
  //   expect(response.statusCode).toBe(200);
  //   const book = await Book.findById(createdBookId);
  //   expect(response.body.name).toBe(book.name);
  // });

  // test("Test Get Books by Name", async () => {
  //   const bookName = "book3"; // Provide a value for the book name
  //   const response = await request(app)
  //     .get("/book")
  //     .query({ name: bookName }) // Pass the book name as a query parameter
  //     .set("Authorization", "JWT " + authorAccessToken);
  //   expect(response.statusCode).toBe(200);
  // });
});