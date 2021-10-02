import axios, { AxiosResponse } from "axios";
import { PROVIDER_HOST, PROVIDER_PORT } from "../utils/config";
import { Provider, ProviderOutput } from "../types";

type ProviderAxiosResponse = Promise<AxiosResponse<ProviderOutput>>;

const buildUri = (endpoint: string): string => {
    return `${PROVIDER_HOST}:${PROVIDER_PORT}/providers${endpoint}`;
};

const getGas = async (): ProviderAxiosResponse => axios.get(buildUri("/gas"));

const getInternet = async (): ProviderAxiosResponse =>
    axios.get(buildUri("/internet"));

export const getProviderResponse = async (
    provider: Provider
): ProviderAxiosResponse => {
    switch (provider) {
        case Provider.Gas:
            return getGas();
        case Provider.Internet:
            return getInternet();
    }
};
