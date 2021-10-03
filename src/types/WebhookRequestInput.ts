import { isUri } from "valid-url";
import { Provider } from "./Provider";

export interface WebhookRequestInput {
    provider: Provider;
    callbackUrl: string;
}

export const isWebhookRequestInput = (
    input: any
): input is WebhookRequestInput => {
    return (
        input.provider &&
        input.callbackUrl &&
        [Provider.Gas, Provider.Internet].includes(input.provider) &&
        isUri(input.callbackUrl)
    );
};
