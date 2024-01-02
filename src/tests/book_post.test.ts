import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import BookPost from "../models/book_post_model";
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
  await BookPost.deleteMany();

  await User.deleteMany({ 'email': user.email });
//   await request(app).post("/auth/register").send(user);
//   const response = await request(app).post("/auth/login").send(user);
//   accessToken = response.body.accessToken;

});

afterAll(async () => {
  await mongoose.connection.close();
});

interface IBookPost {
    name: string;
    date: Date;
    text: string;
    // bookId: typeof mongoose.Schema.Types.ObjectId;
}

const post1: IBookPost = {
        name: "post1",
        date: null,
        text: "text1",
        // bookId: null,
    };




describe("Book post tests", () => {
    const addBookPost = async (post: IBookPost) => {
        const response = await request(app).post("/bookpost").set("Authorization", "JWT " + accessToken).send(post);
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



    
    test("Test get all books post", async () => {
        const response = await request(app).get("/bookpost").set("Authorization", "JWT " + accessToken);
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual([]);
    });

    // test("Test Post Book", async () => {
    //     await addBookPost(post1);
    // });

    test("Test Get All post in DB", async () => {
        const response = await request(app).get("/bookpost").set("Authorization", "JWT " + accessToken); 
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.name);
        expect(rc.text).toBe(post1.text);
        expect(rc.date).toBe(post1.date);
        expect(rc.owner).toBe(user._id);
       
        

    });

    // test("Test Post duplicate Book", async () => {
    //     const response = await request(app).post("/book").send(post11);
    //     expect(response.status).toBe(406);
    // });

});