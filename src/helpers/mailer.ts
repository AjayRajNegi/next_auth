import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/userModel";

interface SendMailParams {
  email: string;
  emailType: string;
  userId: string;
}

export const sendMail = async ({
  email,
  emailType,
  userId,
}: SendMailParams) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        $set: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "513194eb32d373",
        pass: "af8dd0a0aa6802",
      },
    });
    const mailOptions = {
      from: "",
      to: email,
      subject:
        emailType === "Verify" ? "Verify your email." : "Reset your password.",
      html: `<p>Click<a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">
      Here</a> to ${
        emailType === "VERIFY" ? "verify your email." : "reset your password."
      } or copy and paste the link below in your browser. <br> 
      ${process.env.DOMAIN}/verifyemail?token=${hashedToken} </p>`,
    };

    //Responsible for sending the email using the configured transporter created by Nodemailer
    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: unknown) {
    console.log("Could not connect to nodemailer.", error);
  }
};
