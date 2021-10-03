import request from "supertest";
import nock from "nock";
import { promisify } from "util";
import app from "../src/app";
import RedisClient from "../src/clients/RedisClient";
import {
    Provider,
    WebhookPayloadSuccess,
    WebhookPayloadFailure,
} from "../src/types";
import {
    exampleWebhookPayloadSuccessWithoutLastUpdated,
    exampleWebhookPayloadFailureNoCachedData,
    exampleWebhookPayloadSuccess,
} from "./utils/testData";
import {
    callbackHost,
    rootEndpoint,
    mockSuccessfulInternetProviderResponse,
    mockSuccessfulGasProviderResponse,
    mockFailedGasProviderResponse,
    mockCallbackRequest,
} from "./utils/http";
import { resetRedisKey } from "./utils/redis";

const setTimeoutPromise = promisify(setTimeout);

describe("Webhook", () => {
    const redisClient = new RedisClient();

    it("should send body from internet provider to callback url", async () => {
        mockSuccessfulInternetProviderResponse();

        let requestBody = {};
        nock(callbackHost)
            .post(rootEndpoint)
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Internet,
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);

                await setTimeoutPromise(1000);

                const WebhookPayloadSuccess =
                    requestBody as WebhookPayloadSuccess;
                expect(WebhookPayloadSuccess).toEqual(
                    expect.objectContaining(
                        exampleWebhookPayloadSuccessWithoutLastUpdated
                    )
                );
                expect(WebhookPayloadSuccess.lastUpdated).toBeDefined();
            });
    });

    it("should send body from gas provider to callback url", async () => {
        mockSuccessfulGasProviderResponse();

        let requestBody = {};
        nock(callbackHost)
            .post(rootEndpoint)
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);

                await setTimeoutPromise(1000);

                const WebhookPayloadSuccess =
                    requestBody as WebhookPayloadSuccess;
                expect(WebhookPayloadSuccess).toEqual(
                    expect.objectContaining(
                        exampleWebhookPayloadSuccessWithoutLastUpdated
                    )
                );
                expect(WebhookPayloadSuccess.lastUpdated).toBeDefined();
            });
    });

    it("should cache provider output", async () => {
        await resetRedisKey(redisClient, Provider.Gas);
        mockSuccessfulGasProviderResponse();
        mockCallbackRequest();

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: callbackHost,
            })
            .then(async () => {
                await setTimeoutPromise(1000);

                const cachedProviderOutput =
                    await redisClient.getCachedWebhookPayload(Provider.Gas);

                expect(cachedProviderOutput).toEqual(
                    expect.objectContaining(
                        exampleWebhookPayloadSuccessWithoutLastUpdated
                    )
                );
            });
    });

    it("should send cached body when provider is unavailable", async () => {
        await redisClient.maybeSetCachedWebhookPayloadSuccess(
            Provider.Gas,
            exampleWebhookPayloadSuccess
        );
        mockFailedGasProviderResponse();

        let requestBody = {};
        nock(callbackHost)
            .post(rootEndpoint)
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);

                await setTimeoutPromise(1000);

                const WebhookPayloadSuccess =
                    requestBody as WebhookPayloadSuccess;
                expect(WebhookPayloadSuccess).toEqual(
                    expect.objectContaining(
                        exampleWebhookPayloadSuccessWithoutLastUpdated
                    )
                );
                expect(WebhookPayloadSuccess.lastUpdated).toBeDefined();
            });
    });

    it("should send a failure when provider is unavailable and no cached data is found", async () => {
        await resetRedisKey(redisClient, Provider.Gas);
        mockFailedGasProviderResponse();

        let requestBody = {};
        nock(callbackHost)
            .post(rootEndpoint)
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);

                await setTimeoutPromise(2000);

                const WebhookPayloadFailure =
                    requestBody as WebhookPayloadFailure;
                expect(WebhookPayloadFailure).toEqual(
                    exampleWebhookPayloadFailureNoCachedData
                );
            });
    });

    it("should send a failure when provider is unavailable and cached data is corrupted", async () => {
        await redisClient.redis.set(
            Provider.Gas,
            JSON.stringify({
                invalid_webhook_payload: "value",
            })
        );
        mockFailedGasProviderResponse();

        let requestBody = {};
        nock(callbackHost)
            .post(rootEndpoint)
            .reply(200, (uri, body) => {
                requestBody = body;
            });

        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(200);

                await setTimeoutPromise(2000);

                const WebhookPayloadFailure =
                    requestBody as WebhookPayloadFailure;
                expect(WebhookPayloadFailure).toEqual(
                    exampleWebhookPayloadFailureNoCachedData
                );
            });
    });

    it("should return 400 if provider is not recognised", async () => {
        return request(app)
            .post(rootEndpoint)
            .send({
                provider: "invalid-provider",
                callbackUrl: callbackHost,
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });

    it("should return 400 if provided callbackUrl is invalid", async () => {
        return request(app)
            .post(rootEndpoint)
            .send({
                provider: Provider.Gas,
                callbackUrl: "invalid-url",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });

    it("should return 400 if request body has an otherwise invalid structure", async () => {
        return request(app)
            .post(rootEndpoint)
            .send({
                invalid: "property",
            })
            .then(async (response) => {
                expect(response.statusCode).toEqual(400);
            });
    });
});
