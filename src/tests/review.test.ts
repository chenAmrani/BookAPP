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
    const addReviewOnBook = async (post: IReview) => {
        const response = await request(app).post("/review").set("Authorization", "JWT " + accessToken).send(post);
        expect(response.statusCode).toBe(201);
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



    
    test("Test get all reviews on books", async () => {
        const response = await request(app).get("/review").set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    test("Test add Review on book", async () => {
        await addReviewOnBook(review1);
    });

    // test("Test Get All post in DB", async () => {
    //     const response = await request(app).get("/bookpost").set("Authorization", "JWT " + accessToken); 
    //     expect(response.status).toBe(200);
    //     expect(response.body.length).toBe(1);
    //     const rc = response.body[0];
    //     expect(rc.title).toBe(post1.name);
    //     expect(rc.text).toBe(post1.text);
    //     expect(rc.date).toBe(post1.date);
    //     expect(rc.owner).toBe(user._id);
    // });

    // test("Test Post duplicate Book", async () => {
    //     const response = await request(app).post("/book").send(post11);
    //     expect(response.status).toBe(406);
    // });

});