import { Request, RequestHandler, Response } from "express";
import Order from "@/models/order-model";
import { BookDoc } from "@/models/book-model";
import { isValidObjectId } from "mongoose";
import User from "@/models/user-model";
import stripe from "@/stripe";
import { sendErrorResponse } from "@/utils/helper";
import { StripeCustomer } from "@/stripe/stripe";

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
              slug: book.slug,
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
) => {
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

export const getOrderSuccessStatus: RequestHandler = async (req, res) => {
  const { sessionId } = req.body;

  if (typeof sessionId !== "string")
    return sendErrorResponse({
      res,
      message: "Invalid session id!",
      status: 400,
    });

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const customerId = session.customer;

  let customer: StripeCustomer;

  if (typeof customerId === "string") {
    customer = (await stripe.customers.retrieve(
      customerId
    )) as unknown as StripeCustomer;

    const { orderId } = customer.metadata;
    const order = await Order.findById(orderId).populate<{
      orderItems: {
        id: BookDoc;
        price: number;
        qty: number;
        totalPrice: number;
      }[];
    }>("orderItems.id");

    if (!order)
      return sendErrorResponse({
        message: "Order not found!",
        status: 404,
        res,
      });

    const data = order.orderItems.map(
      ({ id: book, price, totalPrice, qty }) => {
        return {
          id: book._id,
          title: book.title,
          slug: book.slug,
          cover: book.cover?.url,
          price: (price / 100).toFixed(2),
          totalPrice: (totalPrice / 100).toFixed(2),
          qty,
        };
      }
    );

    res.json({
      orders: data,
      totalAmount: order.totalAmount
        ? (order.totalAmount / 100).toFixed(2)
        : "0",
    });
    return;
  }

  sendErrorResponse({
    message: "Something went wrong order not found!",
    status: 500,
    res,
  });
};
