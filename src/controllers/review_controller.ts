import Review, { IReview } from "../models/review_model";
import {BaseConstroller} from "./base_controller";

class ReviewController extends BaseConstroller<IReview>{
    constructor(){
        super(Review)
    }
}

export default new ReviewController();
