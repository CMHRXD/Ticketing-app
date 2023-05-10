// creates an instance of mongoDb in memory
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import request from "supertest";
import { jwtGenerator } from "@cmhrtools/common/build";

interface TicketObj {
	id: String;
	price: Number;
	title: String;
	cookie: string[];
}

declare global {
	function signUp(): Promise<string[]>;
	function signIn(): string[];
	function createTicket(): Promise<TicketObj>;
}

//Implementing mock functions
jest.mock("../nats-client.ts");

//Instantiating the mongoDb in memory
let mongo: any;

beforeAll(async () => {
	process.env.JWT_SECRET = "secret";
	mongo = MongoMemoryServer.create(); // creates an instance of mongoDb in memory

	const mongoUri = (await mongo).getUri(); // gets the uri of the instance of mongoDb in memory

	await mongoose.connect(mongoUri, {}); // connects to the instance of mongoDb in memory

});

beforeEach(async () => {
	jest.clearAllMocks();
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

global.signIn = () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	//Build the payload
	const payload = {
		id,
		email: "test@test.com",
	};
	//Create the JWT
	const token = jwtGenerator(payload.id, payload.email);
	//Build a session object with the token
	const session = { token: token };
	//Turn the session into JSON
	const sessionJSON = JSON.stringify(session);
	//Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");
	//return a string thats the cookie with the encoded data
	return [`session=${base64}; path=/; httponly`];
};

global.createTicket = async () => {
	const cookie = global.signIn();
	const res = await request(app)
		.post("/api/tickets")
		.set("Cookie", cookie)
		.send({ title: "random", price: 20 });

	res.body.cookie = cookie;
	return res.body;
};
