import { Subjects } from "@cmhrtools/common/build";
import { TicketCreatedEvent } from "@cmhrtools/common/build";
import { BasePublishier } from "@cmhrtools/common/build";

export class TicketCreatedPublisher extends BasePublishier <TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}