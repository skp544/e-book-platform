import { Request, Response, RequestHandler } from "express";
import { isValidObjectId } from "mongoose";
import { sanitizeUrl, sendErrorResponse } from "@/utils/helper";
import Cart from "@/models/cart-model";
import { BookDoc } from "@/models/book-model";
import * as process from "node:process";
import stripe from "@/stripe";
import Order from "@/models/order-model";

export const checkout: RequestHandler = async (req: Request, res: Response) => {
  const { cartId } = req.body;

  if (!isValidObjectId(cartId)) {
    return sendErrorResponse({ res, status: 401, message: "Invalid cart id" });
  }

  const cart = await Cart.findOne({
    _id: cartId,
    userId: req.user.id,
  }).populate<{
    items: { product: BookDoc; quantity: number }[];
  }>({ path: "items.product" });

  if (!cart) {
    return sendErrorResponse({ res, status: 404, message: "Cart not found" });
  }

  const newOrder = await Order.create({
    userId: req.user.id,
    orderItems: cart.items.map(({ product, quantity }) => {
      return {
        id: product._id,
        price: product.price.sale,
        qty: quantity,
        totalPrice: product.price.sale * quantity,
      };
    }),
  });

  const customer = await stripe.customers.create({
    name: req.user.name,
    email: req.user.email,
    metadata: {
      userId: req.user.id,
      orderId: newOrder._id.toString(),
      type: "checkout",
    },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: process.env.PAYMENT_SUCCESS_URL,
    cancel_url: process.env.PAYMENT_CANCEL_URL,
    line_items: cart.items.map(({ product, quantity }) => {
      const images = product.cover
        ? { images: [sanitizeUrl(product.cover.url)] }
        : {};

      return {
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.price.sale,
          product_data: {
            name: product.title,
            ...images,
          },
        },
      };
    }),
    customer: customer.id,
  });

  if (session.url) {
    res.json({ checkoutUrl: session.url });
  } else {
    return sendErrorResponse({
      res,
      status: 500,
      message: "Something went wrong!",
    });
  }
};