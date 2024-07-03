import morgan from "morgan";
import { Request } from "express";

morgan.token(
  "devlog",
  ({ body, query, params }: Request): string =>
    `\n[REQUEST INFO 🚀]: ${JSON.stringify({ body, query, params })} ` || ""
);

let customizedLogger = morgan(
  "\n:method :url :status - :response-time ms :devlog \n"
);
export default customizedLogger;
