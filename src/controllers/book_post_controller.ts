import BookPost, { IBookPost } from "../models/book_post_model";
import {BaseConstroller} from "./base_controller";

class BookPostController extends BaseConstroller<IBookPost>{
    constructor(){
        super(BookPost)
    }
}

export default new BookPostController();
