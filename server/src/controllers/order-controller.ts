import { RequestHandler } from "express";
import { handleError, sendErrorResponse } from "@/utils/helper";
import OrderModel from "@/models/order-model";
import { BookDoc } from "@/models/book-model";
import { isValidObjectId } from "mongoose";
import UserModel from "@/models/user-model";
import { StripeCustomer } from "@/types/stripe";
import stripe from "@/stripe";

export const getOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await OrderModel.find({ userId: req.user.id })
      .populate<{
        orderItems: {
          id: BookDoc;
          price: number;
          qty: number;
          totalPrice: number;
        }[];
      }>("orderItems.id")
      .sort("-createdAt");

    res.status(200).json({
      success: true,
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
  } catch (error) {
    handleError(error, res);
  }
};

export const getOrderStatus: RequestHandler = async (req, res) => {
  try {
    const { bookId } = req.params;

    let status = false;

    if (!isValidObjectId(bookId)) {
      res.status(200).json({ success: true, data: status });
      return;
    }

    const user = await UserModel.findOne({ _id: req.user.id, books: bookId });
    if (user) status = true;

    res.status(200).json({ success: true, data: status });
  } catch (e) {
    handleError(e, res);
  }
};

export const getOrderSuccessStatus: RequestHandler = async (req, res) => {
  try {
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
      const order = await OrderModel.findById(orderId).populate<{
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
        data: {
          orders: data,
          totalAmount: order.totalAmount
            ? (order.totalAmount / 100).toFixed(2)
            : "0",
        },
        success: true,
      });
    } else {
      sendErrorResponse({
        message: "Something went wrong order not found!",
        status: 500,
        res,
      });
    }
  } catch (error) {
    handleError(error, res);
  }
};
