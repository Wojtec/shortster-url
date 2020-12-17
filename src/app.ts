import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import mongoose from "mongoose";
import config from "./config";

const app: Application = express();

import router from "./routes";

//settings
app.set("port", 3000);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", router);

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
