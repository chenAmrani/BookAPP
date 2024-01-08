import BookModel, { IBook } from "../models/book_model";
// import createController from "./base_controller";
import {BaseController} from "./base_controller";
import {Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import User from "../models/user_model";

class bookController extends BaseController<IBook> {
    constructor() {
        super(BookModel);
    }

    async post(req: AuthRequest, res: Response) {
        // console.log("bookpost:" + req.body);
        const _id = req.user._id;
        req.body.author = _id;
        const user = await User.findById({ '_id': req.user._id});
        user.books.push(req.body._id);
        //need to check why the book is not add to the books array of the user. its add null.
        await user.save();
        super.post(req, res);
    }

    async putById(req: AuthRequest, res: Response) {
        // console.log("bookput:" + req.body);
        const _id = req.params.id;
        req.body._id = _id;
        super.putById(req, res);
    }
}

   
    
export default new bookController();