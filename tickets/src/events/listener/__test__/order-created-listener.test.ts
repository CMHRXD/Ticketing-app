import mongoose from "mongoose";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEvent, OrderStatus } from "@cmhrtools/common/build";
import { Ticket } from "../../../models/tickets-model";

const setup = async () => {
    const listener = new OrderCreatedListener(natsClient.client);
    const ticket = await global.createTicket();
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket:{
            id: ticket.id as string,
            price: ticket.price as number
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
};

describe("Order Created Listener", () => {
  it("sets the userId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    // Listener is a function that returns a promise
    await listener.onMessage(data, msg);
    // Find the ticket that was updated
    const ticketUpdated = await Ticket.findById(ticket.id);
    // Check if the ticket has the userId
    expect(ticketUpdated?.orderId).toEqual(data.id);
  });
  it("acks the message", async () => {
    const { listener, ticket, data, msg } = await setup();
    // Listener is a function that returns a promise
    await listener.onMessage(data, msg);
    // Check if the ack function was called
    expect(msg.ack).toHaveBeenCalled();
  });

  it("publishes a ticket updated event", async () => {
    const { listener, ticket, data, msg } = await setup();
    // Listener is a function that returns a promise
    await listener.onMessage(data, msg);

    // access the first argument of the first call of the mock function which contains the data
    const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[1][1]);

    // Check if the ack function was called
    expect(natsClient.client.publish).toHaveBeenCalled();

    // Check if the data is the same as the data sent
    expect(ticketUpdatedData.orderId).toEqual(data.id);
  });
});
