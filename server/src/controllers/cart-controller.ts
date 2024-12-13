import { Request, RequestHandler, Response } from "express";
import { CartRequestHandler } from "@/types";
import Cart from "@/models/cart-model";
import { sendErrorResponse } from "@/utils/helper";
import { ObjectId } from "mongoose";

export const updateCart: CartRequestHandler = async (req:Request, res:Response) => {
};

export const getCart: RequestHandler = async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ userId: req.user.id }).populate<{
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
  });
};

export  const clearCart: RequestHandler = async (req: Request, res: Response) => {
  await  Cart.findOneAndUpdate({userId: req.user.id}, {items: []})

  res.json({success: true, message: "Cart cleared!"})
}