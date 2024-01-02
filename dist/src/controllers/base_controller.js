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
exports.BaseConstroller = void 0;
class BaseConstroller {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAllBooks");
            try {
                if (req.query.name) {
                    const books = yield this.model.find();
                    res.send(books);
                }
                else {
                    const books = yield this.model.find();
                    res.send(books);
                }
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getBookById:" + req.params.id);
            try {
                const student = yield this.model.findById(req.params.id);
                res.send(student);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("postBook:", req.body);
            const { name } = req.body;
            try {
                const existingBook = yield this.model.findOne({ name });
                if (existingBook) {
                    return res.status(406).json({ message: "Duplicate book entry" });
                }
                const obj = yield this.model.create(req.body);
                res.status(201).send(obj);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    // async post(req: Request, res: Response) {
    //     console.log("postBook:" + req.body);
    //     try {
    //         const obj = await this.model.create(req.body);
    //         res.status(201).send(obj);
    //     } catch (err) {
    //         console.log(err);
    //         res.status(406).send("fail: " + err.message);
    //     }
    // }
    putById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("putStudent:" + req.body);
            try {
                yield this.model.findByIdAndUpdate(req.params.id, req.body);
                const obj = yield this.model.findById(req.params.id);
                res.status(200).send(obj);
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("deleteById:" + req.body);
            try {
                yield this.model.findByIdAndDelete(req.params.id);
                res.status(200).send("OK");
            }
            catch (err) {
                console.log(err);
                res.status(406).send("fail: " + err.message);
            }
        });
    }
}
exports.BaseConstroller = BaseConstroller;
const createController = (model) => {
    return new BaseConstroller(model);
};
exports.default = createController;
//# sourceMappingURL=base_controller.js.map