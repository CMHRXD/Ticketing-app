import { ExpirationCompleteListener } from "../events/listener/expiration-complete-listener";
import { PaymentCreatedListener } from "../events/listener/payment-created-listener";
import { TicketCreatedListener } from "../events/listener/ticket-created-listener";
import { ticketUpdatedListener } from "../events/listener/ticket-updated-listener";
import { natsClient } from "../nats-client";

export const natsInitConnection = async () => {
  //Checks env variables are set
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.CLUSTER_ID) {
    throw new Error("CLUSTER_ID must be defined");
  }
  try {
    await natsClient.connect(
      process.env.CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    //event to close NATS
    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      natsInitConnection();
      process.exit();
    });

    process.on("SIGINT", () => natsClient.client.close()); // SIGINT is used by Node to terminate a process.
    process.on("SIGTERM", () => natsClient.client.close()); // SIGTERM is used by Kubernetes to terminate a pod.

    //NATS TicketCreated Listener
    new TicketCreatedListener(natsClient.client).listen();

    //NATS TicketUpdated Listener
    new ticketUpdatedListener(natsClient.client).listen();

    // NATS Expiration Listener
    new ExpirationCompleteListener(natsClient.client).listen();

    // NATS Payment Listener
    new PaymentCreatedListener(natsClient.client).listen();
  } catch (error) {
    console.log(error);
  }
};
