import { OrderCreatedEvent, OrderStatus } from "@cmhrtools/common/build";
import { natsClient } from "../../../nats-client";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from "mongoose";
import { Order } from "../../../models/order-model";

const setup = async () => {
  const Listener = new OrderCreatedListener(natsClient.client);

  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: "2021-01-01T00:00:00.000Z",
    ticket: {
      id: new mongoose.Types.ObjectId().toHexString(),
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

    return { Listener, data, msg };
};

describe("Order Created Listener in Payments", () => {

    it("replicates the order info and ack the message", async () => {
        const { Listener, data, msg } = await setup();

        await Listener.onMessage(data, msg);

        // Check that the order was created
        const order = await  Order.findById(data.id);
        expect(order).toBeDefined();
        // Check that the ack function was called
        expect(msg.ack).toHaveBeenCalled();
    });
});


