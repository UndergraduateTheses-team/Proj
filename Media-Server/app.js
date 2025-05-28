import express from "express";
import upload from "../Media-Server/configs/multerConfig.js";
import uploadController from "../Media-Server/Controller/UploadController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
// import { Server } from "ws";
dotenv.config();
import pino from 'pino'
import ecsFormat from '@elastic/ecs-pino-format'

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: process.env.destpinolog, mkdir: true, colorize: false }
});
const logger = pino({
    level: 'info',
    formatters: {
        level: (label) => {
            return { level: label.toUpperCase() };
        }
    },

    timestamp: () => `,"time":"${new Date().toLocaleTimeString()}"` 
}, transport, ecsFormat())

const app = express();

app.use(cors({
  origin: [
    `http://${process.env.API_SERVER}:8089`,
    `http://${process.env.DOMAIN}`,
    `https://${process.env.DOMAIN}`,
    `http://www.${process.env.DOMAIN}`,
    `https://www.${process.env.DOMAIN}`,
    `http://${process.env.FE_SERVER}:3009`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.API_SERVER}:8089 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    `script-src 'self' https://unpkg.com http://${process.env.API_SERVER}:8089 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.API_SERVER}:8089 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    `media-src 'self' blob: * data: http://${process.env.API_SERVER}:8089 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    "worker-src 'self' blob: *;" +
    "font-src 'self' data: https://fonts.gstatic.com;"
  );
  next();
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "static")));
app.post("/uploads", upload.single("file"), uploadController);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8090");
  logger.info("Server is running on port 8090");
});

