
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User, { IUser } from "../models/user_model";
import { Express } from "express";

//

let app: Express;
let accessTokenUser1: string;
let accessTokenUser2: string;
let accessTokenUser3: string;
let adminUserId:string;
let authorUserId:string;
let readerUserId:string;




const adminUser : IUser = {
  _id: "",
  name:"name1",
  email: "admin@test.com",
  password: "adminpass",
  image: "image1",
  role: "admin",
  isGoogleSsoUser: false 
};

const authorUser : IUser = {
  _id: "",
  name:"name1",
  email: "author@test.com",
  password: "authorpass",
  image: "imageBase64",
  role: "author",
  isGoogleSsoUser: false 
};

const readerUser : IUser = {
  _id: "",
  name:"name1",
  email: "reader@test.com",
  password: "readerpass",
  image: "image1",
  role: "reader",
  isGoogleSsoUser: false 
};

  beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await User.deleteMany();
  
    await User.deleteMany({ 'email': adminUser.email });
    const res = await request(app).post("/auth/register").send(adminUser);
    adminUserId = res.body._id;
    const response = await request(app).post("/auth/login").send(adminUser);
    accessTokenUser1 = response.body.accessToken;
    // console.log("this is accessTokenUser1: " , accessTokenUser1);
    await User.deleteMany({ 'email': authorUser.email });
    const res2 = await request(app).post("/auth/register").send(authorUser);
    authorUserId = res2.body._id;
    console.log("this is authorUserId!!!!!: " , authorUserId);
    const response2 = await request(app).post("/auth/login").send(authorUser);
    accessTokenUser2 = response2.body.accessToken;
    console.log("this is accessTokenUser2: " , accessTokenUser2);
  
    await User.deleteMany({ 'email': readerUser.email });
    const res3 = await request(app).post("/auth/register").send(readerUser);
    readerUserId = res3.body._id;
    console.log("this is readerUserId: " , readerUserId);
    const response3 = await request(app).post("/auth/login").send(readerUser);
    accessTokenUser3 = response3.body.accessToken;
    console.log("this is accessTokenUser3: " , accessTokenUser3);
    }, 15000);
  
    afterAll(async () => {
      await mongoose.connection.close();
    });

    

    describe('User Controller Tests', () => {

        //Get
        test("Test Get All Users - Admin", async () => {
            const response = await request(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser1);
            expect(response.statusCode).toBe(200);
          });


          test("Test Get All Users - not Admin", async () => {
            const response = await request(app).get("/user/")
            .set("Authorization", "JWT " + accessTokenUser2);
            expect(response.statusCode).toBe(403);
          });

          test("Test Get User by Id - Admin", async () => {
            const response = await request(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
            expect(response.statusCode).toBe(200);
            expect(response.body._id).toBe(authorUserId);
            expect(response.body.name).toBe(authorUser.name);
            expect(response.body.email).toBe(authorUser.email);
          } );


          test("Test Get User by Id - not Admin", async () => {
            const response = await request(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser2);
            expect(response.statusCode).toBe(200);
          } );

          test("Get My Own Book", async () => {
            const response = await request(app)
              .get(`/user/ownBooks/${authorUserId}`)
              .set("Authorization", "JWT " + accessTokenUser2);
            expect(response.statusCode).toBe(200);
          });

          test("Test Get My Books with Invalid User ID", async () => {
            const invalidUserId = "60f2c5d97329573b6cfe0e79"; 
          
            const response = await request(app)
              .get(`/user/ownBooks/${invalidUserId}`)
              .set("Authorization", "JWT " + accessTokenUser2);
          
            expect(response.statusCode).toBe(404); // Expect a not found status code
          });
          //update
          test("Test Update - Admin - succsess", async () => {
            const updateData = {
              id:adminUserId,
              user: {
                name : "change name admin",
                email: "admin@test.com",
                password: "adminpass",
              }
            }
      
            const response = await request(app)
            .put("/user/updateOwnProfile")
            .set("Authorization", "JWT " + accessTokenUser1)
            .field('id', updateData.id)
            .field('name', updateData.user.name)
            .field('email', updateData.user.email)
            .field('password', updateData.user.password);
      
            expect(response.statusCode).toBe(200);
            
          });

          test("Test Update - User - succsess", async () => {
            const updateData = {
              id:authorUserId,
              user: {
                name : "change name author",
                email: "author@test.com",
                password: "authorpass",
              }
            }
      
            const response = await request(app)
            .put("/user/updateOwnProfile")
            .set("Authorization", "JWT " + accessTokenUser2)
            .field('id', updateData.id)
            .field('name', updateData.user.name)
            .field('email', updateData.user.email)
            .field('password', updateData.user.password);
      
            expect(response.statusCode).toBe(200);
            
          });

        
          test("Test Update Profile - Not allowd ", async () => {
            const updateData = {
              id: authorUserId,
              user: {
                name: "TryToUpdateName",
              },
            };
            const response = await request(app)
            .put('/user/updateOwnProfile')
            .set("Authorization", "JWT " + accessTokenUser3)
            .send(updateData);
        
          expect(response.statusCode).toBe(403);
          });

          test("Test Delete My User By Id - not succsess", async () => {
            console.log("this is readerUserId: " , readerUserId);
            const response = await request(app)
            .delete(`/user/deleteMyOwnUser/${readerUserId}`)
            .set("Authorization", "JWT" + accessTokenUser2);
            expect(response.statusCode).toBe(401);
             
        }); 


          test("Test Update user that not exist", async () => {
            const updateData = {
              id: authorUserId,
              user: {
                name : "Chen Amrani",
                email: "author@test.com",
                password: "authorpass"
              }
            }
      
            const response = await request(app)
            .put("/user/updateUser")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
      
            expect(response.statusCode).toBe(404);
            
          });
          
          test("Test Update Profile with Missing Fields", async () => {
            const updateData = {
              id: authorUserId,
              user: {} // Empty object to simulate missing fields
            };
          
            const response = await request(app)
              .put("/user/updateOwnProfile")
              .set("Authorization", "JWT " + accessTokenUser2)
              .set("currentUserId", authorUserId) // Set the currentUserId in req.locals
              .send(updateData);
          
            expect(response.statusCode).toBe(400); // Expect a bad request status code
            expect(response.text).toContain("At least one field (name, email, or password) is required for update");
          });
          


          test("Test Update Profile without Authorization", async () => {
            const updateData = {
              id: authorUserId,
              user: {
                name: "change name author",
                email: "author@test.com",
                password: "authorpass",
              }
            };
          
            const response = await request(app)
              .put("/user/updateOwnProfile")
              .send(updateData); // Sending the update data without authorization
          
            expect(response.statusCode).toBe(401); // Expect an unauthorized status code
          });


          test("Test Delete user by Id - Admin", async () => {
            const response = await request(app)
            .delete(`/user/delete/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
      
            expect(response.statusCode).toBe(200);
            
          });


            test("Test Delete My User By Id - succsess", async () => {
              console.log("this is readerUserId: " , readerUserId);
              const response = await request(app)
              .delete(`/user/deleteMyOwnUser/${readerUserId}`)
              .set("Authorization", "JWT " + accessTokenUser3);
      
              expect(response.statusCode).toBe(200);
              expect(response.body).toEqual({ message: "Usere deleted succesfully" });
              
          });   
          
          test("Test Delete User with Non-existent ID", async () => {
            const nonExistentUserId = "60f2c5d97329573b6cfe0e79"; // Provide a non-existent user ID
          
            const response = await request(app)
              .delete(`/user/delete/${nonExistentUserId}`)
              .set("Authorization", "JWT " + accessTokenUser1);
          
            expect(response.statusCode).toBe(404); // Expect a not found status code
          });

          
});