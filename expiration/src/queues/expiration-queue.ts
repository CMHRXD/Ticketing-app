import Queue from "bull";
import { natsClient } from "../nats-client";
import { ExpirationCompletePublisher } from "../events/publisher/expiration-complete-publisher";

interface payload {
    orderId: string;
} 

export const expirationQueue = new Queue<payload>("order:expiration", {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job) => {
    new ExpirationCompletePublisher(natsClient.client).publish({
        orderId: job.data.orderId
    });
})