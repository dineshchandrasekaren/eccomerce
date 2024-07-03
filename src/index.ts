import { connect } from "mongoose";
import app from "./app";
import config from "./config";

//callbacks
const handleError = (err: unknown) => {
  console.log("ERROR: ", err);
  throw err;
};

const listeningPort = () => {
  console.log(`server is running at http://localhost:${config.PORT}`);
};

(async () => {
  try {
    //connect to database using mongoose
    await connect(config.MONGOURL);
    console.log("DB connected....");

    //handling error
    app.on("error", handleError);

    //listening port
    app.listen(config.PORT, listeningPort);
  } catch (error) {
    handleError(error);
  }
})();
