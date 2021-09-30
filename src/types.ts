import { isUri } from "valid-url";

export enum Provider {
    Gas = "gas",
    Internet = "internet",
}

export interface ConsumeInput {
    provider: Provider;
    callbackUrl: string;
}

export interface ProviderOutputEntry {
    billedOn: string;
    amount: number;
}

export type ProviderOutput = ProviderOutputEntry[];

export const isConsumeInput = (input: any): input is ConsumeInput => {
    return (
        input.provider &&
        input.callbackUrl &&
        [Provider.Gas, Provider.Internet].includes(input.provider) &&
        isUri(input.callbackUrl)
    );
};

export const isProviderOutputEntry = (
    input: any
): input is ProviderOutputEntry => {
    return input.billedOn && input.amount;
};

export const isProviderOutput = (input: any): input is ProviderOutput => {
    return Array.isArray(input) && input.every(isProviderOutputEntry);
};
