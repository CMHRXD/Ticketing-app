import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders-model";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = "orders-service";
  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
