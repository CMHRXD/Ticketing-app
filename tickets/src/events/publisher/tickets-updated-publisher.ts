import { BasePublishier, Subjects, TicketUpdatedEvent } from "@cmhrtools/common/build";

export class TicketUpdatedPublisher extends BasePublishier<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}