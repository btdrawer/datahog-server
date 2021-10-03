import { Response } from "express";

export default class HttpError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

    static send(error: HttpError, res: Response) {
        const { statusCode, message } = error;
        return res.status(statusCode).send(message);
    }

    static badRequest(message: string) {
        return new HttpError(400, message);
    }

    static notFound(
        message: string = "The resource was not found."
    ): HttpError {
        return new HttpError(404, message);
    }
}
