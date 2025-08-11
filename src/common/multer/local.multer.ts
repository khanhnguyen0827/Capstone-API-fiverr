import * as multer from 'multer';
import * as path from 'path';
import * as fs from "fs"

fs.mkdirSync("images/", { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    // console.log({ extName });
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'local' + '-' + uniqueSuffix + extName);
  },
});

export const uploadLocal = {
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // giới hạn 1 MB
  },
};
// 1024 byte
// 1KB = 1* 1024 byte
// 1MB = 1 * 1024 *1024

