import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Review , {IReview} from "../models/review_model";
import User, {IUser} from "../models/user_model";

let app: Express;

const user: IUser = {
  email: "testReview@test.com",
  password: "1234567890",
}
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
  console.log("tihs is id: " ,bookId);
});



afterAll(async () => {
  await mongoose.connection.close();
});


const review1: IReview = {
        BookName: "Book1",
        date: null,
        text: "Good book",
        owner: user._id,
        bookId: bookId,
        
    };

    console.log("this is review1: " , review1);


describe("Reviews tests", () => {
  const addReviewOnBook = async (review: IReview) => {
    const response = await request(app)
      .post("/review")
      .set("Authorization", "JWT " + accessToken)
      .send(review);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.bookId).toBe(review.bookId);
    expect(response.body.BookName ).toBe(review.BookName);
    expect(response.body.text).toBe(review.text);
};

    // test("Get token", async () => {
    //     const response = await request(app).post("/auth/register").send(user);
    //     user._id = response.body._id;
    //     const response2 = await request(app)
    //       .post("/auth/login")
    //       .send(user);
    //     accessToken = response2.body.accessToken;
    //     expect(accessToken).toBeDefined();
    //   });



      test("Test Get All Student posts - empty response", async () => {
        const response = await request(app).get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

      test("Test Post Review", async () => {
          addReviewOnBook(review1);
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
});