const multer = require('multer');
const path = require('path');
require('dotenv').config();
const FileManager = require('../utils/files');
const fileHandler = new FileManager();

const tempFolder = process.env.TMP_FOLDER || '/tmp/uploads';
// Define the storage engine and destination folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFolder =  tempFolder;
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + fileExtension);
  },
});


const upload = multer({ storage });

module.exports = upload;
