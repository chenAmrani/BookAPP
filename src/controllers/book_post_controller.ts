import book_model, { IBookPost } from "../models/book_post_model";
import BaseController from "./base_controller";

const postBookController = new BaseController<IBookPost>(book_model);


export default postBookController;