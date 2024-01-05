           
import mongoose, { Schema, Document } from "mongoose";


export interface IRecommendation extends Document {
  user: string; 
  book: string; 
  comment: string;
  rating: number;
  photo: string;
  createdAt: Date;
}


const recommendationSchema: Schema = new mongoose.Schema({
  user: {
        type: Schema.Types.ObjectId,
        ref: "User", required: true 
    },
  book: { 
        type: Schema.Types.ObjectId, 
        ref: "Book", required: true },
  comment: {
        type: String, 
        required: true },
  rating: { 
        type: Number, 
        required: true },
  photo: { 
        type: String, 
        required: true },
  createdAt: { 
    type: Date, 
    default: Date.now }
});


const Recommendation = mongoose.model<IRecommendation>("Recommendation", recommendationSchema);
export default Recommendation;
