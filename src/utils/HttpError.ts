import { Response } from "express";

export class HttpError extends Error {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }

    static toHttpError(error: Error): HttpError {
        if (error instanceof HttpError) {
            return error;
        }
        console.error(error);
        return HttpError.internalServerError();
    }

    static badRequest(message: string) {
        return new HttpError(400, message);
    }

    static notFound(
        message: string = "The resource was not found."
    ): HttpError {
        return new HttpError(404, message);
    }

    static internalServerError(
        message: string = "An internal error occurred."
    ): HttpError {
        return new HttpError(500, message);
    }
}

export function handleError(err: Error, res: Response) {
    const { statusCode, message } = HttpError.toHttpError(err);
    return res.status(statusCode).send(message);
}
