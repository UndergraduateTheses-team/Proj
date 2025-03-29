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
    `http://${process.env.TO_SERVER}:8090`,`http://${process.env.DOMAIN}`],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089;`  +
    "script-src 'self' https://unpkg.com; " + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089;`  +
    `media-src 'self' data: http://${process.env.ITSELF_IP}:8090 http://${process.env.TO_SERVER}:8089;`  +
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

