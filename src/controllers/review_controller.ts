import Review, { IReview } from "../models/review_model";
import {BaseConstroller} from "./base_controller";

class BookPostController extends BaseConstroller<IReview>{
    constructor(){
        super(Review)
    }
}

export default new BookPostController();
