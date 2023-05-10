import { BasePublishier, ExpirationCompleteEvent, Subjects } from "@cmhrtools/common/build";

export class ExpirationCompletePublisher extends BasePublishier<ExpirationCompleteEvent> {
   readonly subject = Subjects.ExpirationComplete;
}