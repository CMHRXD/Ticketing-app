import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order-model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "payments-service";

  async onMessage(data: OrderCancelledEvent["data"], msg: Message) {
    const order = await Order.findOne({ _id: data.id, version: data.version - 1 });
    // if order is not found, throw an error
    if (!order) throw new Error("Order not found");
    // if order is found, update the status to cancelled
    order.set({ status: OrderStatus.Cancelled });
    // save the order
    await order.save();
    // ack the message
    msg.ack();
  }
}
