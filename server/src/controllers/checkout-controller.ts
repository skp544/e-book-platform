import { RequestHandler } from "express";
import { handleError, sanitizeUrl, sendErrorResponse } from "@/utils/helper";
import { isValidObjectId } from "mongoose";
import CartModel from "@/models/cart-model";
import BookModel, { BookDoc } from "@/models/book-model";
import stripe from "@/stripe";
import OrderModel from "@/models/order-model";
import { options, StripeLineItems } from "@/types";

const generateStripeCheckoutSession = async (options: options) => {
  const customer = await stripe.customers.create(options.customer);

  return await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: process.env.PAYMENT_SUCCESS_URL,
    cancel_url: process.env.PAYMENT_CANCEL_URL,
    line_items: options.line_items,
    customer: customer.id,
  });
};

export const checkout: RequestHandler = async (req, res) => {
  try {
    const { cartId } = req.body;

    if (!isValidObjectId(cartId)) {
      return sendErrorResponse({
        res,
        message: "Invalid cart id",
        status: 400,
      });
    }

    const cart = await CartModel.findOne({
      userId: req.user.id,
      _id: cartId,
    }).populate<{
      items: { product: BookDoc; quantity: number }[];
    }>({ path: "items.product" });

    if (!cart) {
      return sendErrorResponse({
        res,
        message: "Cart not found!",
        status: 404,
      });
    }

    const newOrder = await OrderModel.create({
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

    const customer = {
      name: req.user.name,
      email: req.user.email,
      metadata: {
        userId: req.user.id,
        orderId: newOrder._id.toString(),
        type: "checkout",
      },
    };

    const line_items = cart.items.map(({ product, quantity }) => {
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
    });

    const session = await generateStripeCheckoutSession({
      customer,
      line_items,
    });

    if (session.url) {
      res.json({ success: true, checkoutUrl: session.url });
    } else {
      sendErrorResponse({
        res,
        message: "Something went wrong! Could not handle payment!",
        status: 500,
      });
    }
  } catch (e) {
    handleError(e, res);
  }
};

export const instantCheckout: RequestHandler = async (req: any, res: any) => {
  try {
    const { productId } = req.body;

    if (!isValidObjectId(productId)) {
      return sendErrorResponse({
        res,
        status: 401,
        message: "Invalid product id",
      });
    }

    const product = await BookModel.findById(productId);

    if (!product) {
      return sendErrorResponse({
        res,
        status: 404,
        message: "Product not found!",
      });
    }

    const newOrder = await OrderModel.create({
      userId: req.user.id,
      orderItems: [
        {
          id: product._id,
          price: product.price.sale,
          qty: 1,
          totalPrice: product.price.sale,
        },
      ],
    });

    const customer = {
      name: req.user.name,
      email: req.user.email,
      metadata: {
        userId: req.user.id,
        orderId: newOrder._id.toString(),
        type: "instant-checkout",
      },
    };

    const images = product.cover
      ? { images: [sanitizeUrl(product.cover.url)] }
      : {};

    const line_items: StripeLineItems = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: product.price.sale,
          product_data: {
            name: product.title,
            ...images,
          },
        },
      },
    ];

    const session = await generateStripeCheckoutSession({
      customer,
      line_items,
    });

    if (session.url) {
      res.json({ success: true, checkoutUrl: session.url });
    } else {
      return sendErrorResponse({
        res,
        status: 500,
        message: "Something went wrong!",
      });
    }
  } catch (e) {
    handleError(e, res);
  }
};
