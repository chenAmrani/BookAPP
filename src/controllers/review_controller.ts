import Review, { IReview } from "../models/review_model";
import {BaseController} from "./base_controller";
import {Response } from "express";
import { AuthRequest } from "../common/auth_middleware";
import book_model from "../models/book_model";
//import book_model from "../models/book_model";

class ReviewController extends BaseController<IReview> {
    constructor() {
        super(Review);
    }

    async post(req: AuthRequest, res: Response) {
        const _id = req.user._id;
        req.body.owner = _id;
        console.log("hiiiiiiiiiiiiiiii");
        console.log("req.body: " , req.body);
        const createReview = await Review.create(req.body);
        const bookId = createReview.bookId;
        console.log("createReview: " , createReview);
        console.log("the book id is: ", bookId.toString());
        
            if (createReview) {
                const book = await book_model.findById(bookId.toString());
                console.log("book: " , book);
                if (book) {
                    console.log("The id of the created reviwe  " + createReview.id)
                    if (!book.reviews) {
                        book.reviews = []; 
                    }
                    book.reviews.push(createReview.id);
                    await book.save();
                    res.status(201).send(createReview)
                } else {
                    res.status(404).send("book not found");
                    return;
                }
            } else {
                res.status(500).send("Error creating review");
                return;
            }
        
           
        } catch (error) {
            console.log(error);
            //res.status(500).json({ message: error.message });
    
        }
    

        async deleteById(req: AuthRequest, res: Response) {
            try {
                console.log("req.params.id: ", req.params.id);
                const review = await Review.findById(req.params.id);
        
                if (!review) {
                    res.status(404).send("Review not found");
                    return;
                }
        
                const book = await book_model.findById(review.bookId);
        
                if (!book) {
                    res.status(404).send("Book not found");
                    return;
                }
        
                await book_model.updateOne({ _id: book._id }, { $pull: { reviews: req.params.id } });
                await Review.findByIdAndDelete(req.params.id);
        
                res.status(200).send("OK");
            } catch (err) {
                res.status(406).send("Fail: " + err.message);
            }
        }
}

export default new ReviewController();
