import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.NGINX_SERVER_IP} http://${process.env.WEBPHIM}:3009 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    `script-src 'self' https://unpkg.com http://${process.env.NGINX_SERVER_IP} http://${process.env.WEBPHIM}:3009 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.NGINX_SERVER_IP} http://${process.env.WEBPHIM}:3009 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    `media-src 'self' blob: * data: http://${process.env.NGINX_SERVER_IP} http://${process.env.WEBPHIM}:3009 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    "worker-src 'self' blob: *;" +
    "font-src 'self' data: https://fonts.gstatic.com;"
  );
  next();

});


app.use(cors({
	origin: [
    `http://${process.env.NGINX_SERVER_IP}`,
    `http://${process.env.DOMAIN}`,
    `https://${process.env.DOMAIN}`,
    `http://www.${process.env.DOMAIN}`, 
    `https://www.${process.env.DOMAIN}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use(cookieParser());

const __dirname = path.dirname(fileURLToPath(import.meta.url));


app.use(express.static(path.resolve(__dirname, "../static")));

console.log("thu muc hien tai: ", __dirname);
app.use("/api", router);

mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => {
          console.log("Connect to db success");
              })
        .catch(err => console.error("Failed to connect to DB:", err));
app.listen(process.env.PORT, () => {
  console.log("Server is running 8089 port");
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