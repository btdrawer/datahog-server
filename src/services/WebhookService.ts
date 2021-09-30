import RedisClient from "../clients/RedisClient";
import { getProviderResponse } from "../clients/providerClient";
import { callCallbackUrl } from "../clients/callbackUrlClient";
import { ConsumeInput, ProviderOutput } from "../types";
import { isStatusOk } from "../utils";

export default class WebhookService {
    redisClient: RedisClient;

    constructor() {
        this.redisClient = new RedisClient();
    }

    async sendPayload({ provider, callbackUrl }: ConsumeInput) {
        const providerResponse = await getProviderResponse(provider);
        const dataToSend: ProviderOutput = isStatusOk(providerResponse.status)
            ? providerResponse.data
            : await this.redisClient.getCachedProviderResponse(provider);
        await callCallbackUrl(callbackUrl, dataToSend);
    }
}
