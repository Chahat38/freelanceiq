import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

import healthHandler from "./api/health";
import generateHandler from "./api/ai/generate";
import emailReminderHandler from "./api/reminders/email";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// API Routes routing to Vercel serverless function handlers
app.all("/api/health", (req, res) => healthHandler(req, res));
app.all("/api/ai/generate", (req, res) => generateHandler(req, res));
app.all("/api/reminders/email", (req, res) => emailReminderHandler(req, res));

// Vite middleware or production static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FreelanceIQ AI OS Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
