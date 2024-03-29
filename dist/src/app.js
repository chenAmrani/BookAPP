"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const book_routes_1 = __importDefault(require("./routes/book_routes"));
const review_routes_1 = __importDefault(require("./routes/review_routes"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
if (fs_1.default.existsSync(process.env.DOTENV_CONFIG_PATH)) {
    console.log('exists');
    dotenv_1.default.config({ path: process.env.DOTENV_CONFIG_PATH });
}
else {
    dotenv_1.default.config();
}
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use((0, cors_1.default)());
            app.use(express_1.default.json());
            app.use(express_1.default.urlencoded({ extended: true }));
            app.use("/book", book_routes_1.default);
            app.use("/review", review_routes_1.default);
            app.use("/auth", auth_route_1.default);
            app.use("/user", user_route_1.default);
            app.use('/static', express_1.default.static('static'));
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map