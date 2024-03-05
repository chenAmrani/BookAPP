import env from "dotenv";
console.log(process.env.NODE_ENV);
env.config();

console.log(process.env.DB_URL);
import initApp from "./app";
import swaggerUI from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from "path";


initApp().then((app) => {
  console.log('Server started')
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Web Advanced Application Development 2024 REST API",
        version: "1.0.1",
        description:
          "REST server including authentication using JWT refresh token",
      },
      servers: [{ url: "http://localhost:6969" }],
    },
    apis: ["./src/routes/*.ts"],
  };
  const specs = swaggerJsDoc(options);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
 

  if (process.env.NODE_ENV !== 'production') {
    console.log('development');
    http.createServer(app).listen(process.env.PORT);
  }
  else {
  console.log('PRODUCTION');
  const options2 = {
    key: fs.readFileSync(path.join(__dirname,'../../client-key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'../../client-cert.pem')),
  };
  https.createServer(options2, app).listen(process.env.HTTPS_PORT);
 }
});