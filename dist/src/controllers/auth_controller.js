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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const google_auth_library_1 = require("google-auth-library");
const client = new google_auth_library_1.OAuth2Client();
const googleSignin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const ticket = yield client.verifyIdToken({
            idToken: req.body.credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload === null || payload === void 0 ? void 0 : payload.email;
        if (email != null) {
            let user = yield user_model_1.default.findOne({ email: email });
            if (user == null) {
                user = yield user_model_1.default.create({
                    name: payload === null || payload === void 0 ? void 0 : payload.name,
                    email: email,
                    password: "Signed up with a Google account",
                    image: payload === null || payload === void 0 ? void 0 : payload.picture,
                    isGoogleSsoUser: true,
                });
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRATION,
            });
            const refreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
            yield user.save();
            const userData = prepareUser(user);
            res.status(201).send({ accessToken, refreshToken, userData });
        }
    }
    catch (err) {
        return res.status(400).send(err.message);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;
    const name = req.body.name;
    if (!email || !password || !role || !name) {
        return res.status(400).send("missing email or password or role or name");
    }
    // Name validation
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    if (!nameRegex.test(name)) {
        return res.status(400).json({ error: "Invalid name format" });
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }
    // Password validation
    if (password.length < 6) {
        return res
            .status(400)
            .json({ error: "Password must be at least 6 characters long." });
    }
    try {
        const doesUserExists = yield user_model_1.default.findOne({ email: email });
        if (doesUserExists != null) {
            return res.status(406).send({ error: "email already exists" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_model_1.default.create({
            email: email,
            password: encryptedPassword,
            image: req.file ? req.file.filename : undefined,
            role: role,
            name: name,
        });
        const { accessToken, refreshToken } = generateJwtTokens(newUser._id);
        const userData = prepareUser(newUser);
        return res.status(201).send(Object.assign(Object.assign({}, userData), { accessToken, refreshToken }));
    }
    catch (err) {
        return res.status(400).send("Error: " + err.message);
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const user = yield user_model_1.default.findOne({ email: email });
        if (user == null) {
            return res.status(401).send("email or password incorrect");
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).send("email or password incorrect");
        }
        const { accessToken, refreshToken } = generateJwtTokens(user._id);
        yield user.save();
        const userData = prepareUser(user);
        return res.status(200).send({
            accessToken,
            refreshToken,
            userData,
        });
    }
    catch (err) {
        return res.status(400).send("error");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(401);
        try {
            return res.sendStatus(200);
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    console.log("refreshToken", refreshToken);
    if (refreshToken == null)
        return res.sendStatus(401).send("no token");
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log("refresh1", err);
            return res.sendStatus(401);
        }
        try {
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            return res.status(200).send({
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        }
        catch (err) {
            console.log("err!", err);
            res.sendStatus(401).send(err.message);
        }
    }));
});
exports.default = {
    register,
    login,
    logout,
    refresh,
    googleSignin,
};
function generateJwtTokens(userId) {
    const accessToken = jsonwebtoken_1.default.sign({ _id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jsonwebtoken_1.default.sign({ _id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
    return { accessToken, refreshToken };
}
function prepareUser(newUser) {
    const userData = newUser.toObject();
    delete userData.password;
    return userData;
}
//# sourceMappingURL=auth_controller.js.map