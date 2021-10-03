import nock from "nock";
import { Provider } from "../../src/types";
import { exampleEvent } from "./testData";

export const providerHost = "http://localhost:3000";
export const callbackHost = "http://localhost:3002";

export const rootEndpoint = "/";
export const internetProviderEndpoint = `/providers/${Provider.Internet}`;
export const gasProviderEndpoint = `/providers/${Provider.Gas}`;

export const mockSuccessfulInternetProviderResponse = () => {
    nock(providerHost)
        .get(internetProviderEndpoint)
        .reply(200, () => {
            return exampleEvent;
        });
};

export const mockSuccessfulGasProviderResponse = () => {
    nock(providerHost)
        .get(gasProviderEndpoint)
        .reply(200, () => {
            return exampleEvent;
        });
};

export const mockFailedGasProviderResponse = () => {
    nock(providerHost).get(gasProviderEndpoint).reply(500);
};

export const mockCallbackRequest = () => {
    nock(callbackHost).post(rootEndpoint).reply(200);
};
