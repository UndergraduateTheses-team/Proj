const uploadFile = (req, res) => {
  const file = req.file;
  try {
    if (file) {
      console.log("is it working?");
      const filePath =
        "http://35.240.234.86:8090" +
        req.file.path.substring(req.file.path.indexOf("/upload"));
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
