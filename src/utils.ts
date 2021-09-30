import { Response } from "express";

export const sendHttpError = (
    res: Response,
    statusCode: number,
    message: string
) => {
    return res.status(statusCode).send(
        JSON.stringify({
            message,
        })
    );
};

export const isStatusOk = (statusCode: number) =>
    statusCode >= 200 && statusCode <= 299;
