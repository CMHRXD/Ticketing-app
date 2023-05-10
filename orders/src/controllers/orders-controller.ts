import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@cmhrtools/common/build";
import { Request, Response } from "express";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { Order } from "../models/orders-model";
import { Ticket } from "../models/tickets-model";
import { natsClient } from "../nats-client";

const getOrders = async (req: Request, res: Response) => {
  // Get the current user
  const user = req.currentUser?.id;
  // If no user, throw an error
  if (!user) throw new BadRequestError("User not found");
  // Find all orders for this user
  const orders = await Order.find({ userId: user }).populate("ticket");
  // Send the orders back
  res.status(200).json(orders);
};

const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Find the order
  const order = await Order.findById(id).populate("ticket");
  // throws an error if the order does not exist
  if (!order) throw new NotFoundError();
  // throws an error if the order does not belong to the user
  if(order?.userId !== req.currentUser?.id) throw new NotAuthorizedError();
  // Send the order back
  res.status(200).json(order);
};

const createOrder = async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  // Find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);

  // If no ticket, throw an error
  if (!ticket) throw new NotFoundError();

  // If the ticket is already reserved, throw an error
  const existingOrder = await ticket.isReserved();
  if (existingOrder) throw new BadRequestError("Ticket is already reserved");

  // Calculate an expiration date for this order
  if (!process.env.EXPIRATION_WINDOW_SECONDS)
    throw new Error("EXPIRATION_WINDOW_SECONDS must be defined");
  const expiration = new Date();
  expiration.setSeconds(
    expiration.getMinutes() + Number(process.env.EXPIRATION_WINDOW_SECONDS)
  );
  // Build the order and save it to the database
  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket,
  });
  // Save the ticket
  await order.save();
  // Publish an event saying that an order was created
  new OrderCreatedPublisher(natsClient.client).publish({
    id: order.id,
    userId: order.userId,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    ticket:{
      id:ticket.id,
      price: ticket.price
    }
  })
  // returns the order
  res.status(201).json(order);

};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  // Find the order
  const order = await Order.findById(id).populate("ticket");
  // throws an error if the order does not exist
  if(!order) throw new NotFoundError();
  // throws an error if the order does not belong to the user
  if(req.currentUser?.id !== order?.userId) throw new NotAuthorizedError();
  // Mark the order as cancelled
  order.set({ status: OrderStatus.Cancelled });
  // Save the order
  await order.save();
  // Publish an event saying that an order was cancelled
  new OrderCancelledPublisher(natsClient.client).publish({
    id: order.id,
    version: order.version,
    ticket:{
      id: order.ticket.id
    }
  })
  // Send the order back
  res.status(204).json(order);
};

export { getOrders, getOrderById, createOrder, deleteOrder };
