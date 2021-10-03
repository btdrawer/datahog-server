import express from "express";
import WebhookController from "./controllers/WebhookController";

const app = express();
const webhookController = new WebhookController();

app.use(express.json());

app.post("/", webhookController.consume);

export default app;
