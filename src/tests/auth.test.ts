
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import { Express } from "express";
import User from "../models/user_model";
import path from 'path';
//
let app: Express;
const user = {
  name: "name1",
  email: "Admin@test.com",
  password: "123456789",
  role: "admin",
  image: "image1",
}
beforeAll(async () => {
  app = await initApp();
  console.log("beforeAll");
  await User.deleteMany({ 'email': user.email });
}, 10000);

afterAll(async () => {
  await mongoose.connection.close();
});

let accessToken: string;
let refreshToken: string;
// let newRefreshToken: string;


describe("Auth tests", () => {
  test("Test Register", async () => {
    const response = await request(app)
      .post("/auth/register")
      .field("name", user.name)
      .field("email", user.email)
      .field("password", user.password)
      .field("role", user.role)
      .attach("avatar",path.join(__dirname, "../../static/uploads/avatar.jpg"));
  
    expect(response.statusCode).toBe(201);
  });
  

  test("Test Register exist email", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send(user);
    expect(response.statusCode).toBe(406);
  });

  test("Test Register missing password", async () => {
    const response = await request(app)
      .post("/auth/register").send({
        email: "test@test.com",
      });
    expect(response.statusCode).toBe(400);
  });


  test("Test Register missing email", async () => {
    const response = await request(app)
        .post("/auth/register").send({
            name: "testUser",
            password: "test123"
        });
    expect(response.statusCode).toBe(400);
});

test("Test Register short password", async () => {
  const response = await request(app)
      .post("/auth/register").send({
          name: "Short",
          email: "Short@test.com",
          password: "11",
      });
  expect(response.statusCode).toBe(400);
});

test("Test Register ivalid name", async () => {
  const response = await request(app)
      .post("/auth/register").send({
          name: "!",
          email: "Invalid@Name.com",
          password: "11",
      });
  expect(response.statusCode).toBe(400);
});

test("Test Register ivalid email", async () => {
  const response = await request(app)
      .post("/auth/register").send({
          name: "invalidEmail",
          email: "Inalidtest.com",
          password: "11",
      });
  expect(response.statusCode).toBe(400);
});

test("Test Register missing name", async () => {
  const response = await request(app)
      .post("/auth/register").send({
          email: "test@test.com",
          password: "test123"
      });
  expect(response.statusCode).toBe(400);
});

test("Test login missing email", async () => {
  const response = await request(app)
      .post("/auth/login").send({
          password: "test123"
      });
  expect(response.statusCode).toBe(400);
});

test("Test login with Incorrect email", async () => {
  const response = await request(app)
      .post("/auth/login").send({
        email: "Admi@test.com",
        password: "123456789",
      });
  expect(response.statusCode).toBe(401);
});

test("Test login with Incorrect password", async () => {
  const response = await request(app)
      .post("/auth/login").send({
        email: "Admi@test.com",
        password: "12345678",
      });
  expect(response.statusCode).toBe(401);
});

test("Test login missing password", async () => {
  const response = await request(app)
      .post("/auth/login").send({
          email: "missingPass"
      });
  expect(response.statusCode).toBe(400);
});


  test("Test Login", async () => {
    const response = await request(app)
    .post("/auth/login")
    .send(user);
    expect(response.statusCode).toBe(200);
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
    expect(accessToken).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/user"); 
    expect(response.statusCode).toBe(401);

  });
  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT 1" + accessToken);
    expect(response.statusCode).toBe(401);
  });
  test("Logout user with a valid token", async () => {
    const response = await request(app)
      .get("/auth/logout")
      .set("Authorization", "JWT " + accessToken);
    expect(response.statusCode).toBe(200);
  });

    test ("Test refresh token", async () => {
      const response = await request(app)
          .post("/auth/refresh")
          .send({
            refreshToken: refreshToken
          });
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.refreshToken).toBeDefined();
  
      const newAccessToken = response.body.accessToken;
      // newRefreshToken = response.body.refreshToken;
      
  
      const response2 = await request(app)
        .get("/user")
        .set("Authorization", "JWT " + newAccessToken);
      expect(response2.statusCode).toBe(200);
    });

  
    test("Test Register missing role", async () => {
      const response = await request(app)
        .post("/auth/register")
        .send({
          name: "testUser",
          email: "test@test.com",
          password: "test123"
        });
      expect(response.statusCode).toBe(400);
    });

    test("Test login missing email", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({
          password: "test123"
        });
      expect(response.statusCode).toBe(400);
    });



    test("Test access after timeout of token", async () => {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for token to expire
      const response = await request(app)
        .get("/user")
        .set("Authorization", "JWT " + accessToken);
      expect(response.statusCode).toBe(401);
    });
    jest.setTimeout(10000);
  test("Test access after timeout of token", async () => {
    await new Promise(resolve => setTimeout(() => resolve("its free the promis"), 5000));
    
      const response = await request(app)
        .get("/user")
        .set("Authorization", "JWT" + accessToken);
      expect(response.statusCode).not.toBe(200);
    });

 
    test("Test logout with invalid token", async () => {
      const response = await request(app)
        .get("/auth/logout")
        .set("Authorization", "JWT 1" + accessToken);
      expect(response.statusCode).toBe(401);
    });

});