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
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find();
        res.status(200).send({ users });
    }
    catch (error) {
        res.status(500).send({ message: "Error fetching users" });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield user_model_1.default.findById(id);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error in getUserById:", err);
        res.status(500).send("Internal Server Error -> getUserById");
    }
});
const getUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error("Error in getUserByEmail:", err);
        res.status(500).send("Internal Server Error");
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const { name, email, password } = req.body.user;
        if (!name && !email && !password) {
            res
                .status(400)
                .send("At least one field (name, email, or password) is required for update");
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { name, email, encryptedPassword }, { new: true });
        if (!updatedUser) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error in updateUser:", err);
        res.status(500).send("Internal Server Error -> updateUser");
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Controller - ID:", req.params.id);
        const deletedUser = yield user_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        console.error("Error in deleteUser:", err);
        res.status(500).send("Internal Server Error -> deleteUser");
    }
});
const updateOwnProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.locals`:", req.locals);
    const { currentUserId } = req.locals;
    if (!currentUserId) {
        res.status(400).send("User ID is required for updating the profile");
        return;
    }
    const { name, email, password } = req.body;
    if (!name && !email && !password) {
        res
            .status(400)
            .send("At least one field (name, email, or password) is required for update");
        return;
    }
    try {
        const updatedUserData = { name, email };
        if (password) {
            const salt = yield bcrypt_1.default.genSalt(10);
            updatedUserData.password = yield bcrypt_1.default.hash(password, salt);
        }
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(currentUserId, updatedUserData, { new: true }).select("-password");
        if (!updatedUser) {
            res.status(404).send("User not found");
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error("Error in updateOwnProfile:", err);
        res.status(500).send("Internal Server Error -> updateOwnProfile");
    }
});
//get my books
const getMyBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        console.log("the userr: ", user);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const myBooks = user.books || [];
        console.log("user.books: ", user.books);
        res.status(200).json({ myBooks });
    }
    catch (err) {
        console.error("Error in getMyBooks:", err);
        res.status(500).send("Internal Server Error -> getMyBooks");
    }
});
exports.default = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser,
    updateOwnProfile,
    getMyBooks,
};
//# sourceMappingURL=user_controller.js.map