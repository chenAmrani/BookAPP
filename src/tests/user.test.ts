import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import { Express } from "express";

let app: Express;
let accessTokenUser1: string;
let accessTokenUser2: string;
let accessTokenUser3: string;
let adminUserId:string;
let authorUserId:string;
let readerUserId:string;




const adminUser = {
    name: "admin1",
    email: "admin@test.com",
    password: "adminpass",
    role: "admin",
    Image: "image1"
  };
  
  const authorUser = {
    name: "author1",
    email: "author@test.com",
    password: "authorpass",
    role: "author",
    Image: "image1"
  };
  
  const readerUser = {
    name: "reader1",
    email: "reader@test.com",
    password: "readerpass",
    role: "reader",
    Image: "image1"
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
    });
  
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

          //every user can get user by email.
          test("Test Get User by Email", async () => {
            const userEmail = readerUser.email;
        
            const response = await request(app).get(`/user/${userEmail}`)
            .set("Authorization", "JWT " + accessTokenUser1);
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe(readerUser.name);
            expect(response.body._id).toBe(readerUserId)
          });

          //update
          test("Test Update - Admin", async () => {
            const updateData = {
              id:adminUserId,
              user: {
                name : "Chen Amrani",
                email: "author@test.com",
                password: "authorpass",
              }
            }
      
            const response = await request(app)
            .put("/user/update")
            .set("Authorization", "JWT " + accessTokenUser1)
            .send(updateData);
      
            expect(response.statusCode).toBe(200);
            
          });


          test("Test Update - not Admin , and not on the same user", async () => {
            const updateData = {
              id:authorUserId,
              user: {
                name : "Chen Amrani",
                email: "updateName@gmail.com",
                password: "123456789",
              }
            }
      
            const response = await request(app)
            .put("/user/update")
            .set("Authorization", "JWT " + accessTokenUser3)
            .send(updateData);
      
            expect(response.statusCode).toBe(403);
            
          });


          // test("Test Update user that not exist", async () => {
          //   const nonExistentUserId = "6592857c6341227f90e3fdd3";
          //   const updateData = {
          //     id: nonExistentUserId,
          //     user: {
          //       name : "Chen Amrani",
          //       email: "author@test.com",
          //       password: "authorpass"
          //     }
          //   }
      
          //   const response = await request(app)
          //   .put("/user/update")
          //   .set("Authorization", "JWT " + accessTokenUser1)
          //   .send(updateData);
      
          //   expect(response.statusCode).toBe(404);
            
          // });


          test("Test Update Own Profile - Success", async () => {
            const updateData = {
              id: authorUserId,
              user: {
                name: "updateName",
                email: "author@test.com",
                password: "authorpass",
              },
            };

            const response = await request(app)
            .put('/user/updateOwnProfile')
            .set("Authorization", "JWT " + accessTokenUser2)
            .send(updateData);
        
          expect(response.statusCode).toBe(200);
        
          
          const updatedUserResponse = await request(app)
            .get(`/user/${authorUserId}`)
            .set("Authorization", "JWT " + accessTokenUser1);
        
          expect(updatedUserResponse.status).toBe(200);
          
        
        });

           

          //delete
            // test("Test Delete user by Id - Admin", async () => {
            //     const response = await request(app)
            //     .delete(`/user/delete/${readerUserId}`)
            //     .set("Authorization", "JWT " + accessTokenUser1);
        
            //     expect(response.statusCode).toBe(200);
                
            // });


            //tests that check that return us error.
          //   test("Test Delete user by Id - not Admin,and not on the same user ", async () => {
          //     const response = await request(app)
          //     .delete(`/user/deleteByAuthor${readerUserId}`)
          //     .set("Authorization", "JWT " + accessTokenUser2);
      
          //     expect(response.statusCode).toBe(403);
              
          // });
                

                // const getUserResponse = await request(app)
                // .get(`/user/${authorUserId}`).
                //  set('Authorization', 'JWT ' + accessTokenUser2);
                // expect(getUserResponse.status).toBe(200);
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
        
