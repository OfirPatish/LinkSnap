import express from "express";
import dotenv from "dotenv";
import shortenRouter from "./routes/shorten.js";
import redirectRouter from "./routes/redirect.js";
import statsRouter from "./routes/stats.js";
import { initDb } from "./db.js";
import { corsMiddleware } from "./middleware/cors.js";
import { DEFAULT_PORT } from "./constants/index.js";

dotenv.config();

const PORT = Number(process.env.PORT) || DEFAULT_PORT;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Routes
app.use("/api/shorten", shortenRouter);
app.use("/api/stats", statsRouter);

// Health check (must be before redirect router)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/", redirectRouter); // Must be last to catch slug routes

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
  });
