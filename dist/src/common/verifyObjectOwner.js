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
const user_model_1 = __importDefault(require("../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyBookOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.sendStatus(401).send("missing authorization header");
        }
        //author id
        const ownerId = req.body.owner;
        if (!ownerId) {
            return res.status(400).send('author id required for verification');
        }
        const decoded = jsonwebtoken_1.default.decode(token);
        const userId = decoded._id; //the id of the user that is logged in
        const user = yield user_model_1.default.findOne({ _id: userId }); //checl if this exist user.
        if (!user || user._id.toString() !== ownerId) {
            return res.status(403).send('You do not have permission to modify this user');
        }
        next();
    }
    catch (err) {
        console.error('Error in verifyUserOwnership:', err);
        res.status(500).send('Internal Server Error -> verifyUserOwnership');
    }
});
exports.default = verifyBookOwner;
//# sourceMappingURL=verifyObjectOwner.js.map