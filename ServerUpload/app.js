import express from "express";
import upload from "../ServerUpload/configs/multerConfig.js";
import uploadController from "../ServerUpload/Controller/UploadController.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
  origin: [
    `http://${process.env.NGINX_SERVER_IP}`,
    `http://${process.env.TO_SERVER}:8089`,
    `http://${process.env.DOMAIN}`,
    `https://${process.env.DOMAIN}`,
    `http://www.${process.env.DOMAIN}`, 
    `https://www.${process.env.DOMAIN}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.NGINX_SERVER_IP} http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    `script-src 'self' https://unpkg.com http://${process.env.NGINX_SERVER_IP} http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.NGINX_SERVER_IP} http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    `media-src 'self' blob: * data: http://${process.env.NGINX_SERVER_IP} http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089 http://${process.env.DOMAIN} http://www.${process.env.DOMAIN} https://${process.env.DOMAIN} https://www.${process.env.DOMAIN} ; ` +
    "worker-src 'self' blob: *;" +
    "font-src 'self' data: https://fonts.gstatic.com;"
  );
  next();
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "static")));
app.post("/uploads", upload.single("file"), uploadController);

app.listen(process.env.PORT, () => {
  console.log(" Server run in server 8090");
});

