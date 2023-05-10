import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders-model";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName = "order-service";
    async onMessage(data: ExpirationCompleteEvent["data"], msg: Message): Promise<void> {

        const order = await Order.findById(data.orderId).populate("ticket");
        // If the order is not found, throw an error
        if (!order) throw new Error("Order not found");
        // If the order is already complete, do not cancel it
        if (order.status === OrderStatus.Complete) return msg.ack();
        // Mark the order as cancelled
        order.set({ status: OrderStatus.Cancelled });
        // Save the order
        await order.save(); 
        // Publish an event saying that an order was cancelled
        new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}