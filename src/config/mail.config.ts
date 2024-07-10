import nodemailer from "nodemailer";
import config from ".";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: config.FROM_EMAIL,
    pass: config.MAIL_PASSWORD,
  },
});

export default transporter;
