import mongoose from "mongoose";

export interface IBook {
  name: string;
  year: number;
  image: string;
  pages: number;
  price: number;
  rating: number;
  author: string;
  category: string;
  summary: string;
  reviews: typeof mongoose.Schema.Types.ObjectId;
}

const bookSchema = new mongoose.Schema<IBook>({
  name: {
    type: String,
    required: true,
  },
  year:{
    type: Number,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  pages: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true
  },
  rating:{
    type: Number,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
  },
    summary:{
        type: String,
        required: true
    },
    reviews:[
        {
          type:mongoose.Schema.Types.ObjectId,
          ref:"Review"
        }
    ]

});

export default mongoose.model<IBook>("Book", bookSchema);
