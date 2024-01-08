import Review, { IReview } from "../models/review_model";
import {BaseController} from "./base_controller";
import {Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
//import book_model from "../models/book_model";

class ReviewController extends BaseController<IReview> {
    constructor() {
        super(Review);
    }

    async post(req: AuthRequest, res: Response) {
        console.log("review:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        // const bookID = req.body.bookId;  // Assuming bookID is the review ObjectId
        // const book = await book_model.findById({ '_id': bookID});
        // await book.reviews.push(bookID);
        // await book.save();

        super.post(req, res);
        }
    }
    
export default new ReviewController();
