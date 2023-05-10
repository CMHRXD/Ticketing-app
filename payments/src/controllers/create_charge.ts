import { Request, Response } from "express";
import { Order } from "../models/order-model";
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@cmhrtools/common/build";
import { stripe } from "../stripe";
import { Payment } from "../models/payment-model";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsClient } from "../nats-client";

export const createCharge = async (req: Request, res: Response) => {
  const { token, orderId } = req.body;
  // find the order
  const order = await Order.findById(orderId);
  // if order is not found, throw an error
  if (!order) throw new NotFoundError();
  // if order is found, check if the order belongs to the current user
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
  // if order status is cancelled, throw an error
  if (order.status === OrderStatus.Cancelled) throw new BadRequestError("Cannot pay for a cancelled order");
  if (order.status === OrderStatus.Complete) throw new BadRequestError("Cannot pay for a completed order");

  // if all the above conditions are met, send a request to stripe to create a charge

  try {
    const charge = await stripe.charges.create({
      currency: "usd",
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsClient.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).json({ success: true });
  } catch (e: any) {
    switch (e.type) {
      case "StripeCardError":
        throw new BadRequestError(`A payment error occurred: ${e.message}`);
        break;
      case "StripeInvalidRequestError":
        throw new BadRequestError("An invalid request occurred.");
        break;
      default:
        throw new BadRequestError(
          "Another problem occurred, maybe unrelated to Stripe."
        );
        break;
    }
  }
};
