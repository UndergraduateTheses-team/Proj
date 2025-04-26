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
const uploadFile = (req, res) => {
  const file = req.file;
  try {
    if (file) {
      
      const filePath =
        `${process.env.FQDN}/` +
        req.file.path.substring(req.file.path.indexOf("uploads"));
      console.log("filepath:", filePath);
      logger.info("filepath:", filePath);
      return res.status(201).json(filePath);
    } else {
      return res.status(400).json({
        message: "khong the upload file",
      });
    }
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export default uploadFile;
