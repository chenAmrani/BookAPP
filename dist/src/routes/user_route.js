"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
const veifyOwenership_midleeware_1 = __importDefault(require("../common/veifyOwenership_midleeware"));
const admin_middleware_1 = __importDefault(require("../common/admin_middleware"));
const router = express_1.default.Router();
//Admin
router.get("/", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getAllUsers);
router.get("/id:", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.getUserById);
router.put("/update", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.updateUser);
router.delete("/delete/:id", auth_middleware_1.default, admin_middleware_1.default, user_controller_1.default.deleteUser);
//author
router.get("/books", auth_middleware_1.default, user_controller_1.default.getMyBooks);
router.delete("/:id", auth_middleware_1.default, veifyOwenership_midleeware_1.default, user_controller_1.default.deleteUser);
//updating the user profile by himself.
router.put('/updateOwnProfile', auth_middleware_1.default, veifyOwenership_midleeware_1.default, user_controller_1.default.updateOwnProfile);
//get user by email
router.get('/:email', auth_middleware_1.default, user_controller_1.default.getUserByEmail);
exports.default = router;
//# sourceMappingURL=user_route.js.map