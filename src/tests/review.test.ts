import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Review  from "../models/review_model";
import User, {IUser} from "../models/user_model";


let app: Express;
let createdReview1Id: string;

const readerUser : IUser = {
  _id: "",
  name:"reader2",
  email: "reader2@test.com",
  password: "readerpass",
  image: "image1",
  role: "reader",
  isGoogleSsoUser: false 
};

interface IReview {
  BookName: string;
  date: Date;
  text: string;
  reviewerId:string;
  bookId?: typeof mongoose.Schema.Types.ObjectId;
}
const review1: IReview = {
  BookName: "updateBookName",
  date: null,
  text: "review 1",
  reviewerId: readerUser._id,
};

const review2: IReview = {
  BookName: "updateBookName",
  date: null,
  text: "review 2",
  reviewerId: readerUser._id,
};


let accessToken: "";

let bookId: typeof mongoose.Schema.Types.ObjectId;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Review.deleteMany();

  await User.deleteMany ({ 'email': readerUser.email });
  const response = await request(app).post("/auth/register").send(readerUser); //return the user_Id
  readerUser._id = response.body._id;
  const response2 = await request(app).post("/auth/login").send(readerUser);
  accessToken = response2.body.accessToken;
  
  const book1 = await request(app).get("/book").set("Authorization", "JWT " + accessToken);
  bookId = book1.body[0]._id;
  review1.bookId = bookId;
  review2.bookId = bookId;
 
});



afterAll(async () => {
  await mongoose.connection.close();
});

  // const review = { bookId, text, reviewerId: req.user._id };
describe("Reviews tests", () => {
    const addReviewOnBook = async (review: IReview) => {
        const response = await request(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .field('reviewerId', readerUser._id)
            .field('text', review.text)
            .field('BookName', review.BookName)
            .field('bookId', review.bookId.toString())
            .field('reviewerId', review.reviewerId.toString())
            .field('date', 'null');

            

        expect(response.statusCode).toBe(201);
        expect(response.body.BookName).toBe(review.BookName);
        expect(response.body.text).toBe(review.text);
        createdReview1Id = response.body._id;
};

    //   test("Test Get All Student posts - empty response", async () => {
    //     const response = await request(app).get("/review");
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toStrictEqual([]);
    //   });

    test("Test Post Review1", async () => {
      const response = await request(app)
          .post("/review")
          .set("Authorization", "JWT " + accessToken)
          .send(review1);

      expect(response.statusCode).toBe(201);
      expect(response.body.text).toBe(review1.text);
      createdReview1Id = response.body._id;
    });
 
      test("Test Post Review2", async () => {
        const response = await request(app)
            .post("/review")
            .set("Authorization", "JWT " + accessToken)
            .send(review2);

        expect(response.statusCode).toBe(201);
        expect(response.body.text).toBe(review2.text);
      });
    
      test("Test Get All reviews with two reviews in the DB", async () => {
        const response = await request(app).get("/review");
        expect(response.statusCode).toBe(200);
        const reviews = response.body; 
        expect(reviews.toBeDefined);
        expect(reviews.length).toBeGreaterThan(0);
        console.log("reviews that returned from the test: ", reviews);
    });

      test("User delete his own review by its ID ", async () => {
        const response = await request(app)
          .delete(`/review/${createdReview1Id}`)
          .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
      });

    
   
});