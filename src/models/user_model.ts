import mongoose from "mongoose";


export interface IUser {
  email: string;
  password: string;
  _id?: string;
  image?: string;
  refreshTokens?: string[];
  role: string;
  books?: typeof mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  image: {
    type: String,
    required: false,
  },
  refreshTokens: {
    type: [String],
    required: false,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'author', 'reader'], // Enumerate the roles
    default: 'reader', // Default role for new users
  },
  books:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Book"
  }]
});

export default mongoose.model<IUser>("User", userSchema);