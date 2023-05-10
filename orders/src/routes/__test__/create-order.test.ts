import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Order } from "../../models/orders-model";
import { natsClient } from "../../nats-client";

describe("Create Order", () => {
  let cookie: string[];

  beforeAll(() => {
    cookie = global.signIn();
  });

  it("returns a status 400 if the ticket id is invalid", async () => {
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: "123" })
      .expect(400);
  });

  it("return a status 404 if the ticket does not exist", async () => {
    const ticketId = new mongoose.Types.ObjectId();
    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId })
      .expect(404);
  });

  it("return a status 400 if the ticket is already reserved", async () => {
    const ticket = await global.ticketBuild();
    await global.orderBuild(ticket);

    await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it("returns an error if the ticket expires", async () => {});

  it("returns a status 201 if create an order", async () => {
    const ticket = await global.ticketBuild();

    const res = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    const order = await Order.findOne({ ticket });
    expect(order).not.toBeNull();
  });

  it("Emits an order created event", async () => {
    const ticket = await global.ticketBuild();
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({
        ticketId: ticket.id,
      });

    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
