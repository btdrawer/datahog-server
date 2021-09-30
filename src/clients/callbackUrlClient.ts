import axios, { AxiosResponse } from "axios";

export const callCallbackUrl = async (
    callbackUrl: string,
    data: {
        [key: string]: any;
    }
): Promise<AxiosResponse<any>> => axios.post(callbackUrl, data);
