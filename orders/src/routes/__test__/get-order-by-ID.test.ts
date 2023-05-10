import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

describe("Get Order by Id", () => {
  let cookie: string[];
  beforeAll(() => {
    cookie = global.signIn();
  });
  it("returns a status 400 if the order id is invalid", async () => {
    await request(app)
      .get("/api/orders/123")
      .set("Cookie", cookie)
      .send()
      .expect(400);
  });
  it("Returns a status 401 if the user is not authenticated", async () => {
    await request(app).get("/api/orders").send().expect(401);
  });
  it("Returns a status 401 if the order dont belong to the user", async () => {
    const ticket  = await global.ticketBuild();
    const order = await global.orderBuild(ticket);
    await request(app).get(`/api/orders/${order.id}`).set("Cookie", cookie).send().expect(401);
  });
  it("Returns a status 404 if the order does not exist", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .get(`/api/orders/${orderId}`)
      .set("Cookie", cookie)
      .send()
      .expect(404);
  });
  it("Return a status 200 if order exists", async () => {
    const ticket  = await global.ticketBuild();
    const { body:order } = await request(app)
        .post("/api/orders")
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201);

    const res = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie", cookie)
        .expect(200);
    expect(res.body.id).toEqual(order.id);
  });
});
