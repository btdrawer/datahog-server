import {
    Provider,
    WebhookPayloadSuccess,
    WebhookPayloadFailure,
    webhookPayloadSuccess,
    webhookPayloadFailure,
} from "../../src/types";

export const exampleEvent = [
    {
        billedOn: "2021-01-01T10:00:00Z",
        amount: 15.92,
    },
];

export const exampleWebhookPayloadSuccess = (
    provider: Provider
): WebhookPayloadSuccess => webhookPayloadSuccess(provider, exampleEvent);

export const exampleWebhookPayloadSuccessWithoutLastUpdated = (
    provider: Provider
): Omit<WebhookPayloadSuccess, "lastUpdated"> => {
    return {
        success: true,
        provider,
        data: exampleEvent,
    };
};

export const exampleWebhookPayloadFailureNoCachedData = (
    provider: Provider
): WebhookPayloadFailure =>
    webhookPayloadFailure(
        provider,
        "The provider could not be reached and no cached data are available. Please try again later."
    );
