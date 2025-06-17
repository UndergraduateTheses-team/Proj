import express from "express";
import upload from "../Media-Server/configs/multerConfig.js";
import uploadController from "../Media-Server/Controller/UploadController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
import pinoHttp from 'pino-http'
dotenv.config();
import { logger } from "./utils/logger.js";

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception, shutting down API-Server')
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled promise rejection, shutting down API-Server')
  process.exit(1)
})

// const httpLogger = pinoHttp({ logger })
const app = express();
// app.use(httpLogger);
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


//crash scheduled for pino test
app.get('/crash', (req, res) => {
  setTimeout(() => {

    nonexistentFunction();
  }, 0); 
  res.send('Crash scheduled');
});