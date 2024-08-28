import { Router } from "express";
import auth from "./auth.route";
import photo from "./photo.route";
import user from "./user.route";
import address from "./address.route";
import product from "./product.route";
import category from "./category.route";
import shop from "./shop.route";
import cart from "./cart.route";
import { defaultController, test } from "../controllers/notfound.controller";
const router = Router();

router.use("/auth", auth);
router.use("/photo", photo);
router.use("/user", user);
router.use("/address", address);
router.use("/product", product);
router.use("/category", category);
router.use("/cart", cart);
router.use("/shop", shop);

// testing routes
router.post("/tests", test);
router.use("*", defaultController);
export default router;

// for later use
// import path from "path";

// const router = Router();
// const readed = readdirSync(__dirname);

// (async () => {
//     for (let i = 0; i < readed.length; i++) {
//       const fileName = readed[i];
//       if (fileName !== "index.js") {
//         const route = "/" + fileName.replace(".route.js", "");

//           const fileExport = await import(path.join(__dirname, fileName));
//           if (fileExport && fileExport.default) {
//             router.use(route, fileExport.default);
//           }
//       }
//     }

// })();
