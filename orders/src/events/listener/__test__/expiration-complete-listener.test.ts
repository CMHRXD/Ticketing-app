import { ExpirationCompleteEvent, OrderStatus } from "@cmhrtools/common/build";
import { natsClient } from "../../../nats-client";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Order } from "../../../models/orders-model";

const setup = async () => {
  // create an instance of the listener
  const listener = new ExpirationCompleteListener(natsClient.client);
  // create a ticket
  const ticket = await global.ticketBuild();
  const order = await global.orderBuild(ticket);

  // create a fake data event
  const data: ExpirationCompleteEvent["data"] = {
    orderId: order.id,
  };
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

describe("Expiration Complete Listener", () => {
  it("updates the order status to cancelled", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    // find the order
    const updatedOrder = await Order.findById(order.id);
    // check if the order status is cancelled
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });
  it("emits an OrderCancelled event", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const eventSubject = (natsClient.client.publish as jest.Mock).mock
      .calls[1][0];
    const eventData = JSON.parse(
      (natsClient.client.publish as jest.Mock).mock.calls[1][1]
    );

    // Expect the nats client to have published an order cancelled event
    expect(natsClient.client.publish).toHaveBeenCalled();
    // Expect the subject to be order:cancelled
    expect(eventSubject).toEqual("order:cancelled");
    // Expect the data to be the order id
    expect(eventData.id).toEqual(order.id);

  });
  it("acks the message", async () => {
    const { listener, ticket, order, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });
});
