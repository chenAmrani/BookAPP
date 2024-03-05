
import express, { Express } from "express";
import mongoose from "mongoose";
import bookRoute from "./routes/book_routes";
import reviewRoute from "./routes/review_routes";
import authRoute from "./routes/auth_route";
import userRoute from "./routes/user_route";
import cors from "cors";


const initApp = (): Promise<Express> => {
  const promise = new Promise<Express>((resolve) => {
    const db = mongoose.connection;
    db.once("open", () => console.log("Connected to Database"));
    db.on("error", (error) => console.error(error));
    const url = process.env.DB_URL;
    mongoose.connect(url!).then(() => {
      const app = express();
      app.use(cors());
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      app.use("/book", bookRoute);
      app.use("/review", reviewRoute);
      app.use("/auth", authRoute);
      app.use("/user", userRoute);
      app.use('/static', express.static( 'static'));
      resolve(app);
    });
  });
  return promise;
};

export default initApp;
