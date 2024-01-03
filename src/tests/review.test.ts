import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Review from "../models/review_model";
import User, {IUser} from "../models/user_model";


let app: Express;
const user:IUser = {
  email: "testBook@test.com",
  password: "1234567890",
}
let accessToken: string;

beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Review.deleteMany();

  await User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;

});

afterAll(async () => {
  await mongoose.connection.close();
});

interface IReview {
    name: string;
    date: Date;
    text: string;
    // bookId: typeof mongoose.Schema.Types.ObjectId;
}

const review1: IReview = {
        name: "Ori",
        date: null,
        text: "Good book",
        // bookId: null,
    };


describe("Reviews tests", () => {
  const addReviewOnBook = async (review: IReview) => {
    const response = await request(app)
      .post("/review")
      .set("Authorization", "JWT " + accessToken)
      .send(review);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(user._id);
    expect(response.body.title).toBe(review.name);
    // expect(response.body.title).toBe(review.date);
    expect(response.body.message).toBe(review.text);
};

    test("Get token", async () => {
        const response = await request(app).post("/auth/register").send(user);
        user._id = response.body._id;
        const response2 = await request(app)
          .post("/auth/login")
          .send(user);
        accessToken = response2.body.accessToken;
        expect(accessToken).toBeDefined();
      });



      test("Test Get All Student posts - empty response", async () => {
        const response = await request(app).get("/review");
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
      });

      test("Test Post Student post", async () => {
        addReviewOnBook(review1);
      });

      test("Test Get All Students posts with one post in DB", async () => {
        const response = await request(app).get("/studentpost");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(review1.name);
        //expect(rc.message).toBe(review1.date);
        expect(rc.message).toBe(review1.text);
        expect(rc.owner).toBe(user._id);
      });

   

});