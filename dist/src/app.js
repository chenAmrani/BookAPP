"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const book_routes_1 = __importDefault(require("./routes/book_routes"));
const book_post_routes_1 = __importDefault(require("./routes/book_post_routes"));
const initApp = () => {
    const promise = new Promise((resolve) => {
        const db = mongoose_1.default.connection;
        db.once("open", () => console.log("Connected to Database"));
        db.on("error", (error) => console.error(error));
        const url = process.env.DB_URL;
        mongoose_1.default.connect(url).then(() => {
            const app = (0, express_1.default)();
            app.use(body_parser_1.default.json());
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use("/book", book_routes_1.default);
            app.use("/bookpost", book_post_routes_1.default);
            resolve(app);
        });
    });
    return promise;
};
exports.default = initApp;
//# sourceMappingURL=app.js.map