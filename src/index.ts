import { connect } from "mongoose";
import app from "./app";
import config from "./config";
import CustomError from "./utils/customError.util";
import cloudinaryConfig from "./config/cloudinary.config";

//callbacks for error
const handleError = (err: any) => {
  console.log(`[ERROR 🔴]: ${err}`);
};

//callback for port listening
const listeningPort = () => {
  console.log(`server is running at http://localhost:${config.PORT}`);
};

(async () => {
  try {
    //listening port
    app.listen(config.PORT, listeningPort);
    //connect to database using mongoose
    await connect(config.MONGOURL);
    console.log("DB connected....");

    //handling error
    app.on("error", handleError);

    // Initialize Cloudinary configuration
    cloudinaryConfig();
  } catch (error) {
    handleError(error);
  }
})();
