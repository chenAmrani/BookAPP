"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
// import http from 'http';
(0, app_1.default)().then((app) => {
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
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
    // if (process.env.NODE_ENV !== 'production') {
    //   console.log('development');
    //   http.createServer(app).listen(process.env.PORT);
    // }
});
//# sourceMappingURL=server.js.map