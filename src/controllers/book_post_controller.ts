import BookPostModel, { IBookPost } from "../models/book_post_model";
import createController from "./base_controller";

const bookPostController = createController<IBookPost>(BookPostModel);

export default bookPostController
