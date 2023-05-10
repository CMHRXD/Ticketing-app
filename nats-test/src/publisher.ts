import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/tickets-created-publisher";

//Clear the console
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publicher connected to NATS");
  const ticketPublisher = new TicketCreatedPublisher(stan);
  try {
    await ticketPublisher.publish({
      id: "1234",
      title: "concert",
      price: 20,

    });
  } catch (error) {
    console.error(error);
  }
});
