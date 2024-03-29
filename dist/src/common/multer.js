"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    // where we save the image
    destination: function (req, file, cb) {
        const isBook = req.baseUrl.includes("/book");
        console.log("req", req);
        cb(null, path_1.default.join(process.cwd(), "static", isBook ? "books" : "uploads"));
    },
    // what we name the image
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
exports.upload = (0, multer_1.default)({ storage });
//# sourceMappingURL=multer.js.map