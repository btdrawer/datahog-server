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

export const exampleWebhookPayloadSuccess: WebhookPayloadSuccess =
    webhookPayloadSuccess(exampleEvent);

export const exampleWebhookPayloadSuccessWithoutLastUpdated: Omit<
    WebhookPayloadSuccess,
    "lastUpdated"
> = {
    success: true,
    data: exampleEvent,
};

export const exampleWebhookPayloadFailureNoCachedData: WebhookPayloadFailure =
    webhookPayloadFailure(
        "The provider could not be reached and no cached data are available. Please try again later."
    );
