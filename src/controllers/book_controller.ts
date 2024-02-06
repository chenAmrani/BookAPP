import BookModel, { IBook } from "../models/book_model";
import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import User from "../models/user_model";

class bookController extends BaseController<IBook> {
  constructor() {
    super(BookModel);
  }

  getBooks = async (req: Request, res: Response) => {
    try {
      if (req.query.name) {
        const obj = await this.model.find({ name: req.query.name });
        res.send(obj);
      } else {
        const allObjects = await this.model.find().populate({
          path: "reviews",

          populate: [
            { path: "reviewerId", select: "name image isGoogleSsoUser" },
          ],
        });
        res.send(allObjects);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  post = async (req: AuthRequest, res: Response) => {
    try {
      const _id = req.user._id;
      req.body.author = _id;

      const existingBook = await this.model.findOne({
        name: req.body.name,
        author: req.body.author,
      });

      if (existingBook) {
        res.status(406).send("Book already exists");
        return;
      }

      const book = { ...req.body, image: req.file.filename };

      const createdBook = await this.model.create(book);
      // console.log("this is the real deal: ", createdBook.id)
      if (createdBook) {
        const user = await User.findById(_id);

        if (user) {
          user.books.push(createdBook.id);
          await user.save();
        } else {
          res.status(404).send("User not found");
          return;
        }
      } else {
        res.status(500).send("Error creating book");
        return;
      }

      res.status(201).send(createdBook);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  putById = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id;
      console.log("The id is: " + id);
      const obj = req.body;
      console.log("The obj is: " + obj);
      const updatedBook = await this.model.findByIdAndUpdate(id, obj, {
        new: true,
      });
      console.log("The updatedBook is: " + updatedBook);
      res.status(200).send(updatedBook);
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  };
}

export default new bookController();
