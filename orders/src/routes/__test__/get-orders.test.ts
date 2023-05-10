import request from "supertest";
import { app } from "../../app";

describe("Get Orders by User Tests", () => {
  let cookie: string[];
  beforeAll(() => {
    cookie = global.signIn();
  });

  it("Returns an error if the user is not authenticated", async () => {
    await request(app).get("/api/orders").send().expect(401);
  });
  it("Returns all the orders for a particular user", async () => {
    const t1 = await global.ticketBuild();
    const t2 = await global.ticketBuild();
    const t3 = await global.ticketBuild();

    // User 1 starts
    const o1 = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: t1.id })
      .expect(201);
    const o2 = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie)
      .send({ ticketId: t2.id })
      .expect(201);
    // User 1 ends

    // User 2 starts
    const cookie2 = global.signIn();
    const o3 = await request(app)
      .post("/api/orders")
      .set("Cookie", cookie2)
      .send({ ticketId: t3.id })
      .expect(201);
    // User 2 ends

    const user_1_orders = await request(app)
      .get("/api/orders")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    const user_2_orders = await request(app)
      .get("/api/orders")
      .set("Cookie", cookie2)
      .send()
      .expect(200);

    expect(user_1_orders.body.length).toEqual(2);
    expect(user_2_orders.body.length).toEqual(1);
  });
});
