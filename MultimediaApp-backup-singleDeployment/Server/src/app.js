import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();
import upload from "./configs/multerConfig.js";
import uploadController from "./controllers/UploadController.js"

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `default-src 'self' blob: http://${process.env.SERVER_UPLOAD_URL}; ` +
    "script-src 'self' https://unpkg.com; " + 
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/; " + 
    `img-src 'self' data: http://${process.env.SERVER_UPLOAD_URL}; ` +
    `media-src 'self' blob: * data: http://${process.env.SERVER_UPLOAD_URL}; ` +
    "worker-src 'self' blob: *;" +
    "font-src 'self' data: https://fonts.gstatic.com;"
  );
  next();

});


app.use(cors({
	origin: "*",
	credentials: true,
}));

app.use(cookieParser());
app.post("/uploads", upload.single("file"), uploadController);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(
  express.static(path.resolve(__dirname, "../build"), {
    setHeaders: (res, path) => {
      res.removeHeader("Content-Security-Policy");
    },
  })
);
app.use(express.static(path.resolve(__dirname, "../static")));
console.log("thu muc hien tai: ", __dirname);

app.use("/api", router);
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../build/index.html"));
});
mongoose.connect(`${process.env.MONGODB_URI}`)
        .then(() => {
          console.log("Connect to db success");
              })
        .catch(err => console.error("Failed to connect to DB:", err));
app.listen(8089, () => {
  console.log("Server is running 8089 port");
});






//   res.setHeader(
//     "Content-Security-Policy-Report-Only",
//     "default-src 'self' blob: http://35.240.234.86:8090; img-src 'self' data: http://35.240.234.86:8090;"
// );
