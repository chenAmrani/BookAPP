import Review, { IReview } from "../models/review_model";
import {BaseController} from "./base_controller";
import {Response } from "express";
import { AuthRequest } from "../common/auth_middleware";

class ReviewController extends BaseController<IReview> {
    constructor() {
        super(Review);
    }

    async post(req: AuthRequest, res: Response) {
        console.log("review:" + req.body);
        const _id = req.user._id;
        req.body.owner = _id;
        super.post(req, res);
        }
    }
    
export default new ReviewController();
