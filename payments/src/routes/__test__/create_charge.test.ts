import { OrderStatus } from "@cmhrtools/common/build";
import { Order } from "../../models/order-model";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Payment } from "../../models/payment-model";
import { stripe } from "../../stripe";

describe("POST /charges", () => {
  it("returns a 401 if the user is not authenticated", async () => {
    await request(app)
      .post("/api/payments")
      .send({
        token: "asdf",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(401);
  });
  it("returns a 404 if the order does not exist", async () => {
    const id = new mongoose.Types.ObjectId();
    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signIn(id))
      .send({
        token: "asdf",
        orderId: new mongoose.Types.ObjectId().toHexString(),
      })
      .expect(404);
  });
  it("returns a 401 if the order does not belong to the user", async () => {
    const id = new mongoose.Types.ObjectId();
    const order = await global.orderBuild({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      status: OrderStatus.Created,
    });

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signIn(id))
      .send({ token: "asdf", orderId: order.id })
      .expect(401);
  });
  it("returns a 400 if the order is cancelled", async () => {
    const userId = new mongoose.Types.ObjectId();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: userId.toHexString(),
      price: 20,
      status: OrderStatus.Cancelled,
    });

    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signIn(userId))
      .send({ token: "asdf", orderId: order.id })
      .expect(400);
  });

  it("returns a 201 with valid inputs", async () => {
    const userId = new mongoose.Types.ObjectId();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      userId: userId.toHexString(),
      price: 50,
      status: OrderStatus.Created,
    });

    await order.save();

    await request(app)
      .post("/api/payments")
      .set("Cookie", global.signIn(userId))
      .send({ token: "tok_visa", orderId: order.id })
      .expect(201);

    const charges = await stripe.charges.list({ limit: 100} )
    const charge = charges.data.find(charge => charge.amount === order.price * 100)
    expect(charge).toBeDefined();
    expect(charge!.currency).toEqual('usd');
    expect(charge!.amount).toEqual(order.price * 100);
    expect(charge!.status).toEqual('succeeded');

    const payment = await Payment.findOne({
      orderId: order.id,
      stripeId: charge!.id
    })

    expect(payment).not.toBeNull();
  });
});
