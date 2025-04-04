import dotenv from 'dotenv';
dotenv.config();

const uploadFile = (req, res) => {
  const file = req.file;
  try {
    if (file) {
      
      const filePath =
        `${process.env.FQDN}/` +
        req.file.path.substring(req.file.path.indexOf("uploads"));
      console.log("filepath:", filePath);
      return res.status(201).json(filePath);
    } else {
      return res.status(400).json({
        message: "khong the upload file",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default uploadFile;
