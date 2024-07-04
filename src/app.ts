import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import router from "./routes";
import customizedLogger from "./services/customizedLogger";
import errorHandler from "./middlewares/errorHandler";
import fileUpload from "express-fileupload";
const app: Application = express();

// logger
app.use(customizedLogger);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());

// file upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//route
app.use("/", router);

// Register error handler middleware in Express
app.use(errorHandler);

export default app;
