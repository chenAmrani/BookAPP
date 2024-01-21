import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Review  from "../models/review_model";
import User, {IUser} from "../models/user_model";

let app: Express;
let createdReview1: string;

const user: IUser = {
  name:"Moshe Amrani",
  image: "image1",
  email: "testReview@test.com",
  password: "1234567890",
  role: "reader",
}

interface IReview {
  BookName: string;
  date: Date;
  text: string;
  owner:string;
  bookId?: typeof mongoose.Schema.Types.ObjectId;
}
const review1: IReview = {
  BookName: "Book1",
  date: null,
  text: "review 1",
  owner: user._id,
};

const review2: IReview = {
  BookName: "Book1",
  date: null,
  text: "review 2",
  owner: user._id,
};


let accessToken: "";

let bookId: typeof mongoose.Schema.Types.ObjectId;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Review.deleteMany();

  await User.deleteMany ({ 'email': user.email });
  const response = await request(app).post("/auth/register").send(user); //return the user_Id
  user._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
  
  const book1 = await request(app).get("/book").set("Authorization", "JWT " + accessToken);
  console.log("DB books: " ,book1.body);
  bookId = book1.body[0]._id;
  review1.bookId = bookId;
  review2.bookId = bookId;
  console.log("tihs is id: " ,bookId);
});



afterAll(async () => {
  await mongoose.connection.close();
});




    console.log("this is review1: " , review1);


console.log("this is review1.bookId: " , review1.bookId);
describe("Reviews tests", () => {
  const addReviewOnBook = async (review: IReview) => {
    const response = await request(app)
      .post("/review")
      .set("Authorization", "JWT " + accessToken)
      .send(review);
    expect(response.statusCode).toBe(201);
    createdReview1 = response.body._id;
};

      test("Test Get All Student posts - empty response", async () => {
        const response = await request(app).get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

      test("Test Post Review1", async () => {
          await addReviewOnBook(review1);
      });
      test("Test Post Review2", async () => {
        await addReviewOnBook(review2);
    });

      test("Test Get All reviews with one review in the DB", async () => {
        const response = await request(app).get("/review");
        expect(response.statusCode).toBe(200);
        const rc = await response.body[0];
        console.log("this is rc: " , rc);
        expect(rc.BookName ).toBe(review1.BookName);
        expect(rc.bookId).toBe(review1.bookId)
        expect(rc.text).toBe(review1.text);
        expect(rc.owner).toBe(user._id);
      });

      test("Delete review", async () => {
        const response = await request(app)
          .delete(`/review/${createdReview1}`)
          .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
      });

     



  
   
});