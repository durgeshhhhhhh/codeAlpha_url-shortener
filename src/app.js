import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import redirectRoutes from "./routes/redirect.js";
import env from "dotenv"

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api", apiRoutes);
app.use("/", redirectRoutes);

app.listen(port, () => {
  console.log("Server is running on port ", port);
});

export default app;
