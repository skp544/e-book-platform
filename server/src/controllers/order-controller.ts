import { Request, RequestHandler, Response } from "express";
import Order from "@/models/order-model";
import { BookDoc } from "@/models/book-model";
import { isValidObjectId } from "mongoose";
import User from "@/models/user-model";

export const getOrders: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const orders = await Order.find({ userId: req.user.id }).populate<{
    orderItems: {
      id: BookDoc;
      price: number;
      qty: number;
      totalPrice: number;
    }[];
  }>("orderItems.id");

  res.json({
    data: orders.map((item) => {
      return {
        id: item._id,
        stripeCustomerId: item.stripeCustomerId,
        paymentId: item.paymentId,
        totalAmount: item.totalAmount
          ? (item.totalAmount / 100).toFixed(2)
          : "0",
        paymentStatus: item.paymentStatus,
        date: item.createdAt,
        orderItem: item.orderItems.map(
          ({ id: book, price, qty, totalPrice }) => {
            return {
              id: book._id,
              title: book.title,
              cover: book.cover?.url,
              price: (price / 100).toFixed(2),
              qty,
              totalPrice: (totalPrice / 100).toFixed(2),
            };
          }
        ),
      };
    }),
  });
};

export const getOrderStatus: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { bookId } = req.params;

  let status = false;

  if (!isValidObjectId(bookId)) {
    res.json({ status });
    return;
  }

  const user = await User.findOne({ _id: req.user.id, books: bookId });
  if (user) status = true;

  res.json({ status });
};
