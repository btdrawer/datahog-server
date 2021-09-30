import app from "./app";
import { HOST, PORT } from "./config";

app.listen(PORT, () => console.log(`Server listening at ${HOST}:${PORT}`));
