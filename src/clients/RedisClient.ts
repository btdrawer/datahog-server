import Redis from "ioredis";
import { HttpError } from "../utils/HttpError";
import { isProviderOutput, Provider, ProviderOutput } from "../types";

export default class RedisClient {
    redis: Redis.Redis;

    constructor() {
        this.redis = new Redis();
    }

    private notFoundError() {
        return HttpError.notFound(
            "No data was found for this provider. Please try again later."
        );
    }

    async getCachedProviderResponse(
        provider: Provider
    ): Promise<ProviderOutput> {
        const cachedResponse = await this.redis.get(provider);
        if (!cachedResponse) {
            throw this.notFoundError();
        }
        const parsedCachedResponse = JSON.parse(cachedResponse);
        if (!isProviderOutput(parsedCachedResponse)) {
            throw this.notFoundError();
        }
        return parsedCachedResponse;
    }

    async setCachedProviderResponse(
        provider: Provider,
        data: ProviderOutput
    ): Promise<void> {
        await this.redis.set(provider, JSON.stringify(data));
    }
}
