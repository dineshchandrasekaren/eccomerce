import { MailOptions } from "nodemailer/lib/json-transport";
import transporter from "../config/mail.config";
import { getPath } from "../getPath";
import { renderFile } from "ejs";
import config from "../config";
interface TemplateOptions extends MailOptions {
  fileName?: string; // make sure the file in templates folder
  payload?: { [key: string]: string };
}

const mailService = async (
  mailOptions: MailOptions,
  next: any,
  { fileName, payload }: TemplateOptions = {}
) => {
  await transporter.sendMail(
    {
      from: { name: "Dinesh C", address: config.FROM_EMAIL },
      ...mailOptions,
      html: fileName
        ? await renderFile(getPath("templates", fileName), payload)
        : undefined,
    },
    next
  );
};

export default mailService;
