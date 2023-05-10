import { OrderCancelledEvent, OrderCreatedEvent, OrderStatus } from "@cmhrtools/common/build";
import { natsClient } from "../../../nats-client";
import mongoose from "mongoose";
import { Ticket } from "../../../models/tickets-model";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsClient.client);
    const ticket = await global.createTicket();
    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket:{
            id: ticket.id as string,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg }
};
describe("Order Cancelled Listener", () => {

    it ("updates the ticket, publishes an event, and acks the message", async () => {
        const { listener, ticket, data, msg } = await setup();
        // Listener is a function that returns a promise
        await listener.onMessage(data, msg);
        // Find the ticket that was updated
        const ticketUpdated = await Ticket.findById(ticket.id);
        // Check if the ticket has the userId
        expect(ticketUpdated?.orderId).toEqual(null);
        // Check if the ack function was called
        expect(msg.ack).toHaveBeenCalled();
        // access the first argument of the second call of the mock function which contains the updated data
        const ticketUpdatedData = JSON.parse((natsClient.client.publish as jest.Mock).mock.calls[1][1]);
        console.log(ticketUpdatedData);
        // Check if the ack function was called
        expect(natsClient.client.publish).toHaveBeenCalled();
        // Check if the data is the same as the data sent
        expect(ticketUpdatedData.orderId).toEqual(null);
    });
});