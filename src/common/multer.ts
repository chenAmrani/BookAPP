import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isBook = req.baseUrl.includes("/book");
    console.log("req", req);
    cb(null, path.join(process.cwd(), "static", isBook ? "books" : "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
