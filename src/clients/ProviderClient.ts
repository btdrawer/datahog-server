import axios, { AxiosResponse } from "axios";
import { PROVIDER_HOST, PROVIDER_PORT } from "../utils/config";
import { Provider, ProviderDataEntry } from "../types";

type ProviderAxiosResponse = Promise<AxiosResponse<ProviderDataEntry[]>>;

export default class ProviderClient {
    private static buildUri(endpoint: string): string {
        return `${PROVIDER_HOST}:${PROVIDER_PORT}/providers${endpoint}`;
    }

    private static async getGas(): ProviderAxiosResponse {
        return axios.get(this.buildUri("/gas"));
    }

    private static async getInternet(): ProviderAxiosResponse {
        return axios.get(this.buildUri("/internet"));
    }

    static async getProviderResponse(
        provider: Provider
    ): ProviderAxiosResponse {
        switch (provider) {
            case Provider.Gas:
                return this.getGas();
            case Provider.Internet:
                return this.getInternet();
        }
    }
}
