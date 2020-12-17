import express, { Application } from "express";

const app: Application = express();

import router from "./routes";

//settings
app.set("port", 3000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", router);

export default app;
