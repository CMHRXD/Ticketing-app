import { OrderCancelledListener } from "../events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "../events/listeners/order-created-listener";
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
    await natsClient.connect(process.env.CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    //event to close NATS
    natsClient.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });
    process.on("SIGINT", () => natsClient.client.close()); // SIGINT is used by Node to terminate a process.
    process.on("SIGTERM", () => natsClient.client.close()); // SIGTERM is used by Kubernetes to terminate a pod.

    //NATS Order - Created Listener
    new OrderCreatedListener(natsClient.client).listen();
    //NATS Order - Cancelled Listener
    new OrderCancelledListener(natsClient.client).listen();
    
  } catch (error) {
    console.log(error);
  }
};
