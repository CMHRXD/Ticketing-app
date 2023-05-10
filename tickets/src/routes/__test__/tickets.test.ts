import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { natsClient } from "../../nats-client";
import { Ticket } from "../../models/tickets-model";

let cookie: string[];
let mongoID: string;

describe("Tickets Routes Tests", () => {
  beforeAll(() => {
    cookie = global.signIn();
    mongoID = new mongoose.Types.ObjectId().toHexString();
  });

  //Creates Permision Checks
  it("has a route handler listening to /api/tickets for createTicket requests", async () => {
    const postReq = await request(app).post("/api/tickets").send({});
    expect(postReq.status).not.toEqual(404);
  });
  it("Can only access authenticated users", async () => {
    await request(app).post("/api/tickets").send({}).expect(401);
  });
  it("Return a status other than 401 if user is signed in", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({});

    expect(res.status).not.toEqual(401);
  });

  //Creates action
  it("Creates a ticket with invalid inputs", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "", price: "" });

    expect(res.status).toEqual(400);
  });
  it("Creates a ticket with valid inputs", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", cookie)
      .send({ title: "random", price: 20 });
    // console.log(res.body)
    expect(res.status).toEqual(201);
  });

  //Gets Actions
  it("Returns the ticket if exist", async () => {
    // Object created { title: "random", price: 20 }
    const { id } = await global.createTicket();
    const res = await request(app)
      .get(`/api/tickets/${id}`)
      .set("Cookie", cookie)
      .expect(200);

    expect(res.body.ticket.title).toEqual("random");
    expect(res.body.ticket.price).toEqual(20);
  });
  it("Returns a 404 if the ticket dont exist", async () => {
    const res = await request(app)
      .get(`/api/tickets/sadsfasdsad`)
      .set("Cookie", cookie);

    expect(res.status).toEqual(404);
  });
  it("Returns a list of tickets", async () => {
    await global.createTicket();
    await global.createTicket();
    const res = await request(app).get("/api/tickets").send({}).expect(200);

    expect(res.body.tickets.length).toEqual(2);
  });

  //Updates Actions
  it("Returns a 404 if provided id does not exist", async () => {
    await request(app)
      .put(`/api/tickets/${mongoID}`)
      .set("Cookie", cookie)
      .send({ title: "test", price: 20 })
      .expect(404);
  });
  it("Returns a 401 if user is not authenticated", async () => {
    await request(app)
      .put(`/api/tickets/${mongoID}`)
      .send({ title: "test", price: 20 })
      .expect(401);
  });
  it("Returns a 401 if user dont own the ticket", async () => {
    const ticket = await global.createTicket();

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", cookie)
      .send({ title: "test2", price: 20 })
      .expect(401);
  });
  it("Returns a 400 if user provided invalid inputs", async () => {
    const ticket = await global.createTicket();

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", ticket.cookie)
      .send({ title: "", price: 0 })
      .expect(400);
  });
  it("Returns an updated ticket", async () => {
    const ticket = await global.createTicket();

    const res = await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", ticket.cookie)
      .send({ title: "test2", price: 15 })
      .expect(200);
    expect(res.body.ticket.title).toEqual("test2");
    expect(res.body.ticket.title).toEqual("test2");
  });

  it("Publishes an event", async () => {
    const ticket = await global.createTicket();

    const res = await request(app)
      .post(`/api/tickets/`)
      .set("Cookie", ticket.cookie)
      .send({ title: "test2", price: 15 })
      .expect(201);

	expect(natsClient.client.publish).toHaveBeenCalled()
  });

  it("Rejects updates if the ticket is reserved", async () => {
    const ticket = await global.createTicket();
    const searchedTicket = await Ticket.findById(ticket.id);
    searchedTicket!.set({ orderId: mongoID });
    await searchedTicket!.save();

    await request(app)
      .put(`/api/tickets/${ticket.id}`)
      .set("Cookie", ticket.cookie)
      .send({ title: "test2", price: 200 })
      .expect(400);
  });
});
