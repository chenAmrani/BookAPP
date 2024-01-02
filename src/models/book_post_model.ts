import mongoose from "mongoose";

export interface IBookPost {
  name: string;
  date: Date;
  text: string;
  owner:string;
  // bookId: typeof mongoose.Schema.Types.ObjectId;
}

const bookPostSchema = new mongoose.Schema<IBookPost>({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  // bookId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Book",
  // },
});

export default mongoose.model<IBookPost>("BookPost", bookPostSchema);
