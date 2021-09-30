import express from "express";
import Controller from "./controllers/WebhookController";

const app = express();
const webhookController = new Controller();

app.use(express.json());

app.post("/", webhookController.consume);

export default app;
