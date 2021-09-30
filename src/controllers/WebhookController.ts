import { Request, Response } from "express";
import WebhookService from "../services/WebhookService";
import { isConsumeInput } from "../types";
import { sendHttpError } from "../utils";

export default class WebhookController {
    webhookService: WebhookService;

    constructor() {
        this.webhookService = new WebhookService();
    }

    consume = async (req: Request, res: Response) => {
        const { body } = req;
        if (!isConsumeInput(body)) {
            return sendHttpError(res, 400, "Request body was invalid.");
        }
        const [response, _] = await Promise.all([
            res.status(200).send(),
            this.webhookService.sendPayload(body),
        ]);
        return response;
    };
}
