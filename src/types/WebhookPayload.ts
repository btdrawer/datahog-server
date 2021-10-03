import { Provider } from ".";
import { isProviderData, ProviderData } from "./Provider";

export interface WebhookPayloadSuccess {
    success: true;
    provider: Provider;
    data: ProviderData;
    lastUpdated: string;
}

export interface WebhookPayloadFailure {
    success: false;
    provider: Provider;
    message: string;
}

export type WebhookPayload = WebhookPayloadSuccess | WebhookPayloadFailure;

export const webhookPayloadSuccess = (
    provider: Provider,
    data: ProviderData
): WebhookPayloadSuccess => {
    return {
        success: true,
        provider,
        data,
        lastUpdated: Date.now().toString(),
    };
};

export const webhookPayloadFailure = (
    provider: Provider,
    message: string
): WebhookPayloadFailure => {
    return {
        success: false,
        provider,
        message,
    };
};

export const isWebhookPayloadSuccess = (
    input: any
): input is WebhookPayloadSuccess => {
    return input.success && isProviderData(input.data) && input.lastUpdated;
};
