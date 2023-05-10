import {
  Listener,
  OrderCancelledEvent,
  Subjects,
} from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets-model";
import { TicketUpdatedPublisher } from "../publisher/tickets-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = "ticket-service";

  async onMessage(
    data: OrderCancelledEvent["data"],
    msg: Message
  ): Promise<void> {
    // find the ticket with the id of the ticket in the order created event
    const ticket = await Ticket.findById(data.ticket.id);
    // throw an error if the ticket is not found
    if (!ticket) throw new Error("Ticket not found");
    // set the order id of the ticket to the order id of the order created event
    ticket.set({ orderId: null });
    // save the ticket
    await ticket.save();
    // emit a ticket updated event
    new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        version: ticket.version,
        title: ticket.title as string,
        price: ticket.price,
        userId: ticket.userId as string,
        orderId: ticket.orderId as string
    });
    // ack the message
    msg.ack();
  }
}
