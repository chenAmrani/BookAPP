import initApp from "./app";

initApp().then((app) => {
  const port = process.env.PORT;
  app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
  });
});
