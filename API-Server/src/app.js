import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import pinoHttp from 'pino-http'
import { logger } from "../utils/logger.js"
import { startDiskMonitor } from "../utils/checkdisk.js";
import client from "prom-client";


process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception, shutting down API-Server')
  process.exit(1)
})

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled promise rejection, shutting down API-Server')
  process.exit(1)
})

const register = new client.Registry();
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({
    register
});


const app = express();

// app.use(httpLogger);
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
logger.info(`thu muc hien tai: ${__dirname}`);
app.get("/metrics", async (req, res) => {
    res.setHeader("Content-Type", client.register.contentType);
    let metrics = await register.metrics();
    res.send(metrics);
});
const http_request_counter = new client.Counter({
    name: 'myapp_http_request_count',
    help: 'Count of HTTP requests',
    labelNames: ['method', 'route', 'statusCode']
});

register.registerMetric(http_request_counter);

app.use("/*", function(req, res, next) {
    http_request_counter.labels({
        method: req.method,
        route: req.originalUrl,
        statusCode: res.statusCode
    }).inc();
    console.log(register.metrics());
    next();
});

app.use("/api", router);


mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => {
          console.log("Connect to db success");
          logger.info("Connect to db success");
              })
        .catch(err => {
          console.error("Failed to connect to DB:", err);
          logger.error({err}, "Failed to connect to mongoDB.");
        }
          
        );

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8089");
  logger.info("Server is running on port 8089");
});

startDiskMonitor();



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


//crash scheduled for pino test
app.get('/crash', (req, res) => {
  setTimeout(() => {

    nonexistentFunction();
  }, 0); 
  res.send('Crash scheduled');
});
// app.get('/logreqres', (req, res) => {
  
//   res.send(req.params);
// });
// throw new Error()






// const client = require("prom-client");
// const bodyParser = require("body-parser");

// const register = new client.Registry();

// // Configure default Prometheus labels
// register.setDefaultLabels({
//     app: "blue",
// });

// // Define Prometheus metrics
// const http_request_counter = new client.Counter({
//     name: 'myapp_http_request_count',
//     help: 'Count of HTTP requests',
//     labelNames: ['method', 'route', 'statusCode']
// });
// const userCounter = new client.Counter({
//     name: "user_counter",
//     help: "User counter for my application"
// });

// // Register Prometheus metrics with the registry
// register.registerMetric(http_request_counter);
// register.registerMetric(userCounter);

// app.get("/metrics", async (req, res) => {
//     res.setHeader("Content-Type", client.register.contentType);
//     let metrics = await register.metrics();
//     res.send(metrics);
// });



// // Collect default Prometheus metrics (e.g., CPU, memory)
// client.collectDefaultMetrics({
//     register
// });

// // Define a Prometheus histogram for response time
// const restResponseTimeHistogram = new client.Histogram({
//     name: 'rest_response_time_duration_seconds',
//     help: 'REST API response time in seconds',
//     labelNames: ['method', 'route', 'status_code']
// });


// ________________

// app.get("/*", (req, res) => {
//     userCounter.inc();
//     console.log(register.metrics());
//     res.send("test");
// });

// // Middleware to count HTTP requests and log metrics
// app.use("/*", function(req, res, next) {
//     http_request_counter.labels({
//         method: req.method,
//         route: req.originalUrl,
//         statusCode: res.statusCode
//     }).inc();
//     console.log(register.metrics());
//     next();
// });
//-------------------------------------------
// const httpLogger = pinoHttp({
//     logger,
//     serializers: {
//       req: (req) => ({
//         method: req.method,
//         url: req.url,
//         headers: {
//             'OS platform': req.headers['sec-ch-ua-platform'],
//             'Browser':          req.headers['sec-ch-ua'],
//             'remoteAddress': req.remoteAddress,
//             'remotePort':    req.remotePort,
//           },
//     }),

//       res: (res) => ({
//         statusCode: res.statusCode,
//       }),
//     },
// })