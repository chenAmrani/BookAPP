
// import  { Express } from "express";
// import request from "supertest";
// import initApp from "../app";
// import mongoose from "mongoose";
// import Review  from "../models/review_model";
// import User, {IUser} from "../models/user_model";


// let app: Express;
// let createdReview1Id: string;
// let createdReview2Id: string;
// let createdReview3Id: string;

// let readerAccessToken: "";
// let adminAccessToken: "";

// const readerUser :  IUser = {
//   _id: "",
//   name:"reader2",
//   email: "reader2@test.com",
//   password: "readerpass",
//   image: "image1",
//   role: "reader",
//   isGoogleSsoUser: false 
// };
// const adminUser :  IUser = {
//   _id: "",
//   name:"admin2",
//   email: "admin@test.com",
//   password: "adminpass",
//   image: "image1",
//   role: "admin",
//   isGoogleSsoUser: false 
// };

// interface IReview {
//   BookName: string;
//   date: Date;
//   text: string;
//   reviewerId:string;
//   bookId?: typeof mongoose.Schema.Types.ObjectId;
// }
// const review1: IReview = {
//   BookName: "Book1",
//   date: null,
//   text: "review 1",
//   reviewerId: readerUser._id,
// };

// const review2: IReview = {
//   BookName: "Book1",
//   date: null,
//   text: "review 2",
//   reviewerId: readerUser._id,
// };

// const review3: IReview = {
//   BookName: "updateBookName",
//   date: null,
//   text: "review 3",
//   reviewerId: readerUser._id,
// };




// let bookId: typeof mongoose.Schema.Types.ObjectId;
// beforeAll(async () => {
//   app = await initApp();
//   console.log("beforeAll");
//   await Review.deleteMany();

//   await User.deleteMany ({ 'email': readerUser.email });
//   const response = await request(app).post("/auth/register").send(readerUser); //return the user_Id
//   readerUser._id = response.body._id;
//   const response2 = await request(app).post("/auth/login").send(readerUser);
//   readerAccessToken = response2.body.accessToken;

//   const response3 = await request(app).post("/auth/register").send(adminUser); //return the user_Id
//   readerUser._id = response3.body._id;
//   const response4 = await request(app).post("/auth/login").send(adminUser);
//   adminAccessToken = response4.body.accessToken;
  
//   const book1 = await request(app).get("/book").set("Authorization", "JWT " + readerAccessToken);
//   bookId = book1.body[0]._id;
//   review1.bookId = bookId;
//   review2.bookId = bookId;
//   review3.bookId = bookId;
// }, 10000);



// afterAll(async () => {
//   await mongoose.connection.close();
// });

//   // const review = { bookId, text, reviewerId: req.user._id };
// describe("Reviews tests", () => {
// //     const addReviewOnBook = async (review: IReview) => {
// //         const response = await request(app)
// //             .post("/review")
// //             .set("Authorization", "JWT " + accessToken)
// //             .field('reviewerId', readerUser._id)
// //             .field('text', review.text)
// //             .field('BookName', review.BookName)
// //             .field('bookId', review.bookId.toString())
// //             .field('reviewerId', review.reviewerId.toString())
// //             .field('date', 'null');
// //         expect(response.statusCode).toBe(201);
// //         expect(response.body.BookName).toBe(review.BookName);
// //         expect(response.body.text).toBe(review.text);
// //         createdReview1Id = response.body._id;
// // };

//       test("Test Get All reviews in empty data base - empty response", async () => {
//         const response = await request(app).get("/review");
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toStrictEqual([]);
//       });

//       test("Test Post Review1", async () => {
//         const response = await request(app)
//             .post("/review")
//             .set("Authorization", "JWT " + readerAccessToken)
//             .send(review1);

//         expect(response.statusCode).toBe(201);
//         expect(response.body.text).toBe(review1.text);
//         createdReview1Id = response.body._id;
//     });
 
//       test("Test Post Review2", async () => {
//         const response = await request(app)
//             .post("/review")
//             .set("Authorization", "JWT " + readerAccessToken)
//             .send(review2);

