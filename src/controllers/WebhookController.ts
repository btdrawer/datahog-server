import { Request, Response } from "express";
import HttpError from "../utils/HttpError";
import WebhookService from "../services/WebhookService";
import { isWebhookRequestInput } from "../types";

export default class WebhookController {
    webhookService: WebhookService;

    constructor() {
        this.webhookService = new WebhookService();
    }

    consume = async (req: Request, res: Response) => {
        const { body } = req;
        if (!isWebhookRequestInput(body)) {
            return HttpError.send(
                HttpError.badRequest(
                    `Request body was invalid: ${JSON.stringify(body)}`
                ),
                res
            );
        }
        const [response] = await Promise.all([
            res.status(200).send(),
            this.webhookService.sendPayload(body),
        ]);
        return response;
    };
}
