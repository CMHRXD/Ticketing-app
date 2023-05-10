import { Message } from "node-nats-streaming";
import { Listener } from "@cmhrtools/common/build";
import { Subjects } from "@cmhrtools/common/build";
import { TicketCreatedEvent } from "@cmhrtools/common/build";

export class ticketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = "payment-service";

  onMessage(data: TicketCreatedEvent["data"], message: Message) {
    console.log("Event data: ", data);
    message.ack();
  }
}
