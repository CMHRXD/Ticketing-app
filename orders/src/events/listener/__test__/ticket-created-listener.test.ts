import { TicketCreatedEvent } from "@cmhrtools/common/build";
import { natsClient } from "../../../nats-client";
import { TicketCreatedListener } from "../ticket-created-listener";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/tickets-model";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsClient.client);

  // create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};
describe("Ticket Created Listener", () => {
    it("creates and saves a ticket", async () => {
        // call the onMessage function with the data object + message object
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);
        // write assertions to make sure a ticket was created!
        const ticket = await Ticket.findById(data.id);
        expect(ticket).toBeDefined();
        expect(ticket?.title).toEqual(data.title);
        expect(ticket?.price).toEqual(data.price);
    });
    
    it(" acks the message", async () => {
        const { listener, data, msg } = await setup();
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled();
    });    
});
