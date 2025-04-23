import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import pino from 'pino'
import ecsFormat from '@elastic/ecs-pino-format'

const transport = pino.transport({
    target: 'pino/file',
    options: { destination: "var/pinolog/log.json", mkdir: true, colorize: false }
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
dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.MEDIA_SERVER}:8090 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    `script-src 'self' https://unpkg.com https://unpkg.com/ionicons@7.1.0/dist/ionicons/p-d15ec307.js  http://${process.env.MEDIA_SERVER}:8090 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.MEDIA_SERVER}:8090 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    `media-src 'self' blob: * data: http://${process.env.MEDIA_SERVER}:8090 http://${process.env.DOMAIN} https://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://www.${process.env.DOMAIN} http://${process.env.FE_SERVER}:3009 ; ` +
    "worker-src 'self' blob: *;" +
    "font-src 'self' data: https://fonts.gstatic.com;"
  );
  next();

});


app.use(cors({
	origin: [
    `http://${process.env.DOMAIN}`,
    `https://${process.env.DOMAIN}`,
    `http://www.${process.env.DOMAIN}`,
    `https://www.${process.env.DOMAIN}`,
    `http://${process.env.FE_SERVER}:3009`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use(cookieParser());

const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.static(path.resolve(__dirname, "../static")));

console.log("thu muc hien tai: ", __dirname);
logger.info("thu muc hien tai: ", __dirname);
app.use("/api", router);

mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => {
          console.log("Connect to db success");
          logger.info("Connect to db success");
              })
        .catch(err => console.error("Failed to connect to DB:", err));
app.listen(process.env.PORT, () => {
  console.log("Server is running 8089 port");
  logger.info("Server is running 8089 port");
});

// app.use(
//   express.static(path.resolve(__dirname, "../build"), {
//     setHeaders: (res, path) => {
//       res.removeHeader("Content-Security-Policy");
//     },
//   })
// );
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../build/index.html"));
// });