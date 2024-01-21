import path from "path";
import multer from "multer";
//check
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "static", "uploads"));
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "." + extension);
  },
});

export const upload = multer({ storage });
