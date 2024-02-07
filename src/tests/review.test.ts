import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Review  from "../models/review_model";
import User, {IUser} from "../models/user_model";


let app: Express;
let createdReview1: string;


const readerUser :  IUser = {
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
  BookName: "Book1",
  date: null,
  text: "review 1",
  reviewerId: readerUser._id,
};

const review2: IReview = {
  BookName: "Book1",
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
            .field('date', review.date.toString());

            

        expect(response.statusCode).toBe(201);
        expect(response.body.BookName).toBe(review.BookName);
        expect(response.body.text).toBe(review.text);
        createdReview1 = response.body._id;
};

    //   test("Test Get All Student posts - empty response", async () => {
    //     const response = await request(app).get("/review");
    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toStrictEqual([]);
    //   });

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
        expect(rc.owner).toBe(readerUser._id);
      });

      test("Delete review", async () => {
        const response = await request(app)
          .delete(`/review/${createdReview1}`)
          .set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
      });

     



  
   
});