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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token)
        return res.sendStatus(401);
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log("err", err);
                if (err.message === "jwt expired") {
                    return res.status(401).json({ error: "Token is expired" });
                }
                //console.error('Token Verification Error:', err);
                return res.status(401).json({ error: "Token is not valid" });
            }
            req.user = user;
            req.locals = req.locals || {};
            req.locals.currentUserId = user._id;
            console.log("User", user);
            next();
        });
    }
    catch (err) {
        console.error("Unexpected Error:", err);
        res.status(500).send("Internal Server Error");
    }
});
exports.default = authMiddleware;
//# sourceMappingURL=auth_middleware.js.map