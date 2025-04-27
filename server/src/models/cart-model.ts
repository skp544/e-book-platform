import { Model, model, ObjectId, Schema } from "mongoose";

interface CartItem {
  product: ObjectId;
  quantity: number;
}

interface CartDoc {
  userId: ObjectId;
  items: CartItem[];
}

const cartSchema = new Schema<CartDoc>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

const CartModel = model<CartDoc>("Cart", cartSchema);

export default CartModel as Model<CartDoc>;
