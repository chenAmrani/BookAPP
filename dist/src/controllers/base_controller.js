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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.putById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, obj } = req.body;
                console.log("The id is: " + id);
                console.log("The obj is: " + obj);
                const updatedBook = yield this.model.findByIdAndUpdate(id, obj, {
                    new: true,
                });
                console.log("The updatedBook is: " + updatedBook);
                console.log("The updatedBook is: " + updatedBook);
                res.status(200).send(updatedBook);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAll");
            try {
                if (req.query.name) {
                    const obj = yield this.model.find({ name: req.query.name });
                    res.send(obj);
                }
                else {
                    if (req.user && req.user.role === "admin") {
                        // Access to all books for admin
                        const allObjects = yield this.model.find();
                        res.send(allObjects);
                    }
                    else {
                        // Access to books based on user or default behavior
                        const obj = yield this.model.find({
                        /* Your condition here */
                        });
                        res.send(obj);
                    }
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield this.model.findById(req.params.id);
                res.send(book);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingBook = yield this.model.findOne({
                    name: req.body.name,
                    author: req.body.author,
                });
                if (existingBook) {
                    res.status(406).send("Book already exists");
                    return;
                }
                const obj = yield this.model.create(req.body);
                res.status(201).send(obj);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("deleteById:" + req.body);
            try {
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send("OK");
            }
            catch (err) {
                res.status(406).send("fail: " + err.message);
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map