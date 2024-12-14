import { RequestHandler, Response, Request } from "express";
import { sendErrorResponse } from "@/utils/helper";
import stripe from "@/stripe";
import {
  StripeCustomer,
  StripeFailedIntent,
  StripeSuccessIntent,
} from "@/stripe/stripe";
import Order from "@/models/order-model";
import User from "@/models/user-model";
import Cart from "@/models/cart-model";

export const handlePayment: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event;

    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret);

    const succeed = event.type === "payment_intent.succeeded";
    const failed = event.type === "payment_intent.payment_failed";

    if (succeed || failed) {
      const stripeSession = event.data.object as unknown as
        | StripeSuccessIntent
        | StripeFailedIntent;

      const customerId = stripeSession.customer;

      const customer = (await stripe.customers.retrieve(
        customerId
      )) as unknown as StripeCustomer;
      const { orderId, type, userId } = customer.metadata;

      const order = await Order.findByIdAndUpdate(orderId, {
        stripeCustomerId: customerId,
        paymentId: stripeSession.id,
        totalAmount: stripeSession.amount_received,
        paymentStatus: stripeSession.status,
        paymentErrorMessage: stripeSession.last_payment_error?.message,
      });

      const bookIds =
        order?.orderItems.map((item) => {
          return item.id.toString();
        }) || [];

      if (succeed && order) {
        await User.findByIdAndUpdate(userId, {
          $push: { books: { $each: bookIds }, orders: { $each: [order._id] } },
        });

        if (type === "checkout") {
        await Cart.findOneAndUpdate({ userId }, { items: [] });
        }

      }
    }
  } catch (error) {
    console.log(error);
    return sendErrorResponse({
      res,
      status: 400,
      message: "Could not complete payment!",
    });
  }

  res.send();
};
