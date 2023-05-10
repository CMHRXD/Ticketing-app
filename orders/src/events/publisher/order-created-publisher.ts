import { BasePublishier, Subjects, OrderCreatedEvent } from "@cmhrtools/common/build";

export class OrderCreatedPublisher extends BasePublishier<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
}