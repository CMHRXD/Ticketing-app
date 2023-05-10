import { BasePublishier, OrderCancelledEvent, Subjects } from "@cmhrtools/common/build";

export class OrderCancelledPublisher extends BasePublishier<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}