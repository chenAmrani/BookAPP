import book_model, { IBook } from "../models/book_model";
import BaseController from "./base_controller";

const postBookController = new BaseController<IBook>(book_model);


export default postBookController;