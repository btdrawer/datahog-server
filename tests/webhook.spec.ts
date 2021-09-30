import Redis from "ioredis";
import request from "supertest";
import nock from "nock";
import { promisify } from "util";
import app from "../src/app";

const setTimeoutPromise = promisify(setTimeout);

const exampleEvent = [
    {
        billedOn: "",
        amount: 15.92,
    },
];

describe("Webhook", () => {
    it("should send body from internet provider to callback url", async () => {
        nock("http://localhost:3000")
            .get("/providers/internet")
            .reply(200, () => {
                return exampleEvent;
            });

        let requestBody = {};
        nock("http://localhost:3002")
            .post("/")
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post("/")
            .send({
                provider: "internet",
                callbackUrl: "http://localhost:3002",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);
                await setTimeoutPromise(1000);
                expect(requestBody).toEqual(exampleEvent);
            });
    });

    it("should send body from gas provider to callback url", async () => {
        nock("http://localhost:3000")
            .get("/providers/gas")
            .reply(200, () => {
                return exampleEvent;
            });

        let requestBody = {};
        nock("http://localhost:3002")
            .post("/")
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post("/")
            .send({
                provider: "gas",
                callbackUrl: "http://localhost:3002",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);
                await setTimeoutPromise(1000);
                expect(requestBody).toEqual(exampleEvent);
            });
    });

    it("should send cached body when provider is unavailable", async () => {
        nock("http://localhost:3000").get("/providers/gas").reply(500);

        jest.spyOn(Redis.prototype, "get").mockResolvedValue(exampleEvent);

        let requestBody = {};
        nock("http://localhost:3002")
            .post("/")
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post("/")
            .send({
                provider: "gas",
                callbackUrl: "http://localhost:3002",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);
                await setTimeoutPromise(1000);
                expect(Redis.prototype.get).toHaveBeenCalledTimes(1);
                expect(requestBody).toEqual(exampleEvent);
            });
    });

    it("should return 400 if provider is not recognised", async () => {
        return request(app)
            .post("/")
            .send({
                provider: "invalid-provider",
                callbackUrl: "http://localhost:3002",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });

    it("should return 400 if provided callbackUrl is invalid", async () => {
        return request(app)
            .post("/")
            .send({
                provider: "gas",
                callbackUrl: "invalid-url",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });

    it("should return 400 if request body has an otherwise invalid structure", async () => {
        return request(app)
            .post("/")
            .send({
                invalid: "property",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });
});
