import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import config from "./config";

const app: Application = express();

import router from "./routes";

//settings
app.set("port", config.PORT);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers response
app.use((req: Request, res: Response, next: NextFunction) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");
  next();
});

//routes
app.use("/api/v1", router);

//Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ error: err.message });
});

// database connection
mongoose
  .connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database is connected!"))
  .catch((err) => console.log(err));

export default app;
