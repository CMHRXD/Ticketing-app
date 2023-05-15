import request from "supertest";
import { app } from "../../app";
import { currentUser } from "../../controllers/auth-controller";

// User test
const user = {
    email: "test@test.com",
    password: "password",
};

interface currentUser  {
    id: String,
    email: String,
    iat: Number,
    exp: Number,
}

// Sign up tests
describe("Sign Up Tests", () => {
    it("return a 201 on successful sign-up", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
    });

    it("sets cookie after successful sign-up", async () => {
        const res = await request(app)
            .post("/api/users/sign-up")
            .send(user)
            .expect(201);
        expect(res.get("Set-Cookie")).toBeDefined();
    });

    it("return a 400 with a duplicate email", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
        await request(app).post("/api/users/sign-up").send(user).expect(400);
    });

    it("return a 400 with an invalid email", async () => {
        await request(app)
            .post("/api/users/sign-up")
            .send({
                email: "testtest.com",
                password: "password",
            })
            .expect(400);
    });

    it("return a 400 with an invalid password", async () => {
        return request(app)
            .post("/api/users/sign-up")
            .send({
                email: "test@test.com",
                passowrd: "p",
            })
            .expect(400);
    });

    it("return a 400 with missing email and password", async () => {
        await request(app).post("/api/users/sign-up").send({}).expect(400);
    });
});

// Sign in tests
describe("Sign In Tests", () => {
    it("return a 201 on successful sign-in", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
        await request(app).post("/api/users/sign-in").send(user).expect(201);
    });

    it("sets a cookie on successful sing-in", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
        const res = await request(app)
            .post("/api/users/sign-in")
            .send(user)
            .expect(201);
        expect(res.get("Set-Cookie")).toBeDefined();
    });

    it("return a 400 with an invalid email", async () => {
        await request(app)
            .post("/api/users/sign-in")
            .send({
                email: "teasdzxc",
                password: "password",
            })
            .expect(400);
    });

    it("return a 400 with invalid credentials", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
        await request(app)
            .post("/api/users/sign-in")
            .send({
                email: "test@test.com",
                password: "pass",
            })
            .expect(400);
        await request(app)
            .post("/api/users/sign-in")
            .send({
                email: "test@test2.com",
                password: "password",
            })
            .expect(400);
    });
});

// Sign out tests
describe("Sign Out tests", () => {
    it("clears the cookie after signing out", async () => {
        await request(app).post("/api/users/sign-up").send(user).expect(201);
        const res = request(app)
            .post("/api/users/sign-out")
            .send({})
            .expect(200);

        expect(res.get("Set-Cookie")).toBeUndefined();
    });
});

describe("Current User", () => {
    it('return the current user data',  async () => {
      
        const cookie = await global.signUp()
        const res = await request(app).get("/api/users/current-user").set("Cookie", cookie).send().expect(201)
        const body: currentUser = res.body.currentUser;
        expect(body.email).toEqual(user.email)
    })
    it('return null or undefined if user is not authenticated', async () => { 
        const res = await request(app).get("/api/users/current-user").send().expect(401)
        const body: currentUser = res.body.currentUser;
        expect(body).toBeUndefined() 
    })
});
