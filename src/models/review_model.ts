import mongoose from "mongoose";

export interface IReview {
  BookName: string;
  date: Date;
  text: string;
  owner:string;
  bookId: typeof mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new mongoose.Schema<IReview>({
  BookName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  text: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
});

export default mongoose.model<IReview>("Review", reviewSchema);
