import RedisClient from "../../src/clients/RedisClient";

export const resetRedisKey = (redisClient: RedisClient, key: string) => {
    return redisClient.redis.set(key, "");
};
