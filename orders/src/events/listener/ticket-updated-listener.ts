import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from "@cmhrtools/common/build";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets-model";

export class ticketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = "order-service";
  async onMessage(
    data: TicketUpdatedEvent["data"],
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;
    const ticket = await Ticket.getPreviousVersion({id, version})

    if (!ticket) throw new NotFoundError();

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
