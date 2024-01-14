import initApp from "./app";
import swaggerUI from "swagger-ui-express"
import swaggerJsDoc from "swagger-jsdoc"
// import http from 'http';


initApp().then((app) => {
  const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "Web Advanced Application Development 2024 REST API",
          version: "1.0.1",
          description: "REST server including authentication using JWT refresh token",
        },
        servers: [{url: "http://localhost:6969",},],
      },
      apis: ["./src/routes/*.ts"],
    };
    const specs = swaggerJsDoc(options);
    app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  // if (process.env.NODE_ENV !== 'production') {
  //   console.log('development');
  //   http.createServer(app).listen(process.env.PORT);
  // }
});


