import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
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

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.log("Could not connect to nodemailer.", error);
  }
};
