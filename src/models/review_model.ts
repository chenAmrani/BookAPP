//check
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
    default: () => new Date(),
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

export const ReviewModel = mongoose.model<IReview>("Review", reviewSchema);
export default ReviewModel;

// const review1: IReview = {
//   BookName: "Book1",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ec" as unknown as typeof mongoose.Schema.Types.ObjectId,
// };

// const review2: IReview = {
//   BookName: "Book2",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ed" as unknown as typeof mongoose.Schema.Types.ObjectId
// };

// const review3: IReview = {
//   BookName: "Book3",
//   date: now(),
//   text: "Good book!!",
//   owner: "65a6b6822338056d8466021e",
//   bookId: "65a6bd9d1fa5155f596ae0ee" as unknown as typeof mongoose.Schema.Types.ObjectId
// };

// const reviews = [review1, review2, review3];

// ReviewModel.insertMany(reviews);
