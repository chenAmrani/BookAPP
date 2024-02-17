"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const book_model_1 = __importDefault(require("../models/book_model"));
const base_controller_1 = require("./base_controller");
const user_model_1 = __importDefault(require("../models/user_model"));
class bookController extends base_controller_1.BaseController {
    constructor() {
        super(book_model_1.default);
        this.getBooks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.name) {
                    const obj = yield this.model.find({ name: req.query.name });
                    res.send(obj);
                }
                else {
                    const allObjects = yield this.model.find().populate({
                        path: "reviews",
                        populate: [
                            { path: "reviewerId", select: "name image isGoogleSsoUser" },
                        ],
                    });
                    res.send(allObjects);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
        this.post = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.user._id;
                req.body.author = _id;
                const existingBook = yield this.model.findOne({
                    name: req.body.name,
                    author: req.body.author,
                });
                if (existingBook) {
                    res.status(406).send("Book already exists");
                    return;
                }
                const book = Object.assign(Object.assign({}, req.body), { image: req.file.filename });
                const createdBook = yield this.model.create(book);
                if (createdBook) {
                    const user = yield user_model_1.default.findById(_id);
                    if (user) {
                        user.books.push(createdBook.id);
                        yield user.save();
                    }
                    else {
                        res.status(404).send("User not found");
                        return;
                    }
                }
                else {
                    res.status(500).send("Error creating book");
                    return;
                }
                res.status(201).send(createdBook);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
        this.putById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const obj = req.body;
                const updatedBook = yield this.model.findByIdAndUpdate(id, obj, {
                    new: true,
                });
                res.status(200).send(updatedBook);
            }
            catch (err) {
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield this.model.findById(req.params.id);
                const authorId = book === null || book === void 0 ? void 0 : book.author;
                const user = yield user_model_1.default.findById(authorId);
                user.books = user.books.filter((bookId) => bookId !== req.params.id);
                yield user.save();
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send("OK");
            }
            catch (err) {
                res.status(406).send("fail: " + err.message);
            }
        });
    }
}
exports.default = new bookController();
//# sourceMappingURL=book_controller.js.map