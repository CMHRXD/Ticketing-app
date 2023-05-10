import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/orders-model";
import { natsClient } from "../../nats-client";

describe("Delete Order by Id", () => {
  let cookie: string[];
  beforeAll(() => {
    cookie = global.signIn();
  });

  it("returns a status 400 if the order id is invalid", async () => {
    await request(app)
      .delete("/api/orders/123")
      .set("Cookie", cookie)
      .send()
      .expect(400);
  });
  it("Returns a status 401 if the user is not authenticated", async () => {
    await request(app).delete("/api/orders/1234").send().expect(401);
  });
  it("Returns a status 401 if the order dont belong to the user", async () => {
    const ticket = await global.ticketBuild();
    const order = await global.orderBuild(ticket);
    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .send()
      .expect(401);
  });
  it("Returns a status 404 if the order does not exist", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .delete(`/api/orders/${orderId}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });
  it("Return a status 204 if order exists and is deleted successfully", async () => {
    const ticket = await global.ticketBuild();
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set("Cookie", cookie)
      .expect(204);

    const cancelledOrder = await Order.findById(order.id);
    expect(cancelledOrder!.status).toEqual("cancelled");
  });

  it("Emits an event when deletes an order", async () => {
    const ticket = await global.ticketBuild();
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({
        ticketId: ticket.id,
      });
    await request(app).delete(`/api/orders/${order.id}`).set("Cookie", cookie);
    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
