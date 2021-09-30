import axios from "axios";
import RedisClient from "../clients/RedisClient";
import { getProviderResponse } from "../clients/providerClient";
import { ConsumeInput, ProviderOutput } from "../types";
import { isStatusOk } from "../utils";

export default class WebhookService {
    redisClient: RedisClient;

    constructor() {
        this.redisClient = new RedisClient();
    }

    private async sendToCallbackUrl(callbackUrl: string, data: ProviderOutput) {
        return axios.post(callbackUrl, data);
    }

    sendPayload = async ({ provider, callbackUrl }: ConsumeInput) => {
        const providerResponse = await getProviderResponse(provider);
        const dataToSend: ProviderOutput = isStatusOk(providerResponse.status)
            ? providerResponse.data
            : await this.redisClient.getCachedProviderResponse(provider);
        return this.sendToCallbackUrl(callbackUrl, dataToSend);
    };
}
