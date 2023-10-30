require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const { User } = require("../../models/user");

mongoose.set("strictQuery", false);

const { HOST_TEST_URI } = process.env;
const newUser = {
    email: "Dadad@gmail.com",
    password: "Dadad1234",
}
const newUser2 = {
    email: "Fafaf@gmail.com",
    password: "Fafaf1234",
}
const newUserNotValid = {
    email: "Dadad_gmail.com",
    password: "ad1",
}
const newUserBadEmail = {
    email: "Dada@gmail.com",
    password: "Dadad1234",
};
const newUserBadPassword = {
    email: "Dadad@gmail.com",
    password: "adad1234",
};

describe("user regisrt/login", () => {

    beforeAll(async () => {
        await mongoose.connect(HOST_TEST_URI);

        await User.deleteMany();
    }, 20000);

    afterAll(() => {
        mongoose.disconnect(HOST_TEST_URI);
    });

    it("registration with invalid email or password", async () => {
        const response = await request(app).post("/api/users/register").send(newUserNotValid);
        expect(response.statusCode).toBe(400);
        console.log(response.statusCode, response._body.message);
    });

    it("registration new user", async () => {
        const response = await request(app).post("/api/users/register").send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body.user.email).toBe(newUser.email);
        console.log(response.statusCode, response._body.message);
    });

    it("registration user with existing name", async () => {
        await request(app).post("/api/users/register").send(newUser2);

        const response = await request(app).post("/api/users/register").send(newUser2);

        expect(response.statusCode).toBe(409);
        console.log(response.statusCode, response._body.message);
    });


    it('login with invalid email or password', async () => {
        const response = await request(app).get('/api/users/login').send(newUserNotValid);
        expect(response.statusCode).toBe(400);
        console.log(response.statusCode, response._body.message);
    });

    it('login user', async () => {
        const response = await request(app).get('/api/users/login').send(newUser);

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
        expect(response.body.user.email).toBe(newUser.email);
        expect(response.body.user.subscription).toBe('starter' || 'pro' || 'business');

        console.log(response.statusCode, response._body.message);
    });

    it('login with wrong password', async () => {
        const response = await request(app).get('/api/users/login').send(newUserBadPassword);
        expect(response.statusCode).toBe(401);
        console.log(response.statusCode, response._body.message);
    });

    it('login with wrong email', async () => {
        const response = await request(app).get('/api/users/login').send(newUserBadEmail);
        expect(response.statusCode).toBe(401);
        console.log(response.statusCode, response._body.message);
    });

});