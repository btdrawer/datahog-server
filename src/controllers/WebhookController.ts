import { Request, Response } from "express";
import WebhookService from "../services/WebhookService";
import { isConsumeInput } from "../types";
import { sendHttpError } from "../utils";

export default class WebhookController {
    webhookService: WebhookService;

    constructor() {
        this.webhookService = new WebhookService();
    }

    async consume(req: Request, res: Response) {
        const { body } = req;
        if (!isConsumeInput(body)) {
            return sendHttpError(res, 400, "Request body was invalid.");
        }
        this.webhookService.sendPayload(body);
        return res.status(200);
    }
}
