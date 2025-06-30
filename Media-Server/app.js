import express from "express";
import upload from "../Media-Server/configs/multerConfig.js";
import uploadController from "../Media-Server/Controller/UploadController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { logger } from "./utils/logger.js";
import client from "prom-client";

dotenv.config();

// Prometheus setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequestCounter = new client.Counter({
  name: "myapp_http_request_count",
  help: "Count of HTTP requests",
  labelNames: ["method", "route", "statusCode"]
});
register.registerMetric(httpRequestCounter);

// Constants for reuse
const allowedOrigins = [
  `http://${process.env.API_SERVER}:8089`,
  `http://${process.env.DOMAIN}`,
  `https://${process.env.DOMAIN}`,
  `http://www.${process.env.DOMAIN}`,
  `https://www.${process.env.DOMAIN}`,
  `http://${process.env.FE_SERVER}:3009`
];

const cspPolicy = `
  default-src 'self' blob: ${allowedOrigins.join(" ")};
  script-src 'self' https://unpkg.com ${allowedOrigins.join(" ")};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
  img-src 'self' data: ${allowedOrigins.join(" ")};
  media-src 'self' blob: * data: ${allowedOrigins.join(" ")};
  worker-src 'self' blob: *;
  font-src 'self' data: https://fonts.gstatic.com;
`.replace(/\n/g, "").trim();

const app = express();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", cspPolicy);
  next();
});

app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), "static")));

// Routes
app.post("/uploads", upload.single("file"), uploadController);

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.use("/*", (req, res, next) => {
  httpRequestCounter.labels({
    method: req.method,
    route: req.originalUrl,
    statusCode: res.statusCode
  }).inc();
  next();
});

// Crash test endpoint
app.get("/crash", (req, res) => {
  res.send("Crash scheduled");
  setTimeout(() => {
    nonexistentFunction(); // This will trigger an uncaught exception
  }, 0);
});

// Error handling
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception, shutting down API-Server");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled promise rejection, shutting down API-Server");
  process.exit(1);
});

// Start server
app.listen(process.env.PORT || 8090, () => {
  console.log("Server is running on port 8090");
  logger.info("Server is running on port 8090");
});