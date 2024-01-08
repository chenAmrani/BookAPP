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
// import createController from "./base_controller";
const base_controller_1 = require("./base_controller");
class bookController extends base_controller_1.BaseController {
    constructor() {
        super(book_model_1.default);
    }
    post(req, res) {
        const _super = Object.create(null, {
            post: { get: () => super.post }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("bookpost:" + req.body);
            const _id = req.user._id;
            req.body.author = _id;
            _super.post.call(this, req, res);
        });
    }
    putById(req, res) {
        const _super = Object.create(null, {
            putById: { get: () => super.putById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("bookput:" + req.body);
            const _id = req.params.id;
            req.body._id = _id;
            _super.putById.call(this, req, res);
        });
    }
}
exports.default = new bookController();
//# sourceMappingURL=book_controller.js.map