
import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  _id?: string;
  image: string;
  refreshTokens?: string[];
  role: string;
  books?: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
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
  books:[
    {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
],
});

export const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;

// const user1: IUser = {
//   name: "chen",
//   email: "chen@gmail.com",
//   password: "1234",
//   image: "https://example.com/chen.jpg",
//   role: "author",
//   books: [('65be6059f98ce2d590f646c0') as unknown as typeof mongoose.Schema.Types.ObjectId, ('65be6059f98ce2d590f646c1') as unknown as typeof mongoose.Schema.Types.ObjectId,("65be6059f98ce2d590f646c2") as unknown as typeof mongoose.Schema.Types.ObjectId]
// }

// const user = [user1];
// UserModel.insertMany(user);