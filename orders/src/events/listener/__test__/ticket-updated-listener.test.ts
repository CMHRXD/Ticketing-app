import { TicketUpdatedEvent } from "@cmhrtools/common/build";
import { natsClient } from "../../../nats-client";
import mongoose from "mongoose";
import { ticketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/tickets-model";

const setup = async () => {
  // create an instance of the listener
  const listener = new ticketUpdatedListener(natsClient.client);

  const ticket = await global.ticketBuild();
  // create a fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: ticket.title,
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

describe("Ticket Updated Listener", () => {
  it("finds, updates, and saves a ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);
    // get the ticket from the database
    const ticketUpdated = await Ticket.findById(ticket.id);
    // write assertions to make sure a ticket was created!
    expect(ticketUpdated).toBeDefined();
    expect(ticketUpdated?.price).toEqual(data.price);
    expect(ticketUpdated?.price).not.toEqual(ticket.price);
    expect(ticketUpdated?.title).toEqual(data.title);
  });

  it("acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });

  it("does not call ack if event version is out of order", async () => {
    const { listener, data, msg } = await setup();
    data.version = 10;

    try {
      await listener.onMessage(data, msg);
    } catch (error) {}

    expect(msg.ack).not.toHaveBeenCalled();
  });
});
