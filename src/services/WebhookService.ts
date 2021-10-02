import axios from "axios";
import RedisClient from "../clients/RedisClient";
import { getProviderResponse } from "../clients/providerClient";
import { ConsumeInput, Provider, ProviderOutput } from "../types";

export default class WebhookService {
    redisClient: RedisClient;

    constructor() {
        this.redisClient = new RedisClient();
    }

    getCachedData = async (provider: Provider): Promise<ProviderOutput> => {
        try {
            return this.redisClient.getCachedProviderResponse(provider);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    getData = async (provider: Provider): Promise<ProviderOutput> => {
        try {
            const providerResponse = await getProviderResponse(provider);
            return providerResponse.data;
        } catch (error) {
            return this.getCachedData(provider);
        }
    };

    private async sendToCallbackUrl(callbackUrl: string, data: ProviderOutput) {
        return axios.post(callbackUrl, data);
    }

    sendPayload = async ({ provider, callbackUrl }: ConsumeInput) => {
        const dataToSend = await this.getData(provider);
        const [response, _] = await Promise.all([
            this.sendToCallbackUrl(callbackUrl, dataToSend),
            this.redisClient.setCachedProviderResponse(provider, dataToSend),
        ]);
        return response;
    };
}
