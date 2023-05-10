import {
  Listener,
  Subjects,
  TicketCreatedEvent,
} from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets-model";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "order-service";
  async onMessage(
    data: TicketCreatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
