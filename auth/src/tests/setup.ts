// creates an instance of mongoDb in memory
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";

declare global {
    function signUp(): Promise<string[]>;
    function signIn(): Promise<string[]>;
}

let mongo: any;

beforeAll(async () => {
    process.env.JWT_SECRET = "secret";
    mongo = MongoMemoryServer.create(); // creates an instance of mongoDb in memory

    const mongoUri = (await mongo).getUri(); // gets the uri of the instance of mongoDb in memory

    await mongoose.connect(mongoUri, {}); // connects to the instance of mongoDb in memory
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    (await mongo).stop();
    await mongoose.connection.close();
});

global.signUp = async () => {
    const res = await request(app)
        .post("/api/users/sign-up")
        .send({
            email: "test@test.com",
            password: "password",
        })
        .expect(201);

    return res.get("Set-Cookie");
};

global.signIn = async () => {
    const res = await request(app)
        .post("/api/users/sign-up")
        .send()
        .expect(201);

    return res.get("Set-Cookie");
};
