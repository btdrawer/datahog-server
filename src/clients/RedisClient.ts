import Redis from "ioredis";
import { isProviderOutput, Provider, ProviderOutput } from "../types";

export default class RedisClient {
    redis: Redis.Redis;

    constructor() {
        this.redis = new Redis();
    }

    async getCachedProviderResponse(
        provider: Provider
    ): Promise<ProviderOutput> {
        const cachedResponse = await this.redis.get(provider);
        if (!isProviderOutput(cachedResponse)) {
            throw new Error();
        }
        return cachedResponse;
    }

    async setCachedProviderResponse(
        provider: Provider,
        data: ProviderOutput
    ): Promise<void> {
        await this.redis.set(provider, data);
    }
}
