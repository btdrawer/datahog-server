import axios from "axios";
import RedisClient from "../clients/RedisClient";
import ProviderClient from "../clients/ProviderClient";
import {
    WebhookRequestInput,
    Provider,
    WebhookPayload,
    webhookPayloadSuccess,
} from "../types";

export default class WebhookService {
    redisClient: RedisClient;

    constructor() {
        this.redisClient = new RedisClient();
    }

    private getWebhookPayload = async (
        provider: Provider
    ): Promise<WebhookPayload> => {
        try {
            const { data } = await ProviderClient.getProviderResponse(provider);
            return webhookPayloadSuccess(provider, data);
        } catch (error) {
            return this.redisClient.getCachedWebhookPayload(provider);
        }
    };

    private async sendToCallbackUrl(
        callbackUrl: string,
        payload: WebhookPayload
    ) {
        return axios.post(callbackUrl, payload);
    }

    sendPayload = async ({ provider, callbackUrl }: WebhookRequestInput) => {
        const payload = await this.getWebhookPayload(provider);
        const [response] = await Promise.all([
            this.sendToCallbackUrl(callbackUrl, payload),
            this.redisClient.maybeSetCachedWebhookPayloadSuccess(
                provider,
                payload
            ),
        ]);
        return response;
    };
}
