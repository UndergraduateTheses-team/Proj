import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
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
// Lấy đường dẫn thư mục hiện tại
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../static/uploads")); // Chỉ đường dẫn tới thư mục uploads
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(file);
    logger.info(file);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
export default upload;