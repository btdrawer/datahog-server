import express from "express";
import Controller from "./controllers/WebhookController";
import { HOST, PORT } from "./config";

const app = express();
const webhookController = new Controller();

app.use(express.json());

app.post("/", webhookController.consume);

app.listen(PORT, () => console.log(`Server listening at ${HOST}:${PORT}`));
