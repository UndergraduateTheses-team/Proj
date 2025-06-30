import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import pinoHttp from "pino-http";
import { logger } from "../utils/logger.js";
import { startDiskMonitor } from "../utils/checkdisk.js";
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
  `http://${process.env.MEDIA_SERVER}:8090`,
  `http://${process.env.DOMAIN}`,
  `https://${process.env.DOMAIN}`,
  `http://www.${process.env.DOMAIN}`,
  `https://www.${process.env.DOMAIN}`,
  `http://${process.env.FE_SERVER}:3009`
];
const cspPolicy = `
  default-src 'self' blob: ${allowedOrigins.join(" ")};
  script-src 'self' https://unpkg.com https://unpkg.com/ionicons@7.1.0/dist/ionicons/p-d15ec307.js ${allowedOrigins.join(" ")};
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/;
  img-src 'self' data: ${allowedOrigins.join(" ")};
  media-src 'self' blob: * data: ${allowedOrigins.join(" ")};
  worker-src 'self' blob: *;
  font-src 'self' data: https://fonts.gstatic.com;
`.replace(/\n/g, "").trim();

const app = express();

// Middleware
app.use(express.json());
app.use(pinoHttp({ logger }));
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", cspPolicy);
  next();
});
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../static")));

// Routes
app.use("/api", router);
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});
app.get("/crash", (req, res) => {
  res.send("Crash scheduled");
  setTimeout(() => {
    nonexistentFunction(); // Triggers uncaught exception
  }, 0);
});

// Metrics middleware
app.use("/*", (req, res, next) => {
  httpRequestCounter.labels({
    method: req.method,
    route: req.originalUrl,
    statusCode: res.statusCode
  }).inc();
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connect to db success");
    logger.info("Connect to db success");
  })
  .catch(err => {
    console.error("Failed to connect to DB:", err);
    logger.error({ err }, "Failed to connect to MongoDB.");
  });

// Start server and monitoring
app.listen(process.env.PORT || 8089, () => {
  console.log("Server is running on port 8089");
  logger.info("Server is running on port 8089");
  startDiskMonitor();
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