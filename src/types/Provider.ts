export enum Provider {
    Gas = "gas",
    Internet = "internet",
}

export interface ProviderDataEntry {
    billedOn: string;
    amount: number;
}

export type ProviderData = ProviderDataEntry[];

export const isProviderDataEntry = (input: any): input is ProviderDataEntry => {
    return input.billedOn && input.amount;
};

export const isProviderData = (input: any): input is ProviderData => {
    return Array.isArray(input) && input.every(isProviderDataEntry);
};
