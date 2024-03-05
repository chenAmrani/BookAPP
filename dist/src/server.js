"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
console.log(process.env.NODE_ENV);
console.log(process.env.DOTENV_CONFIG_PATH);
if (fs_1.default.existsSync(process.env.DOTENV_CONFIG_PATH)) {
    console.log('exists');
    dotenv_1.default.config({ path: process.env.DOTENV_CONFIG_PATH });
}
else {
    dotenv_1.default.config();
}
console.log(process.env.DB_URL);
const app_1 = __importDefault(require("./app"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
(0, app_1.default)().then((app) => {
    console.log('Server started');
    const options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: "Web Advanced Application Development 2024 REST API",
                version: "1.0.1",
                description: "REST server including authentication using JWT refresh token",
            },
            servers: [{ url: "http://localhost:6969" }],
        },
        apis: ["./src/routes/*.ts"],
    };
    const specs = (0, swagger_jsdoc_1.default)(options);
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs));
    if (process.env.NODE_ENV !== 'production') {
        console.log('development');
        http_1.default.createServer(app).listen(process.env.PORT);
    }
    else {
        console.log('PRODUCTION');
        const options2 = {
            key: fs_1.default.readFileSync(path_1.default.join(__dirname, '../../client-key.pem')),
            cert: fs_1.default.readFileSync(path_1.default.join(__dirname, '../../client-cert.pem')),
        };
        https_1.default.createServer(options2, app).listen(process.env.HTTPS_PORT);
    }
});
//# sourceMappingURL=server.js.map