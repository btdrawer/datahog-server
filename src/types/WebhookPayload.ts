import { isProviderData, ProviderData } from "./Provider";

export interface WebhookPayloadSuccess {
    success: true;
    data: ProviderData;
    lastUpdated: string;
}

export interface WebhookPayloadFailure {
    success: false;
    message: string;
}

export type WebhookPayload = WebhookPayloadSuccess | WebhookPayloadFailure;

export const webhookPayloadSuccess = (
    data: ProviderData
): WebhookPayloadSuccess => {
    return {
        success: true,
        data,
        lastUpdated: Date.now().toString(),
    };
};

export const webhookPayloadFailure = (
    message: string
): WebhookPayloadFailure => {
    return {
        success: false,
        message,
    };
};

export const isWebhookPayloadSuccess = (
    input: any
): input is WebhookPayloadSuccess => {
    return input.success && isProviderData(input.data) && input.lastUpdated;
};
