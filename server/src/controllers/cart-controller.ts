import { handleError, sendErrorResponse } from "@/utils/helper";
import { CartRequestHandler } from "@/types";
import CartModel from "@/models/cart-model";
import { RequestHandler } from "express";
import { ObjectId } from "mongoose";

export const updateCart: CartRequestHandler = async (req, res) => {
  try {
    const { items } = req.body;

    let cart = await CartModel.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await CartModel.create({
        userId: req.user.id,
        items,
      });
    } else {
      // 	it means we are updating the cart
      for (const item of items) {
        const oldProduct = cart.items.find(
          ({ product }) => item.product === product.toString()
        );

        if (oldProduct) {
          oldProduct.quantity += item.quantity;
          // if quantity is 0 or less then zero remove product from the cart
          if (oldProduct.quantity <= 0) {
            cart.items = cart.items.filter(
              ({ product }) => oldProduct.product !== product
            );
          }
        } else {
          cart.items.push({
            product: item.product as any,
            quantity: item.quantity,
          });
        }
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: { cart: cart._id },
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const getCart: RequestHandler = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user.id }).populate<{
      items: {
        quantity: number;
        product: {
          _id: ObjectId;
          title: string;
          slug: string;
          cover?: { url: string; id: string };
          price: { mrp: number; sale: number };
        };
      }[];
    }>({
      path: "items.product",
      select: "title price slug cover price",
    });

    if (!cart) {
      return sendErrorResponse({
        res,
        status: 404,
        message: "Cart not found",
      });
    }

    res.json({
      data: {
        id: cart._id,
        items: cart.items.map((item) => ({
          product: {
            id: item.product._id,
            title: item.product.title,
            cover: item.product.cover?.url,
            slug: item.product.slug,
            price: {
              mrp: (item.product.price.mrp / 100).toFixed(2),
              sale: (item.product.price.sale / 100).toFixed(2),
            },
          },
          quantity: item.quantity,
        })),
      },
      success: true,
    });
  } catch (error) {
    handleError(error, res);
  }
};

export const clearCart: RequestHandler = async (req, res) => {
  try {
    await CartModel.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    res.status(200).json({ success: true, message: "Cart cleared!" });
  } catch (error) {
    handleError(error, res);
  }
};
