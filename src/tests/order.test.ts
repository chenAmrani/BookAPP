import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import Order , {IOrder} from "../models/order_model";
import User, {IUser} from "../models/user_model";

let app: Express;

const user: IUser = {
  email: "testReview@test.com",
  password: "1234567890",
}
let accessToken: "";
let userId: typeof mongoose.Schema.Types.ObjectId;
let bookId1: typeof mongoose.Schema.Types.ObjectId;
let bookId2: typeof mongoose.Schema.Types.ObjectId;
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await Order.deleteMany();

  await User.deleteMany ({ 'email': user.email });
  const response = await request(app).post("/auth/register").send(user); //return the user_Id
  userId = response.body._id;
  const response2 = await request(app).post("/auth/login").send(user);
  accessToken = response2.body.accessToken;
  
  const book1 = await request(app).get("/book").set("Authorization", "JWT " + accessToken);
  console.log("DB books: " ,book1.body);
  bookId1 = book1.body[0]._id;
  bookId2 = book1.body[1]._id;
  console.log("tihs is id: " ,bookId1);
  console.log("tihs is id: " ,bookId2);
});



afterAll(async () => {
  await mongoose.connection.close();
});

const order1: IOrder = {
    user: userId,
    books: [bookId1, bookId2],
    orderNumber: 1,
    orderDate: null,
};

console.log("User: ", order1.user);
console.log("Books: ", order1.books);

describe("Order tests", () => {
  const addNewOrder = async (order: IOrder) => {
    const response = await request(app)
      .post("/order")
      .set("Authorization", "JWT " + accessToken)
      .send(order);
    expect(response.statusCode).toBe(201);
    console.log("this is response: " , response.body);
    expect(response.body.user).toBe(order1.user);
    expect(response.body.orderNumber).toBe(order.orderNumber);
};

      test("Test Get All orders - empty response", async () => {
        const response = await request(app).get("/order");
        console.log("this is response.body: " , response.body);
        console.log("responseCode:", response.statusCode);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBe([]);
      });

      test("Test add new orderr to DB", async () => {
          addNewOrder(order1);
      });

      //after add order1 to DB we check if we have 1 order in the DB.
      test("Test Get All order in the DB", async () => {
        const response = await request(app).get("/order");
        expect(response.statusCode).toBe(200);
        const rc = await response.body[0];
        console.log("this is rc: " , rc);
        expect(rc.user).toBe(order1.user);
        expect(rc.number).toBe(order1.orderNumber);
    
      });
    });