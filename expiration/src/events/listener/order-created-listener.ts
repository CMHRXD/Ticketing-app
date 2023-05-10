import { Listener, OrderCreatedEvent, Subjects } from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = "expiration-service";
  async onMessage(
    data: OrderCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    // Calculate an expiration date for this order
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("waiting this many seconds to process the job:", delay);
    // Add the job to the queue
    await expirationQueue.add({ orderId: data.id }, { delay: delay });
    // Ack the message
    msg.ack();
  }
}
