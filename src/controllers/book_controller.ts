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
    
                const createdBook = await this.model.create(req.body);
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
        }

        
    async putById(req: AuthRequest, res: Response) {
        // console.log("bookput:" + req.body);
        const _id = req.params.id;
        req.body._id = _id;
        super.putById(req, res);
    }
}

   
    
export default new bookController();