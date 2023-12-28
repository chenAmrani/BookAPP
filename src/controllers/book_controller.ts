import BookModel, { IBook } from "../models/book_model";
import createController from "./base_controller";

const studentController = createController<IBook>(BookModel);

export default studentController
