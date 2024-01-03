import mongoose from "mongoose";

export interface IOrder {

  user: typeof mongoose.Schema.Types.ObjectId,
  books: typeof mongoose.Schema.Types.ObjectId[];
  orderNumber: number;
  orderDate: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    books: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        },
    ],
    orderNumber: {
        type: Number,
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model<IOrder>("Order", orderSchema);