//         expect(response.statusCode).toBe(201);
//         expect(response.body.text).toBe(review2.text);
//         createdReview2Id = response.body._id;
//       });

//       test("Test Post Review3", async () => {
//         const response = await request(app)
//             .post("/review")
//             .set("Authorization", "JWT " + readerAccessToken)
//             .send(review2);

//         expect(response.statusCode).toBe(201);
//         expect(response.body.text).toBe(review2.text);
//         createdReview3Id = response.body._id;
//       });

//       test('Add review on a non-existing book', async () => {
//         const nonExistingBookId = '60f2c5d97329573b6cfe0e77'; // Non-existing book ID
//         const reviewData = {
//           bookId: nonExistingBookId,
//           text: 'This is a review for a non-existing book',
//         };
      
//         const response = await request(app)
//           .post('/review')
//           .set('Authorization', 'JWT ' + readerAccessToken) 
//           .send(reviewData);
      
//         expect(response.status).toBe(404);
//       });
    
//       test("Test Get All reviews with three reviews in the DB", async () => {
//         const response = await request(app).get("/review")
//         expect(response.statusCode).toBe(200);
//         const reviews = response.body; 
//         expect(reviews.toBeDefined);
//         expect(reviews.length).toBeGreaterThan(0);
//         console.log("reviews that returned from the test: ", reviews);
//     });
//     test('Get reviews by book ID', async () => {
//       const response = await request(app).get(`/review/${review1.bookId}`);
//       expect(response.status).toBe(200);
//       console.log("response.body in the test is this !!!!!: ", response.body);
//     });
    
//     // test('Get reviews by non-existing book ID', async () => {
//     //   const nonExistingBookId = '60f2c5d97329573b6cfe0e78'; // Non-existing book ID
//     //   const response = await request(app).get(/review/${nonExistingBookId});
//     //   expect(response.status).toBe(404);
//     // });

//       test("Delete review", async () => {
//         const response = await request(app)
//           .delete(`/review/${createdReview1Id}`)
//           .set("Authorization", "JWT " + readerAccessToken);
//         expect(response.statusCode).toBe(200);
//       });
    
//       test("Admin delete a review by its ID ", async () => {
//         const response = await request(app)
//           .delete(`/review/admin/${createdReview2Id}`)
//           .set("Authorization", "JWT " + adminAccessToken);
//         expect(response.statusCode).toBe(200);
//       });
    

//       test('Update review with valid data', async () => {
//         const newText = 'Updated review text';
//         const response = await request(app)
//           .put('/review')
//           .set("Authorization", "JWT " + readerAccessToken)
//           .send({ id: createdReview3Id, text: newText });
//         expect(response.status).toBe(200);
//         expect(response.body).toEqual(
//           expect.objectContaining({
//             _id: createdReview3Id,
//             text: newText,
//           })
//         );
//       });
//       test('Update review with invalid data', async () => {
//         const nonExistingUserId = '60f2c5d97329573b6cfe0e78'; // Non-existing review ID
//         const response = await request(app)
//           .put('/review')
//           .set("Authorization", "JWT " + nonExistingUserId)
//           .send({ id: createdReview3Id, text: '' });
//         expect(response.status).toBe(401);
//       });  
      

//       test("Test Delete Review with Non-existing ID", async () => {
//         const nonExistingReviewId = "60f2c5d97329573b6cfe0e78"; // Non-existing review ID
//         const response = await request(app)
//           .delete(`/review/${nonExistingReviewId}`)
//           .set("Authorization", "JWT " + readerAccessToken);
      
//         expect(response.status).toBe(404);
//       });
//         test("Test Delete Review with Non-existing ID", async () => {
//     const nonExistingReviewId = "60f2c5d97329573b6cfe0e78"; // Non-existing review ID
//     const response = await request(app)
//       .delete(`/review/${nonExistingReviewId}`)
//       .set("Authorization", "JWT " + readerAccessToken);

//     expect(response.status).toBe(404);
//   });

//       test("Test Delete Review with Missing ID", async () => {
//         const response = await request(app)
//           .delete("/review/")
//           .set("Authorization", "JWT " + readerAccessToken);
      
//         expect(response.status).toBe(404);
//       });
//  });