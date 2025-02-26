import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../static/uploads").replace("\\src", "")); // Chỉ đường dẫn tới thư mục uploads
  },
  filename: function (req, file, cb) {
    //const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      //file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      file.originalname
    );
  },
});

const upload = multer({ storage: storage });
export default upload;
