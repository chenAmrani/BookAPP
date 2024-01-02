import BookModel, { IBook } from "../models/book_model";
import createController from "./base_controller";

const bookController = createController<IBook>(BookModel);

export default bookController
