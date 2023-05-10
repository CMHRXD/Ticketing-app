import { randomBytes } from "crypto";
import nats from "node-nats-streaming";
import { ticketCreatedListener } from "./events/tickets-created-listener";
//Clear the console
console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  new ticketCreatedListener(stan).listen(); // listen to the ticket:created event.
});

process.on("SIGINT", () => stan.close()); // SIGINT is used by Node to terminate a process.
process.on("SIGTERM", () => stan.close()); // SIGTERM is used by Kubernetes to terminate a pod.
