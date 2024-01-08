import BookModel, { IBook } from "../models/book_model";
// import createController from "./base_controller";
import {BaseController} from "./base_controller";
import {Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class bookController extends BaseController<IBook> {
    constructor() {
        super(BookModel);
    }

    async post(req: AuthRequest, res: Response) {
        // console.log("bookpost:" + req.body);
        const _id = req.user._id;
        req.body.author = _id;
        //
        super.post(req, res);
        }

    async putById(req: AuthRequest, res: Response) {
        // console.log("updatebook:" + req.body);
        

            super.putById(req, res);
      
        // console.log("THE ID AUTHOR:" + req.body.author);
        // console.log("THE ID USER:" + req.user._id);
        
        
        
    }
}

   
    
export default new bookController();