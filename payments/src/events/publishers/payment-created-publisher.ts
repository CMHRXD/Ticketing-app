import { BasePublishier, PaymentCreatedEvent, Subjects } from "@cmhrtools/common/build";

export class PaymentCreatedPublisher extends BasePublishier<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}