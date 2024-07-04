import { connect } from "mongoose";
import app from "./app";
import config from "./config";
import CustomError from "./services/CustomError";
import cloudinaryConfig from "./config/cloudinary.config";

//callbacks for error
const handleError = (err: any) => {
  throw new CustomError(err.message, 503);
};

//callback for port listening
const listeningPort = () => {
  console.log(`server is running at http://localhost:${config.PORT}`);
};

(async () => {
  try {
    //connect to database using mongoose
    await connect(config.MONGOURL);
    console.log("DB connected....");

    //listening port
    app.listen(config.PORT, listeningPort);
    //handling error
    app.on("error", handleError);
  } catch (error) {
    handleError(error);
  }
})();

cloudinaryConfig();
