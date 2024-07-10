import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import mailService from "../services/mail.service";

export const defaultController = (_: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
export const test = asyncHandler(async (req, res) => {
  // await UserSchema.findUserByToken("dsdsdsd");
  // let UserData: IUser = await UserSchema.create({
  //   name: "ggg",
  //   email: "gg@token.com",
  //   password: "123456789",
  //   role: "user",
  // });
  // res.json({ user: UserData });
  // console.log(req.protocol, req.hostname, req.path, req.headers);

  // console.log(path.join(__dirname, "templates"));
  await mailService(
    {
      to: "",
      subject: "",
    },
    (err: any, response: any) => {
      if (err) return res.status(500).send(err.message);
      res.status(201).send("User registered. Verification email sent.");
    },
    {
      fileName: "test.ejs",
      payload: {
        name: "dinesh",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem esse ex, tempora modi reiciendis eveniet dicta inventore. Quisquam voluptates tenetur, architecto totam laudantium voluptatum doloremque veritatis ex natus impedit assumenda?",
      },
    }
  );
});
