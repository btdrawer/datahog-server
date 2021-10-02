import { Request, Response } from "express";
import { handleError, HttpError } from "../utils/HttpError";
import WebhookService from "../services/WebhookService";
import { isConsumeInput } from "../types";

export default class WebhookController {
    webhookService: WebhookService;

    constructor() {
        this.webhookService = new WebhookService();
    }

    consume = async (req: Request, res: Response) => {
        const { body } = req;
        if (!isConsumeInput(body)) {
            return handleError(
                HttpError.badRequest(
                    `Request body was invalid: ${JSON.stringify(body)}`
                ),
                res
            );
        }
        const [response, _] = await Promise.all([
            res.status(200).send(),
            this.webhookService.sendPayload(body),
        ]);
        return response;
    };
}
