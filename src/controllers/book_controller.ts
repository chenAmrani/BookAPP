import book_model, { IBook } from "../models/book_model";
import BaseController from "./base_controller";

const bookController = new BaseController<IBook>(book_model);


export default bookController;