import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Book from "../models/book_model";
import { Express } from "express";
import User , {IUser} from "../models/user_model";

let app: Express;
let authorAccessToken: string;
let readerAccessToken: string;
let adminAccessToken: string;


const adminUser : IUser = {
  name:"name1",
  email: "admin@test.com",
  password: "adminpass",
  role: "admin"
};

const authorUser : IUser = {
  name:"name1",
  email: "author@test.com",
  password: "authorpass",
  role: "author"
};

const readerUser : IUser = {
  name:"name1",
  email: "reader@test.com",
  password: "readerpass",
  role: "reader"
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
  image: "image1",
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
  image: "image2",
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
  image: "image2",
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
  console.log("adminUser._id: " , adminUser._id);
  book2.author = adminUser._id;
  book3.author = adminUser._id;
  console.log("adminAccessToken" + adminAccessToken);
  
  const response = await request(app).post("/auth/register").send(authorUser);
  authorUser._id = response.body._id;
  const authorResponse = await request(app).post("/auth/login").send(authorUser);
  authorAccessToken = authorResponse.body.accessToken;
  book1.author = authorUser._id;

  await request(app).post("/auth/register").send(readerUser);
  const readerResponse = await request(app).post("/auth/login").send(readerUser);
  readerAccessToken = readerResponse.body.accessToken;
});

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

  test("Test Author Adding Book", async () => {
    const response = await request(app)
    .post("/book/")
    .set("Authorization", "JWT " + authorAccessToken)
    .send(book1);
    console.log("book1: " , book1);
  expect(response.status).toBe(201);
  createdBookId = response.body._id;
  console.log("createdBookId: " , createdBookId);
  });
  test("Test Admin Adding Book", async () => {
     const response = await request(app)
      .post("/book/admin")
      .set("Authorization", "JWT " + adminAccessToken)
      .send(book2);
    expect(response.status).toBe(201);
    createdBookId2 = response.body._id;
  });
  test("Test Admin Adding Book", async () => {
    const response = await request(app)
     .post("/book/admin")
     .set("Authorization", "JWT " + adminAccessToken)
     .send(book3);
   expect(response.status).toBe(201);
   //createdBookId3 = response.body._id;
 });

  test("Test Reader Adding Book - not allowed", async () => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", "JWT " + readerAccessToken)
      .send(book1);
    expect(response.statusCode).toBe(403); // Expecting Forbidden access
  });

  // Check if the book1 is added to the database
  test("Test Get All Books in DB - 3 books before delete book2", async () => {
    const response = await request(app)
      .get("/book")
      .set("Authorization", "JWT " + readerAccessToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(3);
    const rc = response.body[0];
    expect(rc.name).toBe(book1.name);
  });
  // test("Test Author Getting His Books", async () => {
  //   const response = await request(app)
  //     .get("/book")
  //     .set("Authorization", "JWT " + authorAccessToken);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.length).toBe(1);
  // });
  // test("Test Get My Books - Success", async () => {
  //   const response = await request(app).get("/user/books")
  //   .set("Authorization", "JWT " + authorAccessToken);
  //   const rc = response.body[0];
  //   //console.log(rc)
  //   expect(response.statusCode).toBe(200);
  //   expect(rc.email).toBe(authorUser.email);
  // });

  test("Test Post Duplicate Book", async () => {
    const response = await request(app)
      .post("/book")
      .set("Authorization", "JWT " + authorAccessToken)
      .send(book1);
    expect(response.statusCode).toBe(406);
  });

  test("Test Admin Deleting Book", async () => {
    expect(createdBookId2).toBeDefined(); // Ensure book ID is available
    // console.log("bookid:", createdBookId2);
    const deleteResponse = await request(app)
      .delete(`/book/admin/delete/${createdBookId2}`)
      .set("Authorization", "JWT " + adminAccessToken);

    expect(deleteResponse.statusCode).toBe(200);
  });
  test("Test Author Update Own Book - Success", async () => {
    // Assuming createdBookId is defined and contains a valid book ID
    const updatedBookDetails = {
      name: "updateBookName",
      year: 2020,
      image: "image1",
      pages: 100,
      price: 100,
      rating: 5,
      author: authorUser._id,
      category: "category1",
      summary: "summary1",
      reviews: null,
    };
    
  console.log("authorUser._id: " , authorUser._id);
    const response = await request(app)
      .put(`/book/updateOwnBook/${createdBookId}`) 
      .set("Authorization", "JWT " + authorAccessToken) 
      .send(updatedBookDetails);
  
    expect(response.statusCode).toBe(200);
    
  });



  test("Test Author Update admin Book - not Success", async () => {
    const updatedBookDetails2 = {
      name: "newBook",
      year: 2020,
      image: "image1",
      pages: 100,
      price: 100,
      rating: 5,
      author: adminUser._id,
      category: "category1",
      summary: "summary1",
      reviews: null,
    };
    
  
    const response = await request(app)
      .put(`/book/updateOwnBook/${createdBookId3}`) 
      .set("Authorization", "JWT " + authorAccessToken) 
      .send(updatedBookDetails2);
  
    expect(response.statusCode).toBe(403);
    
  });
  
});