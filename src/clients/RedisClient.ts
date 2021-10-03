import Redis from "ioredis";
import HttpError from "../utils/HttpError";
import {
    isWebhookPayloadSuccess,
    Provider,
    WebhookPayload,
    webhookPayloadFailure,
} from "../types";

export default class RedisClient {
    redis: Redis.Redis;

    constructor() {
        this.redis = new Redis();
    }

    async getCachedWebhookPayload(provider: Provider): Promise<WebhookPayload> {
        try {
            const cachedResponse = await this.redis.get(provider);
            if (!cachedResponse) {
                throw HttpError.notFound();
            }
            const parsedCachedResponse = JSON.parse(cachedResponse);
            if (!isWebhookPayloadSuccess(parsedCachedResponse)) {
                throw HttpError.notFound();
            }
            return parsedCachedResponse;
        } catch (error) {
            console.error(error);
            return webhookPayloadFailure(
                "The provider could not be reached and no cached data are available. Please try again later."
            );
        }
    }

    async maybeSetCachedWebhookPayloadSuccess(
        provider: Provider,
        data: WebhookPayload
    ): Promise<void> {
        if (isWebhookPayloadSuccess(data)) {
            await this.redis.set(provider, JSON.stringify(data));
        }
    }
}
